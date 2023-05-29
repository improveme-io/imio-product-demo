import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  let darkMode = false;
  //localStorage.theme === 'dark' || (!('theme' in localStorage) &&
  if (
    // isApp &&
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    document.documentElement.classList.add("dark");
    darkMode = true;
  } else if (typeof window !== "undefined") {
    document.documentElement.classList.remove("dark");
    darkMode = false;
  }
  // TODO: Implement LocalStorage
  // // Whenever the user explicitly chooses light mode
  // localStorage.theme = 'light'

  // // Whenever the user explicitly chooses dark mode
  // localStorage.theme = 'dark'

  // // Whenever the user explicitly chooses to respect the OS preference
  // localStorage.removeItem('theme')

  return (
    <ClerkProvider
      {...pageProps}
      appearance={{
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        baseTheme: darkMode ? dark : undefined,
      }}
    >
      <Component {...pageProps} />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
