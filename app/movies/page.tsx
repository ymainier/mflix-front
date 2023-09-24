import VideoList from "../components/VideoList";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function TvShows() {
  return <VideoList title="Movies" path={process.env.NEXT_PUBLIC_MOVIES_ROOT ?? '/'} />;
}
