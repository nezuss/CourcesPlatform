"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// ? Components
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ? Actions
import { getSession } from "@/actions/auth";

type User = {
  id: string;
  email?: string;
  username?: string;
  imageUrl?: string;
  role?: "user" | "admin";
};

export function Navbar(): React.ReactElement {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const list = [
    {
      name: "Home",
      link: "/",
    },
    {
      name: "Cources",
      link: "/cources",
    },
  ];

  useEffect(() => {
    let isActive = true;

    const checkAuth = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        if (isActive) {
          setIsAuthorized(false);
          setUser(null);
        }

        return;
      }

      try {
        const sessionUser = await getSession(token);
        if (!isActive) return;

        setUser(sessionUser as User);
        setIsAuthorized(true);
        localStorage.setItem("authUser", JSON.stringify(sessionUser));
      } catch {
        if (!isActive) return;

        setIsAuthorized(false);
        setUser(null);
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUser");
      }
    };

    void checkAuth();

    return () => {
      isActive = false;
    };
  }, []);

  const profileLink = user ? `/profile/${user.id}` : "";
  const isAdmin = user?.role === "admin";

  return (
    <nav className="fixed w-full top-0 z-9">
      <div className="bg-secondary flex flex-row justify-between border-b p-4">
        <div className="flex flex-row items-center gap-x-4">
          {list.map((item, index) => (
            <Link key={index + "-nb-menu"} href={item.link}>
              <Button variant="outline">{item.name}</Button>
            </Link>
          ))}
        </div>
        <div>
          {!isAuthorized ? (
            <div className="flex flex-row items-center gap-x-4">
              <Link href="/auth/sign-up">
                <Button variant="outline">Sign Up</Button>
              </Link>
              <Link href="/auth/sign-in">
                <Button>Sign In</Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-row items-center gap-x-4">
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    <AvatarFallback>
                      {user?.username?.at(0)?.toUpperCase()}
                    </AvatarFallback>
                    {user?.imageUrl ? (
                      <AvatarImage src={user.imageUrl} />
                    ) : null}
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="mr-8">
                  {isAdmin ? (
                    <>
                      <DropdownMenuGroup>
                        <DropdownMenuLabel>Administrative</DropdownMenuLabel>
                        <Link href="/admin">
                          <DropdownMenuItem>Dashboard</DropdownMenuItem>
                        </Link>
                        <Link href="/admin/cources">
                          <DropdownMenuItem>Cources</DropdownMenuItem>
                        </Link>
                        <Link href="/admin/teams">
                          <DropdownMenuItem>Teams</DropdownMenuItem>
                        </Link>
                        <Link href="/admin/users">
                          <DropdownMenuItem>Users</DropdownMenuItem>
                        </Link>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                    </>
                  ) : null}
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Account</DropdownMenuLabel>
                    <Link href={profileLink}>
                      <DropdownMenuItem>Profile</DropdownMenuItem>
                    </Link>
                    <Link href="/profile/settings">
                      <DropdownMenuItem>Setting</DropdownMenuItem>
                    </Link>
                    <Link href="/auth/logout">
                      <DropdownMenuItem variant="destructive">
                        Logout
                      </DropdownMenuItem>
                    </Link>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
