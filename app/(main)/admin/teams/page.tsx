"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// ? Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { getUsers } from "@/actions/admin/user";
import { getCourses } from "@/actions/admin/course";
import {
  getTeams,
  getWaitingListEntries,
  createTeam,
  updateTeam,
  deleteTeam,
  addUserToTeam,
  removeUsersFromTeam,
} from "@/actions/admin/team";

type Team = Awaited<ReturnType<typeof getTeams>>[number];
type WaitingListEntry = Awaited<
  ReturnType<typeof getWaitingListEntries>
>[number];
type User = Awaited<ReturnType<typeof getUsers>>[number];
type Course = Awaited<ReturnType<typeof getCourses>>[number];
type TeamForm = {
  courceId: string;
  name: string;
};

const EmptyTeamForm: TeamForm = {
  courceId: "",
  name: "",
};

function normalizeAssignedUsersIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

export default function Teams() {
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [waitingListEntries, setWaitingListEntries] = useState<
    WaitingListEntry[]
  >([]);
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createForm, setCreateForm] = useState<TeamForm>(EmptyTeamForm);
  const [isCreating, setIsCreating] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<TeamForm>(EmptyTeamForm);
  const [actionTeamId, setActionTeamId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<
    "update" | "delete" | "add-user" | "remove-user" | null
  >(null);
  const [selectedUserByTeamId, setSelectedUserByTeamId] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    let isActive = true;

    const loadData = async () => {
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
        if (isActive) {
          router.push("/auth/sign-in");
          setIsLoading(false);
        }
        return;
      }

      try {
        const [teamsData, waitingListData, usersData, coursesData] =
          await Promise.all([
            getTeams(token),
            getWaitingListEntries(token),
            getUsers(token),
            getCourses(token),
          ]);

        if (!isActive) return;

        setTeams(teamsData);
        setWaitingListEntries(waitingListData);
        setUsers(usersData);
        setCourses(coursesData);
      } catch (err) {
        if (!isActive) return;
        setError(err instanceof Error ? err.message : "Failed to load teams");
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    void loadData();

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

  const getCourseName = (courseId: string) =>
    courses.find((course) => course.id === courseId)?.name ?? courseId;

  const validateTeamForm = (form: TeamForm) => {
    const courceId = form.courceId.trim();
    const name = form.name.trim();

    if (!courceId || !name)
      throw new Error("Course and team name are required");

    return { courceId, name };
  };

  const startEdit = (team: Team) => {
    setError("");
    setSuccess("");
    setEditingTeamId(team.id);
    setEditForm({
      courceId: team.courceId,
      name: team.name,
    });
  };

  const cancelEdit = () => {
    setEditingTeamId(null);
    setEditForm(EmptyTeamForm);
  };

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const token = getToken();
    if (!token) return;

    try {
      const input = validateTeamForm(createForm);

      setIsCreating(true);
      setError("");
      setSuccess("");

      const created = await createTeam(token, input);
      setTeams((currentValue) => [created, ...currentValue]);
      setCreateForm(EmptyTeamForm);
      setCreateDialogOpen(false);
      setSuccess("Team created");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create team");
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdate = async (team: Team) => {
    const token = getToken();
    if (!token) return;

    try {
      const input = validateTeamForm(editForm);

      setActionTeamId(team.id);
      setActionType("update");
      setError("");
      setSuccess("");

      const updated = await updateTeam(token, team.id, {
        ...input,
        assignedUsersIds: normalizeAssignedUsersIds(team.assignedUsersIds),
      });

      setTeams((currentValue) =>
        currentValue.map((currentTeam) =>
          currentTeam.id === team.id ? updated : currentTeam,
        ),
      );
      setSuccess("Team updated");
      cancelEdit();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update team");
    } finally {
      setActionTeamId(null);
      setActionType(null);
    }
  };

  const handleDelete = async (team: Team) => {
    const isConfirmed = window.confirm(
      `Are you shure that you want to delete this team - ${team.name}?`,
    );
    if (!isConfirmed) return;

    const token = getToken();
    if (!token) return;

    try {
      setActionTeamId(team.id);
      setActionType("delete");
      setError("");
      setSuccess("");

      await deleteTeam(token, team.id);
      setTeams((currentValue) =>
        currentValue.filter((currentTeam) => currentTeam.id !== team.id),
      );

      setSuccess("Team deleted");
      if (editingTeamId === team.id) cancelEdit();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete team");
    } finally {
      setActionTeamId(null);
      setActionType(null);
    }
  };

  const handleAddUser = async (team: Team) => {
    const userId = selectedUserByTeamId[team.id];
    if (!userId) return;

    const token = getToken();
    if (!token) return;

    try {
      setActionTeamId(team.id);
      setActionType("add-user");
      setError("");
      setSuccess("");

      const updated = await addUserToTeam(token, team.id, userId);

      setTeams((currentValue) =>
        currentValue.map((currentTeam) =>
          currentTeam.id === team.id ? updated : currentTeam,
        ),
      );
      setWaitingListEntries((currentValue) =>
        currentValue.filter(
          (entry) =>
            !(entry.userId === userId && entry.courceId === team.courceId),
        ),
      );
      setSelectedUserByTeamId((currentValue) => {
        const nextValue = { ...currentValue };
        delete nextValue[team.id];
        return nextValue;
      });
      setSuccess("User added to team");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add user");
    } finally {
      setActionTeamId(null);
      setActionType(null);
    }
  };

  const handleRemoveUser = async (team: Team, userId: string) => {
    const token = getToken();
    if (!token) return;

    try {
      setActionTeamId(team.id);
      setActionType("remove-user");
      setError("");
      setSuccess("");

      const updated = await removeUsersFromTeam(token, team.id, userId);

      setTeams((currentValue) =>
        currentValue.map((currentTeam) =>
          currentTeam.id === team.id ? updated : currentTeam,
        ),
      );
      setSuccess("User removed from team");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove user");
    } finally {
      setActionTeamId(null);
      setActionType(null);
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading teams...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-3xl font-semibold">Teams</h1>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Create Team</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a new team</DialogTitle>
            </DialogHeader>
            <form className="space-y-3" onSubmit={handleCreate}>
              <div className="flex flex-col gap-2">
                <Input
                  placeholder="Name"
                  value={createForm.name}
                  onChange={(event) =>
                    setCreateForm((currentValue) => ({
                      ...currentValue,
                      name: event.target.value,
                    }))
                  }
                />
                <Select
                  value={createForm.courceId}
                  onValueChange={(value) => {
                    setCreateForm((currentValue) => ({
                      ...currentValue,
                      courceId: value as string,
                    }));
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {courses?.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-x-4">
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? "Creating..." : "Create"}
                </Button>
                <DialogClose asChild>
                  <Button variant="outline">Close</Button>
                </DialogClose>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {error ? <p className="text-red-500">{error}</p> : null}
      {success ? <p className="text-green-600">{success}</p> : null}
      <div className="space-y-4">
        {teams.map((team) => {
          const isEditing = editingTeamId === team.id;
          const isBusy = actionTeamId === team.id;
          const assignedUsersIds = normalizeAssignedUsersIds(
            team.assignedUsersIds,
          );
          const waitingListUserIdsForTeamCourse = new Set(
            waitingListEntries
              .filter((entry) => entry.courceId === team.courceId)
              .map((entry) => entry.userId),
          );
          const assignedInSameCourseIds = new Set(
            teams
              .filter((currentTeam) => currentTeam.courceId === team.courceId)
              .flatMap((currentTeam) =>
                normalizeAssignedUsersIds(currentTeam.assignedUsersIds),
              ),
          );
          const assignedUsers = users.filter((user) =>
            assignedUsersIds.includes(user.id),
          );
          const availableUsers = users.filter(
            (user) =>
              waitingListUserIdsForTeamCourse.has(user.id) &&
              !assignedInSameCourseIds.has(user.id),
          );
          const selectedUserId = selectedUserByTeamId[team.id] ?? "";

          return (
            <div key={team.id} className="bg-secondary border p-4 space-y-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <h2 className="text-4xl">{team.name}</h2>
                  <p className="text-xl">
                    Course:{" "}
                    <span className="font-medium">
                      {getCourseName(team.courceId)}
                    </span>
                  </p>
                </div>
                <div className="space-x-2 shrink-0">
                  {isEditing ? (
                    <>
                      <Button
                        size="sm"
                        disabled={isBusy}
                        onClick={() => void handleUpdate(team)}
                      >
                        {isBusy && actionType === "update"
                          ? "Saving..."
                          : "Save"}
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
                        onClick={() => startEdit(team)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={isBusy}
                        onClick={() => void handleDelete(team)}
                      >
                        {isBusy && actionType === "delete"
                          ? "Deleting..."
                          : "Delete"}
                      </Button>
                    </>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Assigned users</h3>
                {assignedUsers.length ? (
                  <div className="flex flex-wrap gap-2">
                    {assignedUsers.map((user) => (
                      <div
                        key={user.id}
                        className="pl-2 pr-1 py-1 border rounded-sm text-sm flex items-center gap-2"
                      >
                        <span>
                          {user.username} - {user.email}
                        </span>
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={isBusy}
                          onClick={() => void handleRemoveUser(team, user.id)}
                        >
                          {isBusy && actionType === "remove-user"
                            ? "Removing..."
                            : "Remove"}
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No users assigned yet
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2">
                <Select
                  value={selectedUserId}
                  onValueChange={(value) =>
                    setSelectedUserByTeamId((currentValue) => ({
                      ...currentValue,
                      [team.id]: value,
                    }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Add user to this team" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {availableUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.username} - {user.email}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Button
                  disabled={isBusy || !selectedUserId || !availableUsers.length}
                  onClick={() => void handleAddUser(team)}
                >
                  {isBusy && actionType === "add-user"
                    ? "Adding..."
                    : "Add user"}
                </Button>
              </div>
              {isEditing ? (
                <div className="space-y-2">
                  <h3 className="font-medium">Team setting</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <Input
                      placeholder="Team name"
                      value={editForm.name}
                      onChange={(event) =>
                        setEditForm((currentValue) => ({
                          ...currentValue,
                          name: event.target.value,
                        }))
                      }
                    />
                    <Select
                      value={editForm.courceId}
                      onValueChange={(value) =>
                        setEditForm((currentValue) => ({
                          ...currentValue,
                          courceId: value,
                        }))
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select course" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {courses.map((course) => (
                            <SelectItem key={course.id} value={course.id}>
                              {course.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
