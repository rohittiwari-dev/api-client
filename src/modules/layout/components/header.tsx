'use client';

import React from 'react';
import Image from 'next/image';
import { Session, User } from 'better-auth';
import ThemeSwitcher from '@/components/app-ui/theme-switcher';
import UserButton from '@/modules/authentication/components/user-button';
import { useAuthStore } from '@/modules/authentication/store';
import SearchPanel from '@/modules/layout/components/Search-Panel';
import EnvironmentSwitcher from '@/modules/workspace/components/EnvironmentSwitcher';
import WorkspaceInvite from '@/modules/workspace/components/workspace-invite';
import WorkspaceSwitcher from '@/modules/workspace/components/WorkspaceSwitcher';

const Header = ({
	currentUserSession,
}: {
	currentUserSession: { user: User | null; session: Session | null };
}) => {
	const { setAuthSession } = useAuthStore();

	React.useEffect(() => {
		if (currentUserSession) {
			setAuthSession(currentUserSession);
		}
	}, [currentUserSession, setAuthSession]);

	return (
		<div
			className={
				'bg-sidebar flex h-[var(--header-height)] w-full flex-wrap items-center justify-between gap-2 px-2'
			}
		>
			{/*Brand*/}
			<div className="flex flex-wrap flex-1 items-center gap-6">
				<a href="#" className="flex items-center font-medium">
					<div className="flex justify-center items-center rounded-md">
						<Image
							src="/logo.png"
							alt="ApiClient"
							width={100}
							height={100}
							priority
							className="w-[35px] h-[30px]"
						/>
					</div>
					ApiClient
				</a>
				<ThemeSwitcher variant="multiple" />
				<EnvironmentSwitcher />
			</div>
			{/*Center Action*/}
			<div>
				<SearchPanel />
			</div>
			{/*Actions*/}
			<div
				className={
					'flex flex-1 flex-wrap items-center justify-end gap-2'
				}
			>
				<WorkspaceSwitcher />
				<WorkspaceInvite />
				<UserButton data={currentUserSession!} variant={'header'} />
			</div>
		</div>
	);
};

export default Header;
