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
    <main className="mx-auto max-w-3xl p-6 pt-12 sm:p-12">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-6 sm:pb-12">
        <h1 className="text-2xl">{title}</h1>
        <Link href="/" className="mt-4 sm:mt-0 bg-transparent hover:bg-red-700 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-700 hover:border-transparent text-center rounded">back</Link>
      </div>
      <section>
        <FileTree fileTree={fileTree} />
      </section>
    </main>
  );
}
