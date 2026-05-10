"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ? Components
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";

// ? Actions
import { signUp } from "@/actions/auth";

export default function SignUp() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!email || !username || !password) {
      setError("Email, username and password are required.");
      return;
    }

    if (password !== passwordConfirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await signUp({
        email,
        username,
        password,
      });

      localStorage.setItem("authToken", result.token);
      localStorage.setItem("authUser", JSON.stringify(result.user));

      router.push(`/profile/${result.user.id}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sign up failed";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="w-64 space-y-4" onSubmit={handleSubmit}>
      <div>
        <h2 className="text-2xl font-bold">Sign Up</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
      <div className="space-y-2">
        <Field title="Email" value={email} setValue={setEmail} type="email" />
        <Field title="Username" value={username} setValue={setUsername} />
        <Field
          title="Password"
          value={password}
          setValue={setPassword}
          type="password"
        />
        <Field
          title="Password Confirm"
          value={passwordConfirm}
          setValue={setPasswordConfirm}
          type="password"
        />
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          Already have an account?{" "}
          <Link href="/auth/sign-in" className="text-blue-500">
            Sign in here
          </Link>
        </div>
        <Button className="w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Sign Up"}
        </Button>
      </div>
    </form>
  );
}
