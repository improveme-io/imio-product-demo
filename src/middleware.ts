import { authMiddleware } from "@clerk/nextjs/server";

const publicRoutes = [
  "/",
  "/legal/contact",
  "/legal/privacy-policy",
  "/legal/anti-discrimination-policy",
  "/legal/terms-and-conditions",
  "/uva-course",
];

export default authMiddleware({
  ignoredRoutes: [],
  publicRoutes,
});

// Stop Middleware running on static files
export const config = {
  matcher: ["/(.*?trpc.*?|(?!static|.*\\..*|_next|favicon.ico).*)"],
};
