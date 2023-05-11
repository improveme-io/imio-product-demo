import { authMiddleware } from "@clerk/nextjs/server";

const publicRoutes = [
  "/",
  "/legal/",
  "/legal/privacy-policy",
  "legal/anti-discrimination-policy",
  "legal/terms-and-conditions",
];

export default authMiddleware({
  ignoredRoutes: [],
  publicRoutes,
});

// Stop Middleware running on static files
export const config = {
  matcher: [
    "/(.*?trpc.*?|(?!static|.*\\..*|_next|favicon.ico).*)",
    ...publicRoutes,
  ],
};
