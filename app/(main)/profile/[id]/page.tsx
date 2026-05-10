import { notFound } from "next/navigation";

// ? Components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// ? Actions
import { getProfile, getTeams, getWaitingList } from "@/actions/profile";

interface TeamCourseProps {
  id: string;
  groupId: string;
  imageUrl: string;
  name: string;
  description: string;
  price: number;
}
interface WaitingListCourseProps {
  id: string;
  waitingListId: string;
  imageUrl: string;
  name: string;
  description: string;
  price: number;
}

export default async function Profile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let user;

  try {
    user = await getProfile(id);
  } catch {
    notFound();
  }
  if (!user) notFound();

  const [teams, waitingList] = await Promise.all([
    getTeams(id).catch(() => []),
    getWaitingList(id).catch(() => []),
  ]);
  const groups: TeamCourseProps[] = teams
    .filter((team) => team.cource)
    .map((team) => ({
      id: team.cource.id,
      groupId: team.id,
      imageUrl: team.cource.imageUrl,
      name: team.cource.name,
      description: `${team.name} group`,
      price: team.cource.price,
    }));
  const waitingCourses: WaitingListCourseProps[] = waitingList
    .filter((entry) => entry.cource)
    .map((entry) => ({
      id: entry.cource.id,
      waitingListId: entry.id,
      imageUrl: entry.cource.imageUrl,
      name: entry.cource.name,
      description: entry.cource.description,
      price: entry.cource.price,
    }));

  return (
    <div className="p-6 space-y-6">
      <div className="h-52 bg-secondary border p-4">
        <div className="flex flex-row items-center gap-x-4">
          <Avatar className="size-44">
            <AvatarFallback>
              {user?.username?.at(0)?.toUpperCase() || "U"}
            </AvatarFallback>
            {user.imageUrl ? (
              <AvatarImage className="rounded-sm" src={user.imageUrl} />
            ) : null}
          </Avatar>
          <div>
            <h1 className="text-3xl">{user.username || "User"}</h1>
            <p className="text-sm">{user.email}</p>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <h1 className="font-semibold text-3xl">List of Groups</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((group) => (
            <div
              key={group.groupId + "-crs-" + group.id}
              className="bg-secondary border flex flex-row p-4 gap-x-4"
            >
              <Avatar className="size-24 rounded-sm">
                <AvatarFallback>
                  {group.name.at(0)?.toUpperCase() || "C"}
                </AvatarFallback>
                <AvatarImage src={group.imageUrl} className="rounded-sm" />
              </Avatar>
              <div className="flex flex-col">
                <h1 className="text-2xl">{group.name}</h1>
                <p>{group.description}</p>
                <p>Price: {group.price} Euro</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <h1 className="font-semibold text-3xl">Waiting List</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {waitingCourses.map((course) => (
            <div
              key={course.waitingListId + "-wl-" + course.id}
              className="bg-secondary border flex flex-row p-4 gap-x-4"
            >
              <Avatar className="size-24 rounded-sm">
                <AvatarFallback>
                  {course.name.at(0)?.toUpperCase() || "C"}
                </AvatarFallback>
                <AvatarImage src={course.imageUrl} className="rounded-sm" />
              </Avatar>
              <div className="flex flex-col">
                <h1 className="text-2xl">{course.name}</h1>
                <p>{course.description}</p>
                <p>Price: {course.price} Euro</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
