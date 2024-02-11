import { NextResponse } from "next/server";
import { status, playlist } from "../command";
import { errorResponse } from "../../utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const [statusData, playlistData] = await Promise.all([
      status(),
      playlist(),
    ]);
    const maybeUri: string | undefined = playlistData?.children?.find(
      (child: { name?: string }) => child.name === "Playlist"
    )?.children?.[0]?.uri;
    const fullpath =
      typeof maybeUri !== "undefined"
        ? decodeURI(new URL(maybeUri).pathname)
        : undefined;

    return NextResponse.json({
      data: {
        status: statusData.state,
        time: statusData.time,
        length: statusData.length,
        fullpath,
      },
    });
  } catch (e) {
    return errorResponse(e, 500);
  }
}
