import { exec } from "node:child_process";
import { promisify } from "node:util";
import { NextResponse } from "next/server";
import { errorResponse } from "../../utils";
import prisma from "@/app/lib/prisma";

const promisifiedExec = promisify(exec);

const AUTHORISED_PATH = [
  process.env.NEXT_PUBLIC_SHOWS_ROOT,
  process.env.NEXT_PUBLIC_MOVIES_ROOT,
];

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get("path");
    if (!path) {
      return errorResponse({ message: "specify a path query parameter" }, 400);
    }
    if (!AUTHORISED_PATH.includes(path)) {
      return errorResponse(
        { message: `path can only be in [${AUTHORISED_PATH.join(", ")}]` },
        400
      );
    }
    const paths = await promisifiedExec(
      `find ${path} -type f -name \\*.mp4 -o -name \\*.mkv -o -name \\*.avi`
    ).then((result) => result.stdout.trim().split("\n").sort());
    const existingVideoPathsArray = await prisma.video.findMany({
      select: { path: true },
    });
    const showsToRemove = new Set(
      existingVideoPathsArray
        .map((s) => s.path)
        .filter((p) => p.startsWith(path))
    );
    for (const path of paths) {
      await prisma.video.upsert({
        where: { path },
        create: { path },
        update: {},
      });
      showsToRemove.delete(path);
    }
    for (const path of showsToRemove) {
      await prisma.video.delete({ where: { path } });
    }
    await prisma.$disconnect();

    return NextResponse.json({ data: null });
  } catch (e) {
    return errorResponse(e, 500);
  }
}
