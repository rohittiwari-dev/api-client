'use client';

import * as React from 'react';
import {
	ChevronRight,
	Code2,
	File,
	Folder,
	MoreHorizontal,
	PencilIcon,
	Plus,
	Trash,
} from 'lucide-react';
import { IconSocketIO, IconWebSocket } from '@/assets/app-icons';
import { Button, buttonVariants } from '@/components/ui/button';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarRail,
} from '@/components/ui/sidebar';
import useRequestTabsStore from '@/modules/requests/store/tabs.store';
import { RequestType } from '@/modules/requests/types';

// This is sample data.
const data = {
	tree: [
		[
			{ name: 'app', type: 'collection', id: 'dsalfjsdoahfo' },
			[
				{ name: 'api', type: 'collection', id: 'dsalfjsdoahfo' },
				[
					{ name: 'hello', type: 'collection', id: 'dsalfjsdoahfo' },
					[
						{
							name: 'route.ts',
							type: 'http',
							method: 'GET',
							id: 'dsalfjsdoahfo',
						},
					],
				],
				{
					name: 'page.tsx',
					type: 'http',
					method: 'POST',
					id: 'dsalfjsdoahfo',
				},
				{
					name: 'layout.tsx',
					type: 'http',
					method: 'PUT',
					id: 'dsalfjsdoahfo',
				},
				[
					{ name: 'blog', type: 'collection', id: 'dsalfjsdoahfo' },
					[
						{
							name: 'page.tsx',
							type: 'websocket',
							id: 'dsalfjsdoahfo',
						},
					],
				],
			],
		],
		[
			{ name: 'components', type: 'collection', id: 'dsalfjsdoahfo' },
			[
				{ name: 'components', type: 'collection', id: 'dsalfjsdoahfo' },
				{
					name: 'button.tsx',
					type: 'http',
					method: 'GET',
					id: 'dsalfjsdoahfo',
				},
				{
					name: 'card.tsx',
					type: 'http',
					method: 'DELETE',
					id: 'dsalfjsdoahfo',
				},
			],
			{
				name: 'layout.tsx',
				type: 'http',
				method: 'PUT',
				id: 'dsalfjsdoahfo',
			},
			{
				name: 'header.tsx',
				type: 'http',
				method: 'PUT',
				id: 'dsalfjsdoahfo',
			},
		],
		[{ name: 'lib', type: 'collection', id: 'dsalfjsdoahfo' }, ['util']],
		[
			{ name: 'public', type: 'collection', id: 'dsalfjsdoahfo' },
			{ name: 'favicon', type: 'socketio', id: 'dsalfjsdoahfo' },
			{ name: 'vercel', type: 'websocket', id: 'dsalfjsdoahfo' },
		],
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar
			className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
			{...props}
		>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel className="flex justify-between items-center gap-2 !pr-0 w-full font-medium text-muted-foreground text-sm">
						<span className="flex-1">Collections</span>
						<Button
							size="icon"
							variant={'ghost'}
							className="!m-0 !p-1"
						>
							<Plus />
						</Button>
					</SidebarGroupLabel>
					<SidebarGroupContent className="mt-2">
						<SidebarMenu>
							{data.tree.map((item, index) => (
								<Tree key={index} item={item} />
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	);
}

function Tree({ item }: { item: string | any[] }) {
	const { activeTab } = useRequestTabsStore();
	const [file, ...items] = Array.isArray(item) ? item : [item];

	if (!items.length) {
		return (
			<SidebarMenuButton
				isActive={activeTab?.id === file.id}
				className="data-[active=true]:bg-transparent cursor-pointer select-none"
			>
				<File />
				<span className="flex-1">{file.name}</span>
				<TreeItemOption type={file.type} optionId={file.id} />
			</SidebarMenuButton>
		);
	}

	return (
		<SidebarMenuItem>
			<Collapsible
				className="group/collapsible w-full [&[data-state=open]>button>svg:first-child]:rotate-90 select-none"
				defaultOpen={file.id === activeTab?.collection_id}
			>
				<CollapsibleTrigger asChild className="cursor-pointer">
					<SidebarMenuButton asChild>
						<div>
							<ChevronRight className="transition-transform" />
							<Folder />
							<span className="flex-1">{file.name}</span>
							<TreeItemOption
								type={'collection'}
								optionId={file.id}
							/>
						</div>
					</SidebarMenuButton>
				</CollapsibleTrigger>
				<CollapsibleContent className="w-full">
					<SidebarMenuSub className="pr-4 w-full">
						{items.map((subItem, index) => (
							<Tree key={index} item={subItem} />
						))}
					</SidebarMenuSub>
				</CollapsibleContent>
			</Collapsible>
		</SidebarMenuItem>
	);
}

const TreeItemOption = ({
	type,
	optionId,
}: {
	type?: 'collection' | RequestType;
	optionId?: string;
}) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				asChild
				onClick={(e) => {
					e.stopPropagation();
				}}
				className="select-none"
			>
				<div
					onClick={(e) => {
						e.stopPropagation();
					}}
					className={buttonVariants({
						variant: 'link',
						size: 'icon',
						className:
							'!m-0 !p-1 opacity-0 group-hover/collapsible:opacity-100',
					})}
				>
					<MoreHorizontal className="size-4" />
				</div>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="flex flex-col"
				align="start"
				side="right"
				onClick={(e) => {
					e.stopPropagation();
				}}
			>
				{type === 'collection' && (
					<>
						<DropdownMenuItem
							onClick={(e) => {
								e.stopPropagation();
							}}
							className="group hover:!bg-secondary/60 text-foreground/80 hover:!text-foreground/80 text-xs cursor-pointer"
						>
							<IconWebSocket className="size-3" />
							Add New Websocket
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={(e) => {
								e.stopPropagation();
							}}
							className="group hover:!bg-secondary/60 text-foreground/80 hover:!text-foreground/80 text-xs cursor-pointer"
						>
							<Code2 className="size-3 text-primary" />
							Add New Request
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={(e) => {
								e.stopPropagation();
							}}
							className="group hover:!bg-secondary/60 text-foreground/80 hover:!text-foreground/80 text-xs cursor-pointer"
						>
							<IconSocketIO className="size-3 text-green-600" />
							Add New SocketIO
						</DropdownMenuItem>
					</>
				)}
				<DropdownMenuItem
					onClick={(e) => {
						e.stopPropagation();
					}}
					className="group hover:!bg-secondary/60 text-foreground/80 hover:!text-foreground/80 text-xs cursor-pointer"
				>
					<PencilIcon className="size-3" />
					Rename
				</DropdownMenuItem>{' '}
				<DropdownMenuItem
					onClick={(e) => {
						e.stopPropagation();
					}}
					className="group hover:!bg-secondary/60 text-foreground/80 hover:!text-red-400 text-xs cursor-pointer"
				>
					<Trash className="size-3 !text-inherit group-hover:text-red-400" />{' '}
					Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
