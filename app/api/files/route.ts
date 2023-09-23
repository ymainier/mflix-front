import { NextResponse } from "next/server";
import { errorResponse } from "../utils";
import prisma from "@/app/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get("path");
    if (!path) {
      return errorResponse({ message: "specify a path query parameter" }, 400);
    }
    const files = await prisma.video.findMany({ where: { path: { startsWith: path } } });
    await prisma.$disconnect();

    return NextResponse.json({ data: { files } });
  } catch (e) {
    return errorResponse(e, 500);
  }
}
