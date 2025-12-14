'use client';

import React, { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import { Session, User } from 'better-auth';
import { LogOut } from 'lucide-react';
import Spinner from '@/components/app-ui/spinner';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import authClient from '@/lib/authClient';
import { cn, getInitialsFromName } from '@/lib/utils';
import Avatar from '@/modules/authentication/components/avatar';
import { useAuthStore } from '@/modules/authentication/store';
import useCookieStore from '@/modules/cookies/store/cookie.store';

const LogoutMenuItem = () => {
	const [loading, setLoading] = useState(false);
	const { setAuthSession } = useAuthStore();
	const { clearCookies } = useCookieStore()
	return (
		<DropdownMenuItem
			onClick={async () => {
				setLoading(true);
				await authClient?.signOut({
					fetchOptions: {
						onRequest: () => {
							setLoading(true);
						},
						onSuccess: () => {
							setLoading(false);
							setAuthSession({
								session: null,
								user: null,
							});
							clearCookies();
							redirect('/sign-in');
						},
						onError: () => {
							setLoading(false);
						},
					},
				});
			}}
			className="hover:!bg-accent/30 cursor-pointer"
		>
			{loading ? (
				<Spinner className="!text-primary-200/60" />
			) : (
				<LogOut />
			)}
			Log out
		</DropdownMenuItem>
	);
};

function UserButton({
	data,
	variant = 'sidebar',
	dropdownContentAlign = 'bottom',
}: {
	data: { user: User | null; session: Session | null };
	variant?: 'sidebar' | 'header';
	dropdownContentAlign?: 'bottom' | 'right' | 'top' | 'left' | undefined;
}) {
	const { setAuthSession, data: stateData } = useAuthStore();
	const { email, name, image } = stateData?.user || data?.user || {};

	useEffect(() => {
		if (data) {
			setAuthSession(data);
		}
	}, [data, setAuthSession]);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild className="px-1">
				<Button
					size="lg"
					variant={variant === 'header' ? 'outline' : 'default'}
					className={cn(
						'data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground w-full cursor-pointer px-2 select-none',
						variant === 'header' &&
						'!bg-secondary hover:bg-accent/90 h-fit w-fit rounded-full p-0.5',
					)}
				>
					<Avatar
						className={cn(
							'h-[2rem] w-[2rem]',
							variant === 'sidebar' && 'rounded-lg',
						)}
						fallbackClassName={cn(
							'w-[2rem] h-[2rem]',
							variant === 'sidebar' && 'rounded-lg',
						)}
						href={image || ''}
						alt={name}
						initial={getInitialsFromName(name || '')}
					/>
					{variant === 'sidebar' && (
						<>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-semibold">
									{name}
								</span>
								<span className="truncate text-xs">
									{email}
								</span>
							</div>
						</>
					)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
				side={dropdownContentAlign}
				align="end"
				sideOffset={4}
			>
				<DropdownMenuLabel className="p-0 font-normal">
					<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
						<Avatar
							className="h-8 w-8 rounded-lg"
							fallbackClassName="rounded-lg"
							href={image || ''}
							alt={name}
							initial={getInitialsFromName(name || '')}
						/>
						<div className="grid flex-1 text-left text-sm leading-tight">
							<span className="truncate font-semibold">
								{name}
							</span>
							<span className="truncate text-xs">{email}</span>
						</div>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{/*<DropdownMenuGroup>*/}
				{/*  <DropdownMenuItem className="hover:!bg-accent/30 cursor-pointer">*/}
				{/*    <Sparkles />*/}
				{/*    Upgrade to Pro*/}
				{/*  </DropdownMenuItem>*/}
				{/*</DropdownMenuGroup>*/}
				{/*<DropdownMenuSeparator />*/}
				{/*<DropdownMenuGroup>*/}
				{/*  <DropdownMenuItem*/}
				{/*    className="hover:!bg-accent/30 cursor-pointer"*/}
				{/*    asChild*/}
				{/*  >*/}
				{/*    <Link href="/accounts">*/}
				{/*      <BadgeCheck />*/}
				{/*      Account*/}
				{/*    </Link>*/}
				{/*  </DropdownMenuItem>*/}
				{/*  <DropdownMenuItem className="hover:!bg-accent/30 cursor-pointer">*/}
				{/*    <CreditCard />*/}
				{/*    Billing*/}
				{/*  </DropdownMenuItem>*/}
				{/*</DropdownMenuGroup>*/}
				<DropdownMenuSeparator />
				<LogoutMenuItem />
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export default UserButton;
