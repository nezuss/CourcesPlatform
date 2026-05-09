// ? Components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CourceProps {
  id: string;
  groupId: string;
  imageUrl: string;
  name: string;
  description: string;
  price: number;
}

export default function Profile() {
  const groups: CourceProps[] = [
    {
      id: "def456",
      groupId: "group3",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdItruwGc0DLpI66Now8jewf1dOVtZUBeajA&s",
      name: "Item C",
      description: "Highly recommended.",
      price: 3,
    },
    {
      id: "def456",
      groupId: "group3",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdItruwGc0DLpI66Now8jewf1dOVtZUBeajA&s",
      name: "Item C",
      description: "Highly recommended.",
      price: 3,
    },
    {
      id: "def456",
      groupId: "group3",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdItruwGc0DLpI66Now8jewf1dOVtZUBeajA&s",
      name: "Item C",
      description: "Highly recommended.",
      price: 3,
    },
    {
      id: "def456",
      groupId: "group3",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdItruwGc0DLpI66Now8jewf1dOVtZUBeajA&s",
      name: "Item C",
      description: "Highly recommended.",
      price: 3,
    },
    {
      id: "def456",
      groupId: "group3",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdItruwGc0DLpI66Now8jewf1dOVtZUBeajA&s",
      name: "Item C",
      description: "Highly recommended.",
      price: 3,
    },
    {
      id: "def456",
      groupId: "group3",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdItruwGc0DLpI66Now8jewf1dOVtZUBeajA&s",
      name: "Item C",
      description: "Highly recommended.",
      price: 3,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="h-52 bg-secondary border p-4">
        <div className="flex flex-row items-center gap-x-4">
          <Avatar className="size-44">
            <AvatarFallback>T</AvatarFallback>
            <AvatarImage
              className="rounded-sm"
              src={
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdItruwGc0DLpI66Now8jewf1dOVtZUBeajA&s"
              }
            />
          </Avatar>
          <div>
            <h1 className="text-3xl">USERNAME</h1>
            <p className="text-sm">USERNAME@mail.com</p>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <h1 className="font-semibold text-3xl">List of Groups</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((group, index) => (
            <div
              key={index + "-crs-" + group.id}
              className="bg-secondary border flex flex-row p-4 gap-x-4"
            >
              <img src={group.imageUrl} className="size-24 rounded-sm" />
              <div className="flex flex-col">
                <h1 className="text-2xl">{group.name}</h1>
                <p>{group.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
