import { NextResponse } from "next/server";
import { status, playlist } from "../command";
import { errorResponse } from "../../utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NUMBER_REGEXP = /^\d+$/;

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const value = searchParams.get("value");
  if (!value || !value.match(NUMBER_REGEXP)) {
    return errorResponse(
      {
        message:
          "Specify the value to seek to in `value` query string parameter",
      },
      400
    );
  }
  const val = parseInt(value, 10);

  try {
    await status({ command: "pl_play" });
    await status({ command: "seek", val });

    return NextResponse.json({ data: {} });
  } catch (e) {
    return errorResponse(e, 500);
  }
}
