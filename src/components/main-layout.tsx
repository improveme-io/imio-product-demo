type MainLayoutProps = {
  children: React.ReactNode;
};

export const MainLayout = ({ children }: MainLayoutProps) => (
  <main className="container flex min-h-screen w-full flex-col gap-x-8 bg-stone-50 px-8 py-8 sm:px-16 md:pl-32">
    {children}
  </main>
);
