import Link from "next/link";

interface MenuItem {
  label: string;
  href: string;
}

interface Menu {
  title: string;
  items: MenuItem[];
}

export function Footer(): React.ReactNode {
  const menus: Menu[] = [
    {
      title: "Sitemap",
      items: [
        {
          label: "Home",
          href: "/",
        },
        {
          label: "Cources",
          href: "/cources",
        },
      ],
    },
    {
      title: "Social",
      items: [
        {
          label: "Facebook",
          href: "https://www.facebook.com/",
        },
        {
          label: "Instagram",
          href: "https://www.instagram.com/",
        },
        {
          label: "Twitter",
          href: "https://www.twitter.com/",
        },
      ],
    },
  ];

  return (
    <footer className="w-full bg-secondary border-t py-8 px-16 space-y-8 mt-8">
      <div className="flex flex-col md:flex-row justify-between gap-8">
        <div>
          <h2 className="text-2xl">
            Cources<span className="text-primary">.com</span>
          </h2>
          <p>Learn. Grow. Succeed.</p>
        </div>
        <div className="grid gap-cols-1 justify-center sm:justify-start sm:grid-cols-2 gap-8">
          {menus.map((menu, index) => (
            <div key={"cl-ft-" + index} className="space-y-4">
              <h3 className="text-xl font-semibold">{menu.title}</h3>
              <div className="space-y-2">
                {menu.items.map((item) => (
                  <div key={item.label}>
                    <Link href={item.href}>{item.label}</Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <hr />
      <div className="flex justify-center">
        <p>
          &copy; {new Date().getFullYear()}{" "}
          <Link href="/" className="text-primary">
            Cources.com.
          </Link>{" "}
          All rights reserved.
        </p>
      </div>
    </footer>
  );
}
