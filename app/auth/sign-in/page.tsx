"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ? Components
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";

// ? Actions
import { signIn } from "@/actions/auth";

export default function SignIn() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await signIn({ email, password });

      localStorage.setItem("authToken", result.token);
      localStorage.setItem("authUser", JSON.stringify(result.user));

      router.push(`/profile/${result.user.id}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sign in failed";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="w-64 space-y-4" onSubmit={handleSubmit}>
      <div>
        <h2 className="text-2xl font-bold">Sign In</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
      <div className="space-y-2">
        <Field title="Email" value={email} setValue={setEmail} type="email" />
        <Field
          title="Password"
          value={password}
          setValue={setPassword}
          type="password"
        />
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          Don't have an account?{" "}
          <Link href="/auth/sign-up" className="text-blue-500">
            Sign up here
          </Link>
        </div>
        <Button className="w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign In"}
        </Button>
      </div>
    </form>
  );
}
