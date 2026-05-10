"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export async function listCourses() {
  return prisma.cource.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getCourse(id: string) {
  return prisma.cource.findUnique({
    where: { id: id },
  });
}

export async function getEnrolledCourses(token: string) {
  const { id: userId } = await requireUser(token);

  const waitingListEntries = await prisma.waitingList.findMany({
    where: { userId },
    select: { courceId: true },
  });

  const waitingListCourseIds = waitingListEntries.map(
    (entry) => entry.courceId,
  );

  return Array.from(waitingListCourseIds);
}

export async function enrollToCourse(token: string, courceId: string) {
  const user = await requireUser(token);
  const cource = await prisma.cource.findUnique({ where: { id: courceId } });

  if (!cource) throw new Error("Course not found");

  return prisma.waitingList.create({
    data: {
      userId: user.id,
      courceId,
    },
  });
}

export async function cancelEnrollToCourse(token: string, courseId: string) {
  const { id: userId } = await requireUser(token);

  if (!courseId) throw new Error("Course id is required");

  const result = await prisma.waitingList.deleteMany({
    where: {
      userId,
      courceId: courseId,
    },
  });

  if (result.count === 0)
    throw new Error("You are not enrolled to this course");

  return { success: true };
}
