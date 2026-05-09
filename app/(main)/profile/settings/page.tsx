"use client";

import { useState } from "react";

// ? Components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Setting() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [nPassword, setNPassword] = useState("");
  const [nPasswordConfirm, setNPasswordConfirm] = useState("");

  return (
    <div className="p-6 space-y-6">
      <h1 className="font-semibold text-3xl">Account</h1>
      <div className="bg-secondary border p-4 space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl">User public</h3>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl">New Password</h3>
          <Input
            value={nPassword}
            onChange={(e) => setNPassword(e.target.value)}
            placeholder="New password"
          />
          <Input
            value={nPasswordConfirm}
            onChange={(e) => setNPasswordConfirm(e.target.value)}
            placeholder="New password confirm"
          />
        </div>
        <Button className="w-full max-w-64">Save</Button>
      </div>
    </div>
  );
}
