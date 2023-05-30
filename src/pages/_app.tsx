import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  // TODO: Dark Mode v2 LocalStorage, menu no page reload https://github.com/improveme-io/imio/issues/97
  let darkMode = false;
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    document.documentElement.classList.add("dark");
    darkMode = true;
  } else if (typeof window !== "undefined") {
    document.documentElement.classList.remove("dark");
    darkMode = false;
  }

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
