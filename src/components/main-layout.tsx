import { cn } from "~/utils/style";

type MainLayoutProps = {
  children: React.ReactNode;
  app?: boolean;
};

export const MainLayout = (props: MainLayoutProps) => {
  const isApp = props.app;
  //localStorage.theme === 'dark' || (!('theme' in localStorage) &&
  if (
    isApp &&
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    document.documentElement.classList.add("dark");
  } else if (typeof window !== "undefined") {
    document.documentElement.classList.remove("dark");
  }
  // TODO: Implement LocalStorage
  // // Whenever the user explicitly chooses light mode
  // localStorage.theme = 'light'

  // // Whenever the user explicitly chooses dark mode
  // localStorage.theme = 'dark'

  // // Whenever the user explicitly chooses to respect the OS preference
  // localStorage.removeItem('theme')

  return (
    <main
      className={cn(
        isApp ? "" : "md:pl-32",
        "container flex min-h-screen w-full flex-col gap-x-8 bg-background px-8 py-8  sm:px-16"
      )}
    >
      {props.children}
    </main>
  );
};
