"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// ? Components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// ? Actions
import { getSession } from "@/actions/auth";
import { updateProfile } from "@/actions/profile";

export default function Setting() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [nPassword, setNPassword] = useState("");
  const [nPasswordConfirm, setNPasswordConfirm] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isActive = true;

    const loadProfile = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        if (isActive) router.push("/auth/sign-in");
        return;
      }

      try {
        const sessionUser = await getSession(token);

        if (!isActive) return;

        setUsername(sessionUser.username ?? "");
        setEmail(sessionUser.email ?? "");
        setImageUrl(sessionUser.imageUrl ?? "");
        setIsLoading(false);
      } catch {
        if (isActive) router.push("/auth/sign-in");
      }
    };

    void loadProfile();

    return () => {
      isActive = false;
    };
  }, [router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (nPassword && nPassword !== nPasswordConfirm) {
      setError("Passwords do not match");
      return;
    }

    const token = localStorage.getItem("authToken");

    if (!token) {
      router.push("/auth/sign-in");
      return;
    }

    try {
      setIsSubmitting(true);
      const updated = await updateProfile(token, {
        username: username || undefined,
        email: email || undefined,
        password: nPassword || undefined,
        imageUrl: imageUrl || "",
      });

      localStorage.setItem("authUser", JSON.stringify(updated));
      window.dispatchEvent(
        new CustomEvent("auth:updated", { detail: updated }),
      );

      setSuccess("Profile updated successfully");
      setNPassword("");
      setNPasswordConfirm("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading settings</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="font-semibold text-3xl">Account</h1>
      {error ? <p className="text-red-500">{error}</p> : null}
      {success ? <p className="text-green-500">{success}</p> : null}
      <form
        className="bg-secondary border p-4 space-y-4"
        onSubmit={handleSubmit}
      >
        <div className="space-y-2">
          <h3 className="text-xl">User public</h3>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          <Input
            value={email}
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <Input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Avatar URL"
          />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl">New Password</h3>
          <Input
            value={nPassword}
            onChange={(e) => setNPassword(e.target.value)}
            placeholder="New password"
            type="password"
          />
          <Input
            value={nPasswordConfirm}
            onChange={(e) => setNPasswordConfirm(e.target.value)}
            placeholder="New password confirm"
            type="password"
          />
        </div>
        <Button
          className="w-full max-w-64"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </form>
    </div>
  );
}
