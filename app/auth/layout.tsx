export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      data-type="auth-layout"
      className="h-lvh grid grid-cols-1 lg:grid-cols-2 p-6"
    >
      <div className="flex flex-col items-center justify-center p-8">
        {children}
      </div>
      <div className="bg-primary hidden lg:block p-8"></div>
    </div>
  );
}
