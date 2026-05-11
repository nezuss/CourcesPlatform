"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export type CreateGroupInput = {
  courceId: string;
  name: string;
  assignedUsersIds?: string[];
};
export type UpdateGroupInput = {
  courceId: string;
  name: string;
  assignedUsersIds?: string[];
};

function normalizeAssignedUsersIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

export async function getTeams(token: string) {
  await requireAdmin(token);
  return prisma.team.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getWaitingListEntries(token: string) {
  await requireAdmin(token);
  return prisma.waitingList.findMany({
    select: {
      userId: true,
      courceId: true,
    },
  });
}

export async function createTeam(token: string, input: CreateGroupInput) {
  await requireAdmin(token);
  if (!input.courceId || !input.name)
    throw new Error("Course id and name are required");

  const cource = await prisma.cource.findUnique({
    where: { id: input.courceId },
  });
  if (!cource) throw new Error("Course not found");

  return prisma.team.create({
    data: {
      courceId: input.courceId,
      name: input.name,
      assignedUsersIds: input.assignedUsersIds ?? [],
    },
  });
}

export async function updateTeam(
  token: string,
  id: string,
  input: UpdateGroupInput,
) {
  await requireAdmin(token);

  if (!id) throw new Error("Group id is required");
  if (Object.keys(input).length === 0) throw new Error("No fields to update");

  const data: UpdateGroupInput = { ...input };

  if (data.assignedUsersIds)
    data.assignedUsersIds = Array.from(new Set(data.assignedUsersIds));

  return prisma.team.update({
    where: { id },
    data,
  });
}

export async function deleteTeam(token: string, id: string) {
  await requireAdmin(token);
  if (!id) throw new Error("Group id is required");
  return prisma.team.delete({ where: { id } });
}

export async function addUserToTeam(token: string, id: string, userId: string) {
  await requireAdmin(token);

  if (!id) throw new Error("Group id is required");
  const normalizedUserId = userId.trim();
  if (!normalizedUserId) throw new Error("User id is required");

  const group = await prisma.team.findUnique({ where: { id } });
  if (!group) throw new Error("Group not found");

  const current = normalizeAssignedUsersIds(group.assignedUsersIds);
  if (current.includes(normalizedUserId)) {
    throw new Error("User already assigned to this team");
  }

  const waitingListEntry = await prisma.waitingList.findFirst({
    where: {
      courceId: group.courceId,
      userId: normalizedUserId,
    },
    select: { id: true },
  });
  if (!waitingListEntry) {
    throw new Error("User should be in waiting list of this course");
  }

  const sameCourseTeams = await prisma.team.findMany({
    where: { courceId: group.courceId },
    select: {
      id: true,
      assignedUsersIds: true,
    },
  });

  const assignedInSameCourse = new Set<string>();
  for (const sameCourseTeam of sameCourseTeams) {
    const assignedIds = normalizeAssignedUsersIds(
      sameCourseTeam.assignedUsersIds,
    );
    for (const assignedId of assignedIds) {
      assignedInSameCourse.add(assignedId);
    }
  }

  if (assignedInSameCourse.has(normalizedUserId)) {
    throw new Error("User already assigned to a team in this course");
  }

  const merged = [...current, normalizedUserId];

  return prisma.$transaction(async (tx) => {
    const updatedTeam = await tx.team.update({
      where: { id },
      data: { assignedUsersIds: merged },
    });

    await tx.waitingList.deleteMany({
      where: {
        userId: normalizedUserId,
        courceId: group.courceId,
      },
    });

    return updatedTeam;
  });
}

export async function removeUsersFromTeam(
  token: string,
  id: string,
  userId: string,
) {
  await requireAdmin(token);

  if (!id) throw new Error("Group id is required");
  const normalizedUserId = userId.trim();
  if (!normalizedUserId) throw new Error("User id is required");

  const group = await prisma.team.findUnique({ where: { id } });
  if (!group) throw new Error("Group not found");

  const current = normalizeAssignedUsersIds(group.assignedUsersIds);
  const nextAssignedUsersIds = current.filter(
    (assignedUserId) => assignedUserId !== normalizedUserId,
  );

  return prisma.team.update({
    where: { id },
    data: { assignedUsersIds: nextAssignedUsersIds },
  });
}
