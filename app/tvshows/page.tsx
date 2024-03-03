import VideoList from "../components/VideoList";
import { FileObject } from "../lib/buildFileTree";
import { filenameParse } from "@ctrl/video-filename-parser";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TvShows() {
  return (
    <VideoList
      title="TV Shows"
      path={process.env.NEXT_PUBLIC_SHOWS_ROOT ?? "/"}
      tvShow
    />
  );
}
