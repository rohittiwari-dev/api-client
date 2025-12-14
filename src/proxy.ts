import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import auth from "@/lib/auth";

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const headersList = await headers();

    // Get session (includes activeOrganizationId from organization plugin)
    const session = await auth.api.getSession({
        headers: headersList
    });

    const isAuthPage = pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");
    const isWorkspacePage = pathname.startsWith("/workspace");
    const isGetStartedPage = pathname === "/workspace/get-started";
    const isWorkspaceRoot = pathname === "/workspace" || pathname === "/workspace/";

    // If not authenticated
    if (!session) {
        if (isWorkspacePage) {
            return NextResponse.redirect(new URL("/sign-in", request.url));
        }
        return NextResponse.next();
    }

    // Helper function to determine workspace redirect URL
    async function getWorkspaceRedirectUrl(): Promise<URL> {
        // Check if session has activeOrganizationId
        if (session!.session.activeOrganizationId) {
            // Fetch the active organization details to get slug
            const activeOrg = await auth.api.getFullOrganization({
                query: { organizationId: session!.session.activeOrganizationId },
                headers: headersList
            });

            if (activeOrg?.slug) {
                return new URL(`/workspace/${activeOrg.slug}`, request.url);
            }
        }

        // No active org, check if user has any organizations
        const orgs = await auth.api.listOrganizations({
            headers: headersList
        });

        if (orgs && orgs.length > 0) {
            // Use the first organization
            return new URL(`/workspace/${orgs[0].slug}`, request.url);
        }

        // No organizations at all
        return new URL("/workspace/get-started", request.url);
    }


    // If authenticated and on auth pages, redirect to workspace
    if (isAuthPage) {
        const redirectUrl = await getWorkspaceRedirectUrl();
        return NextResponse.redirect(redirectUrl);
    }

    // If on get-started but has organizations, redirect to appropriate workspace
    if (isGetStartedPage) {
        // Check if user has organizations
        if (session.session.activeOrganizationId) {
            const activeOrg = await auth.api.getFullOrganization({
                query: { organizationId: session.session.activeOrganizationId },
                headers: headersList
            });

            if (activeOrg?.slug) {
                return NextResponse.redirect(new URL(`/workspace/${activeOrg.slug}`, request.url));
            }
        }

        const orgs = await auth.api.listOrganizations({
            headers: headersList
        });

        if (orgs && orgs.length > 0) {
            return NextResponse.redirect(new URL(`/workspace/${orgs[0].slug}`, request.url));
        }

        // No orgs, allow access to get-started
        return NextResponse.next();
    }

    // If on workspace root, redirect appropriately
    if (isWorkspaceRoot) {
        const redirectUrl = await getWorkspaceRedirectUrl();
        return NextResponse.redirect(redirectUrl);
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
