import { cn } from "~/utils/style";

type MainLayoutProps = {
  children: React.ReactNode;
  app?: boolean;
};

export const MainLayout = (props: MainLayoutProps) => {
  const isApp = props.app;

  return (
    <main
      className={cn(
        isApp ? "" : "md:pl-32",
        "container flex min-h-screen w-full flex-col gap-x-8 bg-stone-50 px-8 py-8 sm:px-16"
      )}
    >
      {props.children}
    </main>
  );
};
