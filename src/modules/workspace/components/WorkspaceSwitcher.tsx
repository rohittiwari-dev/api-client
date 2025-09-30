'use client';

import React, { useEffect } from 'react';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Organization } from '@/generated/prisma';
import { cn } from '@/lib/utils';
import WorkspaceSetup from '@/modules/workspace/components/workspace-setup';

const WorkspaceSwitcher = ({
	workspaces,
	activeOrganization,
}: {
	workspaces: Organization[];
	activeOrganization: Organization;
}) => {
	const [selected, setSelected] =
		React.useState<Organization>(activeOrganization);
	const [workspaceSetupModalOpen, setWorkspaceSetupModalOpen] =
		React.useState(false);

	useEffect(() => {
		setSelected(activeOrganization);
	}, [activeOrganization]);

	return (
		<>
			<Select
				value={selected.id}
				onValueChange={async (val) => {
					const workspace = workspaces.find(
						(workspace) => workspace.id === val,
					);
					if (workspace) {
						setSelected(workspace);
						redirect(`/workspace/${workspace.slug}`);
					}
				}}
			>
				<SelectTrigger
					type={'button'}
					className={cn('!bg-muted/60 min-w-40 cursor-pointer')}
				>
					<SelectValue />
				</SelectTrigger>
				<SelectContent className={'px-2 py-2'}>
					{workspaces?.map((workspace) => (
						<SelectItem
							className={'hover:!bg-input/40 cursor-pointer'}
							key={workspace.name + workspace.id}
							value={workspace.id}
						>
							{workspace.name}
						</SelectItem>
					))}
					<Button
						onClick={() => setWorkspaceSetupModalOpen(true)}
						className={
							'hover:bg-primary mt-2 cursor-pointer text-sm'
						}
						variant={'secondary'}
						size={'sm'}
					>
						Create Workspace
					</Button>
				</SelectContent>
			</Select>
			<Dialog
				onOpenChange={(open) =>
					setWorkspaceSetupModalOpen(open || false)
				}
				open={workspaceSetupModalOpen}
				modal={true}
			>
				<DialogContent
					title={'Create Workspace'}
					className={'max-w-7xl'}
				>
					<DialogTitle>Create New Workspace</DialogTitle>
					<WorkspaceSetup type={'workspace-setup-modal'} />
				</DialogContent>
			</Dialog>
		</>
	);
};

export default WorkspaceSwitcher;
