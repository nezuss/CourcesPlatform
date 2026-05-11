"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    router.replace("/");
  }, [router]);

  return <div className="p-6">Logging out...</div>;
}
