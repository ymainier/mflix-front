import { exec } from "node:child_process";
import { promisify } from "node:util";
import { NextResponse } from "next/server";
import { status, playlist } from "../command";
import { errorResponse } from "../../utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const promisifiedExec = promisify(exec);

export async function POST() {
  try {
    const {stdout, stderr} = await promisifiedExec(`echo "as" | cec-client -s -d 1`);

    return NextResponse.json({ data: { stdout, stderr } });
  } catch (e) {
    return errorResponse(e, 500);
  }
}
