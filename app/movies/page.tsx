import VideoList from "../components/VideoList";

export default async function TvShows() {
  return <VideoList title="Movies" path={process.env.NEXT_PUBLIC_MOVIES_ROOT ?? '/'} />;
}
