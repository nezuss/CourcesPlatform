"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// ? Actions
import { getSession } from "@/actions/auth";
import { getStats } from "@/actions/admin/stats";

type StatsProps = {
  totalUsers: number;
  totalCouses: number;
  totalTeams: number;
  totalUsersInWaitingList: number;
};

export default function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<StatsProps>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    const loadStats = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        if (isActive) {
          router.push("/auth/sign-in");
          setIsLoading(false);
        }
        return;
      }

      try {
        await getSession(token);
      } catch {
        if (isActive) {
          router.push("/auth/sign-in");
          setIsLoading(false);
        }
        return;
      }

      try {
        const statsData = await getStats(token);
        if (!isActive) return;

        setStats(statsData);
      } catch (err) {
        if (!isActive) return;
        setError(err instanceof Error ? err.message : "Failed to load stats");
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    void loadStats();

    return () => {
      isActive = false;
    };
  }, [router]);

  if (isLoading) {
    return <div className="p-6">Loading stats</div>;
  }

  return (
    <div className="p-6 space-y-4">
      {error ? <p className="text-red-500">{error}</p> : null}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { name: "Total Users", number: stats?.totalUsers || 0 },
          { name: "Total Teams", number: stats?.totalTeams || 0 },
          { name: "Total Courses", number: stats?.totalCouses || 0 },
          {
            name: "Total Users in WL",
            number: stats?.totalUsersInWaitingList || 0,
          },
        ].map((stat, index) => (
          <div key={"st-" + index} className="bg-secondary border p-4">
            <h3 className="text-xl">{stat.name}</h3>
            <h1 className="text-4xl">{stat.number}</h1>
          </div>
        ))}
      </div>
    </div>
  );
}
