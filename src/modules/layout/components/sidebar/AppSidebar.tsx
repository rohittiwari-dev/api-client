'use client';

import * as React from 'react';
import {
	ChevronRight,
	Code2,
	File,
	Folder,
	MoreHorizontal,
	MoreVertical,
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
import { RequestType } from '@/generated/prisma';
import { cn, requestTextColorMap } from '@/lib/utils';
import { RequestIcon } from '@/modules/requests/components/RequestType';
import useRequestTabsStore from '@/modules/requests/store/tabs.store';

// This is sample data.
const data = {
	tree: [
		[
			{ name: 'app', type: 'COLLECTION', id: 'dsalfjsdoahfo' },
			[
				{ name: 'api', type: 'COLLECTION', id: 'dsalfjsdoahfo' },
				[
					{ name: 'hello', type: 'COLLECTION', id: 'dsalfjsdoahfo' },
					[
						{
							name: 'route',
							type: 'API',
							method: 'GET',
							id: 'dsalfjsdoahfo',
						},
					],
				],
				{
					name: 'page',
					type: 'API',
					method: 'POST',
					id: 'dsalfjsdoahfo',
				},
				{
					name: 'layout',
					type: 'API',
					method: 'PUT',
					id: 'dsalfjsdoahfo',
				},
				[
					{ name: 'blog', type: 'COLLECTION', id: 'dsalfjsdoahfo' },
					[
						{
							name: 'page',
							type: 'websocket',
							id: 'dsalfjsdoahfo',
						},
					],
				],
			],
		],
		[
			{ name: 'components', type: 'COLLECTION', id: 'dsalfjsdoahfo' },
			[
				{ name: 'components', type: 'COLLECTION', id: 'dsalfjsdoahfo' },
				{
					name: 'button',
					type: 'API',
					method: 'GET',
					id: 'dsalfjsdoahfo',
				},
				{
					name: 'card',
					type: 'API',
					method: 'DELETE',
					id: 'dsalfjsdoahfo',
				},
			],
			{
				name: 'layout',
				type: 'API',
				method: 'PUT',
				id: 'dsalfjsdoahfo',
			},
			{
				name: 'header',
				type: 'API',
				method: 'PUT',
				id: 'dsalfjsdoahfo',
			},
		],
		[
			{ name: 'lib', type: 'COLLECTION', id: 'dsalfjsdoahfo' },
			[{ name: 'utils', type: 'WEBSOCKET', id: 'dsalfjsdoahfo' }],
		],
		[
			{ name: 'public', type: 'COLLECTION', id: 'dsalfjsdoahfo' },
			{ name: 'favicon', type: 'SOCKET_IO', id: 'dsalfjsdoahfo' },
			{ name: 'vercel', type: 'WEBSOCKET', id: 'dsalfjsdoahfo' },
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
					<SidebarGroupLabel className="text-muted-foreground flex w-full items-center justify-between gap-2 !pr-0 text-sm font-medium">
						<span className="flex-1">Collections</span>
						<AddNewCollectionOption />
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
				className="group/item-collapsible !m-0 !h-fit cursor-pointer !p-0 !pl-3 select-none data-[active=true]:bg-transparent"
			>
				<div className="flex flex-1 flex-col !py-2">
					<span className="flex items-center gap-1">
						<span
							className={cn(
								'text-muted-foreground mt-1 flex items-center text-center align-middle text-[0.6rem] font-black',
								(requestTextColorMap as any)[
									file.method || 'GET'
								],
							)}
						>
							{file.type !== 'NEW' &&
								(file.type === 'API' ? (
									file.method
								) : (
									<RequestIcon
										type={file.type}
										className="size-4"
									/>
								))}
						</span>
						{file.name}
					</span>
					{file.path && (
						<span className="text-muted-foreground truncate text-xs">
							{file.path}
						</span>
					)}
				</div>
				<TreeItemOption type={file.type} optionId={file.id} />
			</SidebarMenuButton>
		);
	}

	return (
		<SidebarMenuItem>
			<Collapsible
				className="w-full select-none [&[data-state=open]>button>svg:first-child]:rotate-90"
				defaultOpen={file.id === activeTab?.collectionId}
			>
				<CollapsibleTrigger
					asChild
					className="!m-0 cursor-pointer !p-0"
				>
					<SidebarMenuButton asChild>
						<div className="group/collapsible !pl-2">
							<ChevronRight className="transition-transform" />
							<Folder />
							<span className="flex-1">{file.name}</span>
							<TreeItemOption
								type={'COLLECTION'}
								optionId={file.id}
							/>
						</div>
					</SidebarMenuButton>
				</CollapsibleTrigger>
				<CollapsibleContent className="w-full">
					<SidebarMenuSub className="w-full pr-4">
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
	type?: 'COLLECTION' | RequestType;
	optionId?: string;
}) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				asChild
				onClick={(e) => {
					e.stopPropagation();
				}}
				className="!m-0 !p-0 select-none"
			>
				<div
					onClick={(e) => {
						e.stopPropagation();
					}}
					className={buttonVariants({
						variant: 'link',
						size: 'icon',
						className: cn(
							'!m-0 !p-1 opacity-0 group-hover/item-collapsible:opacity-100',
							type === 'COLLECTION' &&
								'group-hover/collapsible:opacity-100',
						),
					})}
				>
					<MoreVertical className="size-4" />
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
				{type === 'COLLECTION' && (
					<>
						<DropdownMenuItem
							onClick={(e) => {
								e.stopPropagation();
							}}
							className="group hover:!bg-muted dark:hover:!bg-secondary/60 text-foreground/80 hover:!text-primary cursor-pointer text-xs dark:hover:!text-indigo-400"
						>
							<IconWebSocket className="size-3" />
							Add New Websocket
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={(e) => {
								e.stopPropagation();
							}}
							className="group hover:!bg-muted dark:hover:!bg-secondary/60 text-foreground/80 hover:!text-primary cursor-pointer text-xs dark:hover:!text-indigo-400"
						>
							<Code2 className="text-primary size-3" />
							Add New Request
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={(e) => {
								e.stopPropagation();
							}}
							className="group hover:!bg-muted dark:hover:!bg-secondary/60 text-foreground/80 hover:!text-primary cursor-pointer text-xs dark:hover:!text-indigo-400"
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
					className="group hover:!bg-muted dark:hover:!bg-secondary/60 text-foreground/80 hover:!text-primary cursor-pointer text-xs dark:hover:!text-indigo-400"
				>
					<PencilIcon className="size-3" />
					Rename
				</DropdownMenuItem>{' '}
				<DropdownMenuItem
					onClick={(e) => {
						e.stopPropagation();
					}}
					className="group hover:!bg-muted dark:hover:!bg-secondary/60 text-foreground/80 cursor-pointer text-xs hover:!text-red-400"
				>
					<Trash className="size-3 !text-inherit group-hover:text-red-400" />{' '}
					Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

const AddNewCollectionOption = () => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				asChild
				onClick={(e) => {
					e.stopPropagation();
				}}
				className="select-none"
			>
				<Button
					onClick={(e) => {
						e.stopPropagation();
					}}
					size={'icon'}
					variant={'ghost'}
					className="!m-0 cursor-pointer !p-1"
				>
					<Plus className="size-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="flex flex-col"
				align="start"
				side="right"
				onClick={(e) => {
					e.stopPropagation();
				}}
			>
				<DropdownMenuItem
					onClick={(e) => {
						e.stopPropagation();
					}}
					className="group hover:!bg-muted dark:hover:!bg-secondary/60 text-foreground/80 hover:!text-primary cursor-pointer text-xs dark:hover:!text-indigo-400"
				>
					<Folder className="size-3" />
					Add New Collection
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={(e) => {
						e.stopPropagation();
					}}
					className="group hover:!bg-muted dark:hover:!bg-secondary/60 text-foreground/80 hover:!text-primary cursor-pointer text-xs dark:hover:!text-indigo-400"
				>
					<IconWebSocket className="size-3" />
					Add New Websocket
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={(e) => {
						e.stopPropagation();
					}}
					className="group hover:!bg-muted dark:hover:!bg-secondary/60 text-foreground/80 hover:!text-primary cursor-pointer text-xs dark:hover:!text-indigo-400"
				>
					<Code2 className="text-primary size-3" />
					Add New Request
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={(e) => {
						e.stopPropagation();
					}}
					className="group hover:!bg-muted dark:hover:!bg-secondary/60 text-foreground/80 hover:!text-primary cursor-pointer text-xs dark:hover:!text-indigo-400"
				>
					<IconSocketIO className="size-3 text-green-600" />
					Add New SocketIO
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
