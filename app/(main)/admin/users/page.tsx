"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// ? Components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ? Actions
import { getSession } from "@/actions/auth";
import { getUsers, updateUser, deleteUser } from "@/actions/admin/user";

type User = Awaited<ReturnType<typeof getUsers>>[number];
type UserEditForm = {
  username: string;
  email: string;
  imageUrl: string;
  role: "user" | "admin";
  password: string;
};

const EmptyUserForm: UserEditForm = {
  username: "",
  email: "",
  imageUrl: "",
  role: "user",
  password: "",
};

export default function Users() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<UserEditForm>(EmptyUserForm);
  const [actionUserId, setActionUserId] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const loadUsers = async () => {
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
        if (isActive) router.push("/auth/sign-in");
      }

      try {
        const usersData = await getUsers(token);

        if (!isActive) return;

        setUsers(usersData);
      } catch (err) {
        if (!isActive) return;
        setError(err instanceof Error ? err.message : "Failed to load users");
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    void loadUsers();

    return () => {
      isActive = false;
    };
  }, [router]);

  const getToken = () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      router.push("/auth/sign-in");
      return null;
    }

    return token;
  };

  const startEdit = (user: User) => {
    setError("");
    setSuccess("");
    setEditingUserId(user.id);
    setEditForm({
      username: user.username,
      email: user.email,
      imageUrl: user.imageUrl,
      role: user.role === "admin" ? "admin" : "user",
      password: "",
    });
  };

  const cancelEdit = () => {
    setEditingUserId(null);
    setEditForm(EmptyUserForm);
  };

  const handleSave = async (userId: string) => {
    const token = getToken();
    if (!token) return;

    const username = editForm.username.trim();
    const email = editForm.email.trim().toLowerCase();

    if (!username || !email) {
      setError("Username and email are required");
      return;
    }

    setActionUserId(userId);
    setError("");
    setSuccess("");

    try {
      const updated = await updateUser(token, userId, {
        username,
        email,
        imageUrl: editForm.imageUrl.trim(),
        role: editForm.role,
        password: editForm.password.trim() || undefined,
      });

      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === userId ? updated : user)),
      );
      setSuccess("User updated");
      cancelEdit();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `Failed to update user - ${username}`,
      );
    } finally {
      setActionUserId(null);
    }
  };

  const handleDelete = async (user: User) => {
    const isConfirmed = window.confirm(
      `Are you shure that you want to delete this user - ${user.username}?`,
    );
    if (!isConfirmed) return;

    const token = getToken();
    if (!token) return;

    setActionUserId(user.id);
    setError("");
    setSuccess("");

    try {
      await deleteUser(token, user.id);
      setUsers((prevUsers) =>
        prevUsers.filter((currentUser) => currentUser.id !== user.id),
      );
      setSuccess("User deleted successfuly");

      if (editingUserId === user.id) {
        cancelEdit();
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `Failed to delete user - ${user.username}`,
      );
    } finally {
      setActionUserId(null);
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading users</div>;
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-semibold">Users</h1>
      {error ? <p className="text-red-500">{error}</p> : null}
      {success ? <p className="text-green-500">{success}</p> : null}
      <div className="flex flex-col gap-4">
        {users.map((user) => {
          const isEditing = editingUserId === user.id;
          const isBusy = actionUserId === user.id;

          return (
            <div key={user.id} className="bg-secondary border p-4 space-y-3">
              <div className="flex flex-row items-center justify-between gap-4">
                <div className="flex flex-row items-center gap-2 min-w-0">
                  <Avatar>
                    <AvatarFallback>
                      {(user.username.at(0) ?? "?").toUpperCase()}
                    </AvatarFallback>
                    {user.imageUrl ? <AvatarImage src={user.imageUrl} /> : null}
                  </Avatar>
                  <div className="min-w-0">
                    <h2 className="flex items-center text-lg font-medium break-all">
                      {user.username} - {user.email}
                      {user.role === "admin" ? (
                        <span className="bg-red-500 text-background rounded-full px-2 py-0.5 ml-2 text-sm">
                          admin
                        </span>
                      ) : null}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="space-x-2 shrink-0">
                  {isEditing ? (
                    <>
                      <Button
                        size="sm"
                        disabled={isBusy}
                        onClick={() => void handleSave(user.id)}
                      >
                        {isBusy ? "Saving..." : "Save"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isBusy}
                        onClick={cancelEdit}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isBusy}
                        onClick={() => startEdit(user)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={isBusy}
                        onClick={() => void handleDelete(user)}
                      >
                        {isBusy ? "Deleting..." : "Delete"}
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Input
                    value={editForm.username}
                    placeholder="Username"
                    onChange={(event) =>
                      setEditForm((currentValue) => ({
                        ...currentValue,
                        username: event.target.value,
                      }))
                    }
                  />
                  <Input
                    value={editForm.email}
                    type="email"
                    placeholder="Email"
                    onChange={(event) =>
                      setEditForm((currentValue) => ({
                        ...currentValue,
                        email: event.target.value,
                      }))
                    }
                  />
                  <Input
                    value={editForm.imageUrl}
                    placeholder="Avatar URL"
                    onChange={(event) =>
                      setEditForm((currentValue) => ({
                        ...currentValue,
                        imageUrl: event.target.value,
                      }))
                    }
                  />
                  <Select
                    value={editForm.role}
                    onValueChange={(value) => {
                      setEditForm((currentValue) => ({
                        ...currentValue,
                        role: value as "user" | "admin",
                      }));
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Input
                    value={editForm.password}
                    type="password"
                    className="md:col-span-2"
                    placeholder="New password"
                    onChange={(event) =>
                      setEditForm((currentValue) => ({
                        ...currentValue,
                        password: event.target.value,
                      }))
                    }
                  />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
