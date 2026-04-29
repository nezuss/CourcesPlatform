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

export default function Home() {
  const cources: CourceProps[] = [
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
      <div className="bg-secondary border rounded-4xl p-8">
        <div className="flex flex-row items-center gap-x-4">
          <Avatar className="size-24">
            <AvatarFallback>T</AvatarFallback>
            <AvatarImage
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
        <h1 className="font-semibold text-3xl">List of Cources</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cources.map((cource, index) => (
            <div
              key={index + "-crs-" + cource.id}
              className="bg-secondary border flex flex-row rounded-2xl p-4 gap-x-4"
            >
              <img src={cource.imageUrl} className="size-24 rounded-xl" />
              <div className="flex flex-col">
                <h1 className="text-2xl">{cource.name}</h1>
                <p>{cource.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
