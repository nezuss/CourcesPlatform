"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// ? Components
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// ? Actions
import { getSession } from "@/actions/auth";
import {
  cancelEnrollToCourse,
  listCourses,
  enrollToCourse,
  getEnrolledCourses,
} from "@/actions/user/course";

type Course = Awaited<ReturnType<typeof listCourses>>[number];

export default function Cources() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pendingCourseId, setPendingCourseId] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<
    "enroll" | "cancel" | null
  >(null);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);

  useEffect(() => {
    let isActive = true;

    const loadCourses = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const [coursesData, enrolledIds] = await Promise.all([
          listCourses(),
          token
            ? getEnrolledCourses(token).catch(() => [])
            : Promise.resolve<string[]>([]),
        ]);

        if (!isActive) return;

        setCourses(coursesData);
        setEnrolledCourseIds(enrolledIds);
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
  }, []);

  const handleEnroll = async (courseId: string) => {
    if (enrolledCourseIds.includes(courseId)) return;

    const token = localStorage.getItem("authToken");

    if (!token) {
      setError("You should be logged in");
      return;
    }

    try {
      await getSession(token);
    } catch {
      setError("You should be logged in");
      return;
    }

    setPendingCourseId(courseId);
    setPendingAction("enroll");
    setError("");
    setSuccess("");

    try {
      await enrollToCourse(token, courseId);
      setEnrolledCourseIds((currentValue) =>
        currentValue.includes(courseId)
          ? currentValue
          : [...currentValue, courseId],
      );
      setSuccess("You have been enrolled to course");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to enroll");
    } finally {
      setPendingCourseId(null);
      setPendingAction(null);
    }
  };

  const handleCancelEnroll = async (courseId: string) => {
    if (!enrolledCourseIds.includes(courseId)) return;

    const token = localStorage.getItem("authToken");

    if (!token) {
      setError("You should be logged in");
      return;
    }

    try {
      await getSession(token);
    } catch {
      setError("You should be logged in");
      return;
    }

    setPendingCourseId(courseId);
    setPendingAction("cancel");
    setError("");
    setSuccess("");

    try {
      await cancelEnrollToCourse(token, courseId);
      setEnrolledCourseIds((currentValue) =>
        currentValue.filter((currentCourseId) => currentCourseId !== courseId),
      );
      setSuccess("Enrollment cancelled");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to cancel enrollment",
      );
    } finally {
      setPendingCourseId(null);
      setPendingAction(null);
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading courses</div>;
  }

  return (
    <div className="p-6 space-y-4">
      {error ? <p className="text-red-500">{error}</p> : null}
      {success ? <p className="text-green-600">{success}</p> : null}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {courses.map((cource) => (
          <div
            key={"crs-l-" + cource.id}
            className="max-h-72 bg-secondary flex flex-row border p-4 gap-4"
          >
            <Avatar className="size-64">
              <AvatarFallback>
                {cource.name.at(0)?.toUpperCase()}
              </AvatarFallback>
              <AvatarImage className="rounded-sm" src={cource.imageUrl} />
            </Avatar>
            <div className="w-full flex flex-col justify-between gap-y-6">
              <div className="space-y-2">
                <div className="">
                  <h2 className="text-4xl">{cource.name}</h2>
                  <p className="text-xl">{cource.description}</p>
                </div>
                <div className="border-l-4 pl-4">
                  <p>Study time: {cource.studyTime}</p>
                  <p>Price: {cource.price} Euro</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Link href={`/course/${cource.id}`}>
                  <Button variant="outline" className="w-full">
                    See details
                  </Button>
                </Link>
                <Button
                  className="w-full"
                  variant={
                    enrolledCourseIds.includes(cource.id)
                      ? "destructive"
                      : "default"
                  }
                  disabled={pendingCourseId === cource.id}
                  onClick={() =>
                    enrolledCourseIds.includes(cource.id)
                      ? void handleCancelEnroll(cource.id)
                      : void handleEnroll(cource.id)
                  }
                >
                  {pendingCourseId === cource.id
                    ? pendingAction === "cancel"
                      ? "Cancelling..."
                      : "Signing..."
                    : enrolledCourseIds.includes(cource.id)
                      ? "Cancel enrollment"
                      : "Sign on this course"}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
