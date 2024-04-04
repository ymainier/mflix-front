"use server";

import prisma from "@/app/lib/prisma";

export default async function toggleViewAction(id: number, isCompleted: boolean): Promise<void> {
  try {
    await prisma.video.update({ where: { id }, data: { isCompleted } });
  } catch (e) {
    console.log(`Error while toggling view of ${id} to ${isCompleted}`);
  }
}
