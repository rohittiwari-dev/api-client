import React from 'react';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Organization } from '@/generated/prisma';
import auth from '@/lib/auth';
import { currentUser } from '@/modules/authentication/server/auth.actions';
import Header from '@/modules/layout/components/header';
import { AppSidebar } from '@/modules/layout/components/sidebar/AppSidebar';
import RightSidebar from '@/modules/layout/components/sidebar/right-sidebar';
import { getAllCollections } from '@/modules/requests/server/collections';
import WorkspaceProvider from '@/modules/workspace/store/WorkspaceProvider';

const WorkspaceLayout = async ({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ slug: string }>;
}) => {
	const awaitParams = await params;
	const headersData = await headers();
	const currentUserSession = await currentUser();
	const workspaces = await auth.api.listOrganizations({
		headers: headersData,
	});

	const activeWorkspace = (workspaces.find(
		(workspace) => workspace.slug === awaitParams?.slug,
	) ||
		workspaces?.find(
			(val) =>
				val.id === currentUserSession?.session?.activeOrganizationId,
		) ||
		workspaces[0]) as Organization;

	if (!activeWorkspace) {
		return redirect('/workspace/get-started');
	}

	if (activeWorkspace.slug !== awaitParams?.slug) {
		await auth.api.setActiveOrganization({
			body: {
				organizationId: activeWorkspace.id,
			},
			headers: await headers(),
		});
	}

	return (
		<WorkspaceProvider
			activeOrg={activeWorkspace}
			workspaces={(workspaces || []) as Organization[]}
		>
			<div className="flex flex-col w-full h-[100svh] [--header-height:calc(--spacing(14))]">
				<SidebarProvider className="flex flex-col w-full h-full">
					<Header currentUserSession={currentUserSession!} />
					<div className="flex flex-1 w-full h-full overflow-hidden">
						<AppSidebar
							collections={
								(await getAllCollections(activeWorkspace?.id))
									?.data || []
							}
						/>
						<SidebarInset className="h-full overflow-hidden overflow-y-auto">
							{children}
						</SidebarInset>
						<RightSidebar />
					</div>
				</SidebarProvider>
			</div>
		</WorkspaceProvider>
	);
};

export default WorkspaceLayout;
