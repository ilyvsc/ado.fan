import { NextResponse, type NextRequest } from "next/server";

import { auth } from "@/admin/auth/server";

const PUBLIC_PATHS = new Set(["/admin/sign-in", "/admin/join"]);

function isPublicPath(pathname: string) {
  if (PUBLIC_PATHS.has(pathname)) return true;

  for (const path of PUBLIC_PATHS) {
    if (pathname.startsWith(`${path}/`)) return true;
  }

  return false;
}

const devBypass =
  process.env.NODE_ENV === "development" && process.env.ADMIN_DEV_BYPASS === "allow";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (devBypass || isPublicPath(pathname)) return NextResponse.next();

  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });
    if (session) return NextResponse.next();
  } catch (error) {
    console.error("Admin authentication failed");
  }

  const redirectUrl = new URL("/admin/sign-in", request.url);

  redirectUrl.searchParams.set(
    "callbackUrl",
    pathname.startsWith("/admin") ? pathname : "/admin",
  );

  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: ["/admin/:path*"],
};
