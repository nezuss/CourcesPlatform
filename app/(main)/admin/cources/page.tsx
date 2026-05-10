"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

// ? Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// ? Actions
import { getSession } from "@/actions/auth";
import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from "@/actions/admin/course";

type Course = Awaited<ReturnType<typeof getCourses>>[number];
type CourseForm = {
  imageUrl: string;
  name: string;
  description: string;
  studyTime: string;
  price: string;
};

const EmptyCourseForm: CourseForm = {
  imageUrl: "",
  name: "",
  description: "",
  studyTime: "",
  price: "",
};

export default function Courses() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [createForm, setCreateForm] = useState<CourseForm>(EmptyCourseForm);
  const [isCreating, setIsCreating] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<CourseForm>(EmptyCourseForm);
  const [actionCourseId, setActionCourseId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<"update" | "delete" | null>(
    null,
  );

  useEffect(() => {
    let isActive = true;

    const loadCourses = async () => {
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
        const coursesData = await getCourses(token);
        if (!isActive) return;

        setCourses(coursesData);
      } catch (err) {
        if (!isActive) return;
        setError(err instanceof Error ? err.message : "Failed to load courses");
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    void loadCourses();

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

  const parseCourseForm = (form: CourseForm) => {
    const imageUrl = form.imageUrl.trim();
    const name = form.name.trim();
    const description = form.description.trim();
    const studyTime = form.studyTime.trim();
    const price = Number(form.price);

    if (!imageUrl || !name || !description || !studyTime)
      throw new Error("All fields are required");
    if (!Number.isFinite(price))
      throw new Error("Price must be a valid number");

    return {
      imageUrl,
      name,
      description,
      studyTime,
      price,
    };
  };

  const startEdit = (course: Course) => {
    setError("");
    setSuccess("");
    setEditingCourseId(course.id);
    setEditForm({
      imageUrl: course.imageUrl,
      name: course.name,
      description: course.description,
      studyTime: course.studyTime,
      price: String(course.price),
    });
  };

  const cancelEdit = () => {
    setEditingCourseId(null);
    setEditForm(EmptyCourseForm);
  };

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const token = getToken();
    if (!token) return;

    try {
      const input = parseCourseForm(createForm);

      setIsCreating(true);
      setError("");
      setSuccess("");

      const created = await createCourse(token, input);

      setCourses((prevCourses) => [created, ...prevCourses]);
      setCreateForm(EmptyCourseForm);
      setSuccess("Course created");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `Failed to create course - ${createCourse.name}`,
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdate = async (courseId: string) => {
    const token = getToken();
    if (!token) return;

    try {
      const input = parseCourseForm(editForm);

      setActionCourseId(courseId);
      setActionType("update");
      setError("");
      setSuccess("");

      const updated = await updateCourse(token, courseId, input);

      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.id === courseId ? updated : course,
        ),
      );
      setSuccess("Course updated");
      cancelEdit();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update course");
    } finally {
      setActionCourseId(null);
      setActionType(null);
    }
  };

  const handleDelete = async (course: Course) => {
    const isConfirmed = window.confirm(
      `Are you shure that you want to delete this course - ${course.name}?`,
    );
    if (!isConfirmed) return;

    const token = getToken();
    if (!token) return;

    try {
      setActionCourseId(course.id);
      setActionType("delete");
      setError("");
      setSuccess("");

      await deleteCourse(token, course.id);
      setCourses((prevCourses) =>
        prevCourses.filter((currentCourse) => currentCourse.id !== course.id),
      );
      setSuccess("Course deleted");
      if (editingCourseId === course.id) cancelEdit();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `Failed to delete course - ${course.name}`,
      );
    } finally {
      setActionCourseId(null);
      setActionType(null);
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading courses...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-3xl font-semibold">Courses</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Create Cource</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a new course</DialogTitle>
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
                <Input
                  placeholder="Image URL"
                  value={createForm.imageUrl}
                  onChange={(event) =>
                    setCreateForm((currentValue) => ({
                      ...currentValue,
                      imageUrl: event.target.value,
                    }))
                  }
                />
                <Input
                  placeholder="Study time"
                  value={createForm.studyTime}
                  onChange={(event) =>
                    setCreateForm((currentValue) => ({
                      ...currentValue,
                      studyTime: event.target.value,
                    }))
                  }
                />
                <Input
                  placeholder="Price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={createForm.price}
                  onChange={(event) =>
                    setCreateForm((currentValue) => ({
                      ...currentValue,
                      price: event.target.value,
                    }))
                  }
                />
                <Textarea
                  className="min-h-24 max-h-64 w-full"
                  placeholder="Description"
                  value={createForm.description}
                  onChange={(event) =>
                    setCreateForm((currentValue) => ({
                      ...currentValue,
                      description: event.target.value,
                    }))
                  }
                />
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
        {courses.map((course) => {
          const isEditing = editingCourseId === course.id;
          const isBusy = actionCourseId === course.id;

          return (
            <div key={course.id} className="bg-secondary border p-4 space-y-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex gap-3 min-w-0">
                  <Avatar className="size-46">
                    <AvatarFallback className="text-5xl">
                      {course.name.at(0)?.toUpperCase()}
                    </AvatarFallback>
                    {course.imageUrl ? (
                      <AvatarImage
                        className="rounded-sm!"
                        src={course.imageUrl}
                      />
                    ) : null}
                  </Avatar>
                  <div className="space-y-2">
                    <div>
                      <h2 className="text-4xl">{course.name}</h2>
                      <p className="text-xl">{course.description}</p>
                    </div>
                    <div className="border-l-4 pl-4">
                      <p>Study time: {course.studyTime}</p>
                      <p>Price: {course.price} Euro</p>
                      <p className="text-muted-foreground">
                        Cteated at:{" "}
                        {new Date(course.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-x-2 shrink-0">
                  {isEditing ? (
                    <>
                      <Button
                        size="sm"
                        disabled={isBusy}
                        onClick={() => void handleUpdate(course.id)}
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
                        onClick={() => startEdit(course)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={isBusy}
                        onClick={() => void handleDelete(course)}
                      >
                        {isBusy && actionType === "delete"
                          ? "Deleting..."
                          : "Delete"}
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Input
                    placeholder="Name"
                    value={editForm.name}
                    onChange={(event) =>
                      setEditForm((currentValue) => ({
                        ...currentValue,
                        name: event.target.value,
                      }))
                    }
                  />
                  <Input
                    placeholder="Image URL"
                    value={editForm.imageUrl}
                    onChange={(event) =>
                      setEditForm((currentValue) => ({
                        ...currentValue,
                        imageUrl: event.target.value,
                      }))
                    }
                  />
                  <Input
                    placeholder="Study time"
                    value={editForm.studyTime}
                    onChange={(event) =>
                      setEditForm((currentValue) => ({
                        ...currentValue,
                        studyTime: event.target.value,
                      }))
                    }
                  />
                  <Input
                    placeholder="Price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={editForm.price}
                    onChange={(event) =>
                      setEditForm((currentValue) => ({
                        ...currentValue,
                        price: event.target.value,
                      }))
                    }
                  />
                  <Textarea
                    className="min-h-24 max-h-64 w-full md:col-span-2"
                    placeholder="Description"
                    value={editForm.description}
                    onChange={(event) =>
                      setEditForm((currentValue) => ({
                        ...currentValue,
                        description: event.target.value,
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
