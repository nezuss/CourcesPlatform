"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireUser, sanitizeUser } from "@/lib/auth";

export type UpdateProfileInput = {
  email?: string;
  username?: string;
  password?: string;
  imageUrl?: string;
};

export async function getProfile(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return sanitizeUser(user);
}

export async function updateProfile(token: string, input: UpdateProfileInput) {
  const user = await requireUser(token);
  const data: UpdateProfileInput = {};

  if (input.email) data.email = input.email.trim().toLowerCase();
  if (input.username) data.username = input.username.trim();
  if (input.password) data.password = await bcrypt.hash(input.password, 10);
  if (input.imageUrl !== undefined) data.imageUrl = input.imageUrl.trim();
  if (Object.keys(data).length === 0) return sanitizeUser(user);

  const updated = await prisma.user.update({
    where: { id: user.id },
    data,
  });

  return sanitizeUser(updated);
}

export async function getWaitingList(userId: string) {
  return prisma.waitingList.findMany({
    where: { userId },
    select: {
      id: true,
      courceId: true,
      cource: {
        select: {
          id: true,
          imageUrl: true,
          name: true,
          description: true,
          price: true,
        },
      },
    },
  });
}

export async function getTeams(userId: string) {
  try {
    const teamEntries = await prisma.team.findMany({
      select: {
        id: true,
        courceId: true,
        name: true,
        assignedUsersIds: true,
        cource: {
          select: {
            id: true,
            imageUrl: true,
            name: true,
            description: true,
            price: true,
          },
        },
      },
    });

    const teams = teamEntries.filter((entry) => {
      if (!Array.isArray(entry.assignedUsersIds)) return false;

      return entry.assignedUsersIds.some(
        (assignedUserId) =>
          typeof assignedUserId === "string" && assignedUserId === userId,
      );
    });

    return teams;
  } catch {
    return [];
  }
}
