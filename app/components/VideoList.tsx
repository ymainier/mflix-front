import Link from "next/link";
import FileTree from "../components/FileTree";
import { buildFileTree } from "../lib/buildFileTree";

export default async function VideoList({
  title,
  path,
}: {
  title: string;
  path: string;
}) {
  const result = await fetch(`http://192.168.1.5:3000/find?dir=${path}`);
  const json = await result.json();
  const sortedFiles = (json.data.files || []).sort();
  const dir = path.endsWith("/") ? path : `${path}/`;
  const fileTree = buildFileTree(sortedFiles, dir);

  return (
    <main className="p-6 pt-12 md:p-12">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-6 md:pb-12">
        <h1 className="text-2xl">{title}</h1>
        <Link href="/">back</Link>
      </div>
      <section>
        <FileTree fileTree={fileTree} />
      </section>
    </main>
  );
}
