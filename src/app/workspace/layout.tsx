import React from 'react';
import { currentUser } from '@/modules/authentication/server/auth.actions';
import AuthProvider from '@/modules/authentication/store/AuthProvider';

// Force dynamic rendering since we use headers() via currentUser()
export const dynamic = 'force-dynamic';

const WorkspaceLayout = async ({ children }: { children: React.ReactNode }) => {
	const currentUserSession = await currentUser();
	return (
		<AuthProvider
			state={{
				data: {
					session: currentUserSession?.session || null,
					user: currentUserSession?.user || null,
				},
			}}
		>
			{children}
		</AuthProvider>
	);
};

export default WorkspaceLayout;
