import Link from "next/link";

// ? Components
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar(): React.ReactElement {
  const list = [
    {
      name: "Home",
      link: "/",
    },
    {
      name: "Cources",
      link: "/cources",
    },
  ];

  return (
    <nav className="p-6 pb-0">
      <div className="bg-secondary flex flex-row justify-between border rounded-4xl p-4">
        <div className="flex flex-row items-center gap-x-4">
          {list.map((item, index) => (
            <Link key={index + "-nb-menu"} href={item.link}>
              <Button variant="secondary">{item.name}</Button>
            </Link>
          ))}
        </div>
        <div>
          {/*<div className="flex flex-row items-center gap-x-4">
            <Button variant="outline">Sign Up</Button>
            <Button>Sign In</Button>
          </div>*/}
          <div className="flex flex-row items-center gap-x-4">
            <p>test@mail.com</p>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarFallback>T</AvatarFallback>
                  <AvatarImage src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdItruwGc0DLpI66Now8jewf1dOVtZUBeajA&s" />
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mr-8">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Administrative</DropdownMenuLabel>
                  <Link href="/admin">
                    <DropdownMenuItem>Dashboard</DropdownMenuItem>
                  </Link>
                  <Link href="/admin/cources">
                    <DropdownMenuItem>Cources</DropdownMenuItem>
                  </Link>
                  <Link href="/admin/users">
                    <DropdownMenuItem>Users</DropdownMenuItem>
                  </Link>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Account</DropdownMenuLabel>
                  <Link href="/profile/uhygfsd">
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                  </Link>
                  <Link href="/auth/logout">
                    <DropdownMenuItem variant="destructive">
                      Logout
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
