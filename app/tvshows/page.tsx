import VideoList from "../components/VideoList";

export default async function TvShows() {
  return <VideoList title="TV Shows" path={process.env.NEXT_PUBLIC_SHOWS_ROOT ?? '/'} />;
}
