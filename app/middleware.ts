import { NextResponse } from "next/server";

export function middleware(req: any) {
  const token = req.cookies.get("token");

  if (!token && req.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!token && req.nextUrl.pathname.startsWith("/superadmin")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}