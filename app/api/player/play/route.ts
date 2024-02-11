import { NextResponse } from "next/server";
import { status, playlist } from "../command";
import { errorResponse } from "../../utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const file = searchParams.get("file");
  if (!file) {
    return errorResponse(
      {
        message: "Specify the file to play in a `file` query string parameter",
      },
      400
    );
  }

  try {
    await status({ command: "pl_empty" });
    await status({ command: "in_play", input: file });

    return NextResponse.json({ data: {} });
  } catch (e) {
    return errorResponse(e, 500);
  }
}
