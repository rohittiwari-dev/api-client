import { NextRequest, NextResponse } from "next/server";

/**
 * Lightweight middleware for Netlify Edge compatibility.
 * Only performs cookie-based checks without database access.
 * Heavy auth logic is handled in server components/layouts.
 */
export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Check for session cookie (better-auth uses this cookie name)
    const sessionCookie = request.cookies.get("better-auth.session_token") ||
        request.cookies.get("__Secure-better-auth.session_token");

    const hasSession = !!sessionCookie?.value;

    const isAuthPage = pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");
    const isWorkspacePage = pathname.startsWith("/workspace");

    // If no session cookie and trying to access workspace, redirect to sign-in
    if (!hasSession && isWorkspacePage) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // If has session cookie and on auth pages, redirect to workspace
    // The actual workspace routing is handled by the layout.tsx server component
    if (hasSession && isAuthPage) {
        return NextResponse.redirect(new URL("/workspace", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/workspace/:path*",
        "/sign-in",
        "/sign-up",
    ],
};
