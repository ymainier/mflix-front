import { exec } from "node:child_process";
import { promisify } from "node:util";
import { NextResponse } from "next/server";
import { errorResponse } from "../../utils";
import prisma from "@/app/lib/prisma";
import { filenameParse } from "@ctrl/video-filename-parser";

const promisifiedExec = promisify(exec);

const AUTHORISED_PATH = [
  process.env.NEXT_PUBLIC_SHOWS_ROOT,
  process.env.NEXT_PUBLIC_MOVIES_ROOT,
];

const SEASON_REGEX = /^(?:s|season) *(\d+)$/i;

async function updateVideo(videos: Array<string>, path: string) {
  const existingVideoPathsArray = await prisma.video.findMany({
    select: { path: true },
  });
  const videosToRemove = new Set(
    existingVideoPathsArray.map((s) => s.path).filter((p) => p.startsWith(path))
  );
  for (const path of videos) {
    let season: null | Awaited<ReturnType<typeof prisma.season.upsert>> = null;
    let episodeNumber: number | null = null;
    if (
      process.env.NEXT_PUBLIC_SHOWS_ROOT &&
      path.startsWith(process.env.NEXT_PUBLIC_SHOWS_ROOT)
    ) {
      const dir = process.env.NEXT_PUBLIC_SHOWS_ROOT.endsWith("/")
        ? process.env.NEXT_PUBLIC_SHOWS_ROOT
        : `${process.env.NEXT_PUBLIC_SHOWS_ROOT}/`;
      const elts = path.replace(new RegExp(`^${dir}`), "").split("/");
      const name = elts[0];
      const tvShow = await prisma.tvShow.upsert({
        where: { name },
        create: { name },
        update: {},
      });
      const seasonName = elts[1];
      const seasonMatch = seasonName.match(SEASON_REGEX);
      if (seasonMatch) {
        const number = parseInt(seasonMatch[1], 10);
        season = await prisma.season.upsert({
          where: { number_tvShowId: { number, tvShowId: tvShow.id } },
          create: { number, tvShowId: tvShow.id },
          update: {},
        });
        const parsed = filenameParse(elts[elts.length - 1], true);
        // @ts-expect-error filenameParse types for tv show are wrong
        episodeNumber = parsed.episodeNumbers?.[0];

      }
    }
    const seasonId = season?.id;
    await prisma.video.upsert({
      where: { path },
      create: { path, seasonId, episodeNumber },
      update: { seasonId, episodeNumber },
    });
    videosToRemove.delete(path);
  }
  for (const path of videosToRemove) {
    await prisma.video.delete({ where: { path } });
  }
}

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get("path");
    if (!path) {
      return errorResponse({ message: "specify a path query parameter" }, 400);
    }
    if (!AUTHORISED_PATH.includes(path)) {
      return errorResponse(
        { message: `path can only be in [${AUTHORISED_PATH.join(", ")}]` },
        400
      );
    }
    const videos = await promisifiedExec(
      `find ${path} -type f -name \\*.mp4 -o -name \\*.mkv -o -name \\*.avi`
    ).then((result) => result.stdout.trim().split("\n").sort());

    await updateVideo(videos, path);

    await prisma.$disconnect();

    return NextResponse.json({ data: null });
  } catch (e) {
    return errorResponse(e, 500);
  }
}
