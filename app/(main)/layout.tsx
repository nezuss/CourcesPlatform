import { Navbar } from "@/components/navigation/navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-full flex flex-col">
      <Navbar />
      <div className="mt-[65px]">{children}</div>
    </div>
  );
}
