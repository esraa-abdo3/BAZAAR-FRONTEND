import { NextResponse } from "next/server";

// Which role is allowed to enter which dashboard route.
const ROUTE_ROLES = {
  "/AdminDashboard": ["ADMIN"],
  "/BrandOwnerDashboard": ["BRAND_OWNER"],
  "/BazaarOwnerDashboard": ["BAZAAR_OWNER"],
};

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const matchedRoute = Object.keys(ROUTE_ROLES).find((route) =>
    pathname.startsWith(route)
  );

  // Not a protected route -> let it through untouched
  if (!matchedRoute) {
    return NextResponse.next();
  }

  const role = request.cookies.get("role")?.value;

  // Not logged in at all
  if (!role) {
    const url = new URL("/unauthorized", request.url);
    url.searchParams.set("reason", "no-auth");
    return NextResponse.redirect(url);
  }

  // Logged in, but wrong role for this dashboard
  const allowedRoles = ROUTE_ROLES[matchedRoute];
  if (!allowedRoles.includes(role)) {
    const url = new URL("/unauthorized", request.url);
    url.searchParams.set("reason", "wrong-role");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Only run this middleware on the dashboard routes we're protecting.
export const config = {
  matcher: [
    "/AdminDashboard/:path*",
    "/BrandOwnerDashboard/:path*",
    "/BazaarOwnerDashboard/:path*",
  ],
};
