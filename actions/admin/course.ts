"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export type CreateCourseInput = {
  imageUrl: string;
  name: string;
  description: string;
  studyTime: string;
  price: number;
};
export type UpdateCourseInput = {
  imageUrl: string;
  name: string;
  description: string;
  studyTime: string;
  price: number;
};

export async function getCourses(token: string) {
  await requireAdmin(token);
  return prisma.cource.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createCourse(token: string, input: CreateCourseInput) {
  await requireAdmin(token);

  if (!input.name || !input.description || !input.studyTime || !input.imageUrl)
    throw new Error("Missing required course fields");
  if (!Number.isFinite(input.price))
    throw new Error("Price must be a valid number");

  return prisma.cource.create({ data: input });
}

export async function updateCourse(
  token: string,
  id: string,
  input: UpdateCourseInput,
) {
  await requireAdmin(token);
  if (!id) throw new Error("Course id is required");
  if (Object.keys(input).length === 0) throw new Error("No fields to update");

  return prisma.cource.update({
    where: { id },
    data: input,
  });
}

export async function deleteCourse(token: string, id: string) {
  await requireAdmin(token);
  if (!id) throw new Error("Course id is required");

  return prisma.cource.delete({ where: { id } });
}
