"use server";

import prisma from "@/app/lib/prisma";

export async function toggleEpisodeViewAction(
  id: number,
  isCompleted: boolean
): Promise<void> {
  try {
    await prisma.video.update({ where: { id }, data: { isCompleted } });
    const video = await prisma.video.findUnique({
      where: { id },
      select: { seasonId: true },
    });
    if (video?.seasonId == null) return;
    const seasonId = video.seasonId;

    const videos = await prisma.video.findMany({
      where: { seasonId },
      select: { isCompleted: true },
    });
    await prisma.season.update({
      where: { id: seasonId },
      data: { isCompleted: videos.every((v) => v.isCompleted) },
    });

    const season = await prisma.season.findUnique({
      where: { id: seasonId },
      select: { tvShowId: true },
    });
    if (season?.tvShowId == null) return;
    const tvShowId = season.tvShowId;

    const seasons = await prisma.season.findMany({
      where: { tvShowId },
      select: { isCompleted: true },
    });
    await prisma.tvShow.update({
      where: { id: tvShowId },
      data: { isCompleted: seasons.every((v) => v.isCompleted) },
    });
  } catch (e) {
    console.log(`Error while toggling view of ${id} to ${isCompleted}`);
  }
}

export async function toggleShowViewAction(
  id: number,
  isCompleted: boolean
): Promise<void> {
  try {
    await prisma.tvShow.update({ where: { id }, data: { isCompleted } });
    await prisma.season.updateMany({
      where: { tvShowId: id },
      data: { isCompleted },
    });
    const seasons = await prisma.season.findMany({
      where: { tvShowId: id },
      select: { id: true },
    });
    await prisma.video.updateMany({
      where: { seasonId: { in: seasons.map((s) => s.id) } },
      data: { isCompleted },
    });
  } catch (e) {
    console.log(`Error while toggling view of ${id} to ${isCompleted}`);
  }
}

export async function toggleSeasonViewAction(
  id: number,
  isCompleted: boolean
): Promise<void> {
  try {
    await prisma.season.updateMany({
      where: { id },
      data: { isCompleted },
    });
    await prisma.video.updateMany({
      where: { seasonId: id },
      data: { isCompleted },
    });

    const season = await prisma.season.findUnique({
      where: { id },
      select: { tvShowId: true },
    });
    if (season?.tvShowId == null) return;
    const tvShowId = season.tvShowId;

    const seasons = await prisma.season.findMany({
      where: { tvShowId },
      select: { isCompleted: true },
    });
    await prisma.tvShow.update({
      where: { id: tvShowId },
      data: { isCompleted: seasons.every((v) => v.isCompleted) },
    });
  } catch (e) {
    console.log(`Error while toggling view of ${id} to ${isCompleted}`);
  }
}
