import { authMiddleware } from "@clerk/nextjs/server";

export default authMiddleware({
  ignoredRoutes: [],
  publicRoutes: [
    "/",
    "/legal/",
    "/legal/privacy-policy",
    "legal/anti-discrimination-policy",
    "legal/terms-and-conditions",
  ],
});

// Stop Middleware running on static files
export const config = {
  matcher: ["/(.*?trpc.*?|(?!static|.*\\..*|_next|favicon.ico).*)", "/"],
};
