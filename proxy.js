// proxy.js (JavaScript, ESM)
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/product-details/(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // لو المسار مش من الـ public => حميه
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
  // ممكن ترجع تعديل على headers هنا لو احتجت
  return NextResponse.next();
});

export const config = {
  matcher: [
    // استثناء ملفات الستاتيك و _next
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // شغل للمسارات الـ API دايمًا
    "/(api|trpc)(.*)",
  ],
};
