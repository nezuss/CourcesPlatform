"use client";

import { useState } from "react";
import Link from "next/link";

// ? Components
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  return (
    <div className="w-64 space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Sign In</h2>
        {error && <p className="text-red-500">{error}</p>}
      </div>
      <div className="space-y-2">
        <Field title="Email" value={email} setValue={setEmail} />
        <Field title="Password" value={password} setValue={setPassword} />
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          Don't have an account?{" "}
          <Link href="/auth/sign-up" className="text-blue-500">
            Sign up here
          </Link>
        </div>
        <Button className="w-full">Sign Up</Button>
      </div>
    </div>
  );
}
