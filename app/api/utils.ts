import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

let _prisma: PrismaClient | null = null;

export function getPrismaClient() {
  if (!_prisma) {
    _prisma = new PrismaClient();
  };
  return _prisma;
}

export function errorResponse(e: unknown, status: number) {
  return NextResponse.json({
    error: {
      message:
        typeof e === "object" && e !== null && "message" in e
          ? e.message
          : "unknown error",
    },
  }, { status });
}
