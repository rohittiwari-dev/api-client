import React from 'react';
import { IconBrandSocketIo } from '@tabler/icons-react';
import { Session, User } from 'better-auth';
import { Organization } from '@/generated/prisma';
import UserButton from '@/modules/authentication/components/user-button';
import SearchPanel from '@/modules/layout/components/Search-Panel';
import WorkspaceSwitcher from '@/modules/workspace/components/WorkspaceSwitcher';

const Header = ({
	currentUserSession,
	activeWorkspace,
	workspaces,
}: {
	workspaces: Organization[];
	activeWorkspace: Organization;
	currentUserSession: { user: User | null; session: Session | null };
}) => {
	return (
		<div
			className={
				'bg-sidebar flex h-[var(--header-height)] w-full items-center justify-between gap-2 px-2'
			}
		>
			{/*Brand*/}
			<div>
				<a href="#" className="flex items-center gap-2 font-medium">
					<div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
						<IconBrandSocketIo className="size-4" />
					</div>
					ApiClient
				</a>
			</div>
			{/*Center Action*/}
			<div>
				<SearchPanel />
			</div>
			{/*Actions*/}
			<div className={'flex items-center gap-2'}>
				<WorkspaceSwitcher
					workspaces={(workspaces || []) as Organization[]}
					activeOrganization={activeWorkspace}
				/>
				<UserButton data={currentUserSession!} variant={'header'} />
			</div>
		</div>
	);
};

export default Header;
