import { NextResponse } from "next/server";
import { status, playlist } from "../command";
import { errorResponse } from "../../utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST() {
  try {
    await status({ command: "pl_pause" });

    return NextResponse.json({ data: {} });
  } catch (e) {
    return errorResponse(e, 500);
  }
}
