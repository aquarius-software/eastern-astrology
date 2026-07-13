import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ['/author/:path*']
};

export function middleware(request: NextRequest) {
  return NextResponse.redirect(new URL('/', request.url));
}