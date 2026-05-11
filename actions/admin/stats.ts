"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function getStats(token: string) {
  await requireAdmin(token);

  const [totalUsers, totalCouses, totalTeams, waitingListUsers] =
    await Promise.all([
      prisma.user.count(),
      prisma.cource.count(),
      prisma.team.count(),
      prisma.waitingList.groupBy({ by: ["userId"] }),
    ]);

  return {
    totalUsers,
    totalCouses,
    totalTeams,
    totalUsersInWaitingList: waitingListUsers.length,
  };
}
