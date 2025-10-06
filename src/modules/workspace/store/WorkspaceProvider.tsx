'use client';

import React from 'react';
import { Organization } from '@/generated/prisma';
import useWorkspaceState from '.';

const WorkspaceProvider = ({
	children,
	activeOrg,
	workspaces,
}: {
	activeOrg: Organization;
	workspaces: Organization[];
	children: React.ReactNode;
}) => {
	const { setWorkspaces, setActiveWorkspace } = useWorkspaceState();

	React.useEffect(() => {
		setWorkspaces(workspaces);
		setActiveWorkspace(activeOrg);
	}, [activeOrg, setActiveWorkspace, setWorkspaces, workspaces]);

	return <div>{children}</div>;
};

export default WorkspaceProvider;
