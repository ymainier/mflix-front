import Link from "next/link";
import FileTree from "../components/FileTree";
import { buildFileTree } from "../lib/buildFileTree";
import prisma from "../lib/prisma";
import Update from "./Update";

export default async function VideoList({
  title,
  path,
}: {
  title: string;
  path: string;
}) {
  const files = await prisma.video.findMany({
    where: { path: { startsWith: path } },
    orderBy: { path: "asc" },
  });

  const dir = path.endsWith("/") ? path : `${path}/`;
  const fileTree = buildFileTree(files, dir);

  return (
    <main className="mx-auto max-w-3xl p-6 pt-12 sm:p-12">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-6 sm:pb-12">
        <div className="flex gap-4">
          <h1 className="text-2xl">{title}</h1>
          <Update dir={dir.substring(0, dir.length - 1)} />
        </div>
        <Link
          href="/"
          className="mt-4 sm:mt-0 bg-transparent hover:bg-red-700 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-700 hover:border-transparent text-center rounded"
        >
          back
        </Link>
      </div>
      <section>
        <FileTree fileTree={fileTree} />
      </section>
    </main>
  );
}
