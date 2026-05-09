import Link from "next/link";

// ? Interfaces
import { CourceProps } from "@/lib/interfaces/cource";

// ? Components
import { Button } from "@/components/ui/button";

export default function Cources() {
  const cources: CourceProps[] = [
    {
      id: "1",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdItruwGc0DLpI66Now8jewf1dOVtZUBeajA&s",
      name: "Web Development Bootcamp",
      description:
        "Learn HTML, CSS, and JavaScript from scratch and build modern web applications.",
      studyTime: "12 weeks",
      price: 199,
    },
    {
      id: "2",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdItruwGc0DLpI66Now8jewf1dOVtZUBeajA&s",
      name: "Python for Beginners",
      description:
        "Start coding with Python and discover the basics of programming and automation.",
      studyTime: "8 weeks",
      price: 99,
    },
    {
      id: "3",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdItruwGc0DLpI66Now8jewf1dOVtZUBeajA&s",
      name: "Data Science Essentials",
      description:
        "Analyze data, create visualizations, and build machine learning models.",
      studyTime: "10 weeks",
      price: 249,
    },
    {
      id: "4",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdItruwGc0DLpI66Now8jewf1dOVtZUBeajA&s",
      name: "UI/UX Design Fundamentals",
      description:
        "Master the principles of user interface and user experience design.",
      studyTime: "6 weeks",
      price: 149,
    },
    {
      id: "5",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdItruwGc0DLpI66Now8jewf1dOVtZUBeajA&s",
      name: "React Developer Course",
      description:
        "Build interactive web apps using React, hooks, and modern state management.",
      studyTime: "7 weeks",
      price: 179,
    },
    {
      id: "6",
      imageUrl: "/images/mobile.jpg",
      name: "Mobile App Development",
      description: "Create cross-platform mobile apps with Flutter and Dart.",
      studyTime: "9 weeks",
      price: 229,
    },
    {
      id: "7",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdItruwGc0DLpI66Now8jewf1dOVtZUBeajA&s",
      name: "Cybersecurity Basics",
      description:
        "Understand the fundamentals of cybersecurity and how to protect digital assets.",
      studyTime: "5 weeks",
      price: 129,
    },
  ];

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {cources.map((cource, index) => (
          <div
            key={"crs-l-" + index + "-" + cource.id}
            className="max-h-72 bg-secondary flex flex-row border p-4 gap-4"
          >
            <img
              src={cource.imageUrl}
              className="size-64 bg-primary rounded-sm"
            />
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
                <Button className="w-full">Sign on this cource</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className=""></div>
    </div>
  );
}
