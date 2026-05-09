import Link from "next/link";

// ? Interfaces
import { CourceProps } from "@/lib/interfaces/cource";

// ? Components
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function CourceDetails() {
  const cource: CourceProps = {
    id: "7",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdItruwGc0DLpI66Now8jewf1dOVtZUBeajA&s",
    name: "Cybersecurity Basics",
    description:
      "Understand the fundamentals of cybersecurity and how to protect digital assets.",
    studyTime: "5 weeks",
    price: 129,
  };
  const users = [
    {
      username: "Username",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdItruwGc0DLpI66Now8jewf1dOVtZUBeajA&ss",
    },
    {
      username: "Username",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdItruwGc0DLpI66Now8jewf1dOVtZUBeajA&ss",
    },
    {
      username: "Username",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdItruwGc0DLpI66Now8jewf1dOVtZUBeajA&ss",
    },
    {
      username: "Username",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdItruwGc0DLpI66Now8jewf1dOVtZUBeajA&ss",
    },
    {
      username: "Username",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdItruwGc0DLpI66Now8jewf1dOVtZUBeajA&ss",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div
        key={"crs-l-" + cource.id}
        className="max-h-72 bg-secondary flex flex-row border p-4 gap-4"
      >
        <img src={cource.imageUrl} className="size-64 bg-primary rounded-sm" />
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
          <Button className="w-full max-w-86">Sign on this cource</Button>
        </div>
      </div>
      <div className="space-y-6">
        <h1 className="font-semibold text-3xl">
          Users already studding on this cource
        </h1>
        <div className="flex flex-wrap gap-4">
          {users.map((user, index) => (
            <div
              key={"usr-" + index}
              className="bg-secondary flex flex-row items-center border gap-x-4 p-4"
            >
              <Avatar className="size-16">
                <AvatarFallback>{user.username.at(0)}</AvatarFallback>
                <AvatarImage src={user.imageUrl} className="rounded-sm" />
              </Avatar>
              <h2 className="font-semibold text-xl">{user.username}</h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
