"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

// ? Interfaces
import { CourceProps } from "@/lib/interfaces/cource";

// ? Components
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// ? Actions
import { getSession } from "@/actions/auth";
import {
  cancelEnrollToCourse,
  enrollToCourse,
  getCourse,
  getEnrolledCourses,
} from "@/actions/user/course";

export default function CourceDetails() {
  const params = useParams<{ id: string }>();
  const [cource, setCourse] = useState<CourceProps>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pendingAction, setPendingAction] = useState<
    "enroll" | "cancel" | null
  >(null);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);

  useEffect(() => {
    let isActive = true;

    const loadCourse = async () => {
      try {
        const courseId = params?.id;

        if (!courseId) {
          setError("Cannot display course details without id");
          return;
        }

        const token = localStorage.getItem("authToken");
        const [course, enrolledIds] = await Promise.all([
          getCourse(courseId),
          token
            ? getEnrolledCourses(token).catch(() => [])
            : Promise.resolve<string[]>([]),
        ]);

        if (!isActive) return;
        if (!course) {
          setError("Course not found");
          return;
        }

        setCourse(course);
        setEnrolledCourseIds(enrolledIds);
      } catch (err) {
        if (!isActive) return;
        setError(err instanceof Error ? err.message : "Failed to load course");
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    void loadCourse();

    return () => {
      isActive = false;
    };
  }, [params?.id]);

  const handleEnroll = async () => {
    if (!cource?.id) return;
    if (enrolledCourseIds.includes(cource.id)) return;

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

    setPendingAction("enroll");
    setError("");
    setSuccess("");

    try {
      await enrollToCourse(token, cource.id);
      setEnrolledCourseIds((currentValue) =>
        currentValue.includes(cource.id)
          ? currentValue
          : [...currentValue, cource.id],
      );
      setSuccess("You have been enrolled to course");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to enroll");
    } finally {
      setPendingAction(null);
    }
  };

  const handleCancelEnroll = async () => {
    if (!cource?.id) return;
    if (!enrolledCourseIds.includes(cource.id)) return;

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

    setPendingAction("cancel");
    setError("");
    setSuccess("");

    try {
      await cancelEnrollToCourse(token, cource.id);
      setEnrolledCourseIds((currentValue) =>
        currentValue.filter((currentCourseId) => currentCourseId !== cource.id),
      );
      setSuccess("Enrollment cancelled");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to cancel enrollment",
      );
    } finally {
      setPendingAction(null);
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading course</div>;
  }

  if (!cource) {
    return <div className="p-6">{error || "Course not found"}</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {error ? <p className="text-red-500">{error}</p> : null}
      {success ? <p className="text-green-600">{success}</p> : null}
      <div
        key={"crs-l-" + cource?.id}
        className="max-h-72 bg-secondary flex flex-row border p-4 gap-4"
      >
        <Avatar className="size-46">
          <AvatarFallback>
            {cource?.name?.at(0)?.toUpperCase() || "C"}
          </AvatarFallback>
          <AvatarImage src={cource?.imageUrl} className="rounded-sm" />
        </Avatar>
        <div className="w-full flex flex-col justify-between gap-y-6">
          <div className="space-y-2">
            <div className="">
              <h2 className="text-4xl">{cource?.name}</h2>
              <p className="text-xl">{cource?.description}</p>
            </div>
            <div className="border-l-4 pl-4">
              <p>Study time: {cource?.studyTime}</p>
              <p>Price: {cource?.price} Euro</p>
            </div>
          </div>
          <Button
            className="w-full max-w-86"
            variant={
              cource?.id && enrolledCourseIds.includes(cource.id)
                ? "destructive"
                : "default"
            }
            disabled={pendingAction !== null}
            onClick={() =>
              cource?.id && enrolledCourseIds.includes(cource.id)
                ? void handleCancelEnroll()
                : void handleEnroll()
            }
          >
            {pendingAction === "cancel"
              ? "Cancelling..."
              : pendingAction === "enroll"
                ? "Signing..."
                : cource?.id && enrolledCourseIds.includes(cource.id)
                  ? "Cancel enrollment"
                  : "Sign on this cource"}
          </Button>
        </div>
      </div>
    </div>
  );
}
