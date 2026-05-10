import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import type { User } from "@prisma/client";

type TokenPayload = {
  sub: string;
  email: string;
  role: string;
};

const JWT_SECRET = process.env.JWT_SECRET;

function getJwtSecret(): string {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not set");
  }

  return JWT_SECRET;
}

function normalizeToken(token: string): string {
  if (token.startsWith("Bearer ")) {
    return token.slice(7);
  }

  return token;
}

export function createToken(user: Pick<User, "id" | "email" | "role">): string {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
    },
    getJwtSecret(),
    { expiresIn: "7d" },
  );
}

export function verifyToken(token: string): TokenPayload {
  const payload = jwt.verify(normalizeToken(token), getJwtSecret());

  if (typeof payload === "string" || !payload.sub) {
    throw new Error("Invalid token");
  }

  return {
    sub: String(payload.sub),
    email: String(payload.email ?? ""),
    role: String(payload.role ?? "user"),
  };
}

export async function requireUser(token: string): Promise<User> {
  const payload = verifyToken(token);
  const user = await prisma.user.findUnique({ where: { id: payload.sub } });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

export async function requireAdmin(token: string): Promise<User> {
  const user = await requireUser(token);

  if (user.role !== "admin") {
    throw new Error("Forbidden, you should have admin role to access it");
  }

  return user;
}

export function sanitizeUser(user: User) {
  const { password, ...safeUser } = user;
  return safeUser;
}
