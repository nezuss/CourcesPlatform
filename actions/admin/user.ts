"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireAdmin, sanitizeUser } from "@/lib/auth";

export type UpdateUserInput = {
  email?: string;
  username?: string;
  imageUrl?: string;
  password?: string;
  role?: "user" | "admin";
};

export async function getUsers(token: string) {
  await requireAdmin(token);
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });

  return users.map(sanitizeUser);
}

export async function updateUser(
  token: string,
  id: string,
  input: UpdateUserInput,
) {
  await requireAdmin(token);

  if (!id) throw new Error("User id is required");
  if (Object.keys(input).length === 0) throw new Error("No fields to update");

  const data: UpdateUserInput & { password?: string } = {};

  if (input.email) data.email = input.email.trim().toLowerCase();
  if (input.username) data.username = input.username.trim();
  if (input.imageUrl !== undefined) data.imageUrl = input.imageUrl;
  if (input.password) data.password = await bcrypt.hash(input.password, 10);
  if (input.role) data.role = input.role;

  const user = await prisma.user.update({
    where: { id },
    data,
  });

  return sanitizeUser(user);
}

export async function deleteUser(token: string, id: string) {
  await requireAdmin(token);

  if (!id) throw new Error("User id is required");

  const user = await prisma.user.delete({ where: { id } });
  return sanitizeUser(user);
}
