import { NextResponse } from "next/server";
import { errorResponse } from "../../utils";
import prisma from "@/app/lib/prisma";

type ParsedParameters = { isCompleted?: boolean; secondsPlayed?: number };
function parseUpdateParameters(
  searchParams: URLSearchParams
): ParsedParameters {
  const update: ParsedParameters = {};
  const isCompleted = searchParams.get("isCompleted");
  const secondsPlayed = parseInt(searchParams.get("secondsPlayed") ?? "", 10);
  if (isCompleted === "true" || isCompleted === "false") {
    update.isCompleted = isCompleted === "true";
  }
  if (!isNaN(secondsPlayed)) {
    update.secondsPlayed = secondsPlayed;
  }
  return update;
}

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get("path");
    if (!path) {
      return errorResponse({ message: "specify a path query parameter" }, 400);
    }
    const update = parseUpdateParameters(searchParams);
    if (
      typeof update.isCompleted === "undefined" &&
      typeof update.secondsPlayed === "undefined"
    ) {
      return errorResponse(
        {
          message:
            "specify either a isCompleted or secondsPlayed query parameter, or both",
        },
        400
      );
    }

    const result = await prisma.video.updateMany({
      where: { path: { startsWith: path } },
      data: update,
    });
    await prisma.$disconnect();

    return NextResponse.json({ data: null });
  } catch (e) {
    return errorResponse(e, 500);
  }
}
