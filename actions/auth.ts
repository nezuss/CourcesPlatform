"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createToken, requireUser, sanitizeUser } from "@/lib/auth";

export type RegisterInput = {
  email: string;
  username: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export async function signUp(input: RegisterInput) {
  const email = input.email.trim().toLowerCase();
  const username = input.username.trim();

  if (!email || !username || !input.password) {
    throw new Error("Email, username, and password are required");
  }

  const existing = await prisma.user.findFirst({ where: { email } });

  if (existing) {
    throw new Error("This email already registered");
  }

  const hashedPassword = await bcrypt.hash(input.password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      username,
      imageUrl: "",
      password: hashedPassword,
    },
  });

  const token = createToken(user);

  return {
    token,
    user: sanitizeUser(user),
  };
}

export async function getSession(token: string) {
  const user = await requireUser(token);
  return sanitizeUser(user);
}

export async function signIn(input: LoginInput) {
  const email = input.email.trim().toLowerCase();

  if (!email || !input.password) {
    throw new Error("Email and password are required");
  }

  const user = await prisma.user.findFirst({ where: { email } });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isValid = await bcrypt.compare(input.password, user.password);

  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  const token = createToken(user);

  return {
    token,
    user: sanitizeUser(user),
  };
}
