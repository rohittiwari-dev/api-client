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
import { NestedCollection } from '@/modules/requests/types/store.types';
import useSidebarStore from '../../store/sidebar.store';
import AddNewCollection from './AddNewCollection';

export function AppSidebar({
	collections,
	...props
}: React.ComponentProps<typeof Sidebar> & { collections: NestedCollection[] }) {
	const { items, setItems } = useSidebarStore();

	React.useEffect(() => {
		const tree = collections.map((collection) => {
			const mapCollection = (col: NestedCollection): any => {
				const collectionNode = {
					name: col.name,
					type: 'COLLECTION' as const,
					id: col.id,
				};
				const items: any[] = [];
				if (col.requests && col.requests.length > 0) {
					col.requests.forEach((request) => {
						items.push({
							name: request.name,
							type: request.type,
							method: request.method,
							id: request.id,
							path: request.url,
						});
					});
				}
				if (col.children && col.children.length > 0) {
					col.children.forEach((child) => {
						items.push(mapCollection(child));
					});
				}
				if (items.length > 0) {
					return [collectionNode, ...items];
				}
				return collectionNode;
			};

			return mapCollection(collection);
		});
		console.log('TREE', tree);
		setItems(tree);
	}, [setItems]);

	return (
		<Sidebar
			className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
			{...props}
		>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel className="flex justify-between items-center gap-2 !pr-0 w-full font-medium text-muted-foreground text-sm">
						<span className="flex-1">Collections</span>
						<AddNewCollectionOption />
					</SidebarGroupLabel>
					<SidebarGroupContent className="mt-2">
						<SidebarMenu>
							{items.map((item, index) => (
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

	if (!items.length && file.type !== 'COLLECTION') {
		return (
			<SidebarMenuButton
				isActive={activeTab?.id === file.id}
				className="group/item-collapsible data-[active=true]:bg-transparent !m-0 !p-0 !pl-3 !border-none !h-fit cursor-pointer select-none"
			>
				<div className="flex flex-col flex-1 !py-2">
					<span className="flex items-center gap-1">
						<span
							className={cn(
								'flex items-center mt-1 font-black text-[0.6rem] text-muted-foreground text-center align-middle',
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
						<span className="text-muted-foreground text-xs truncate">
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
				className="w-full [&[data-state=open]>button>svg:first-child]:rotate-90 select-none"
				defaultOpen={file.id === activeTab?.collectionId}
			>
				<CollapsibleTrigger
					asChild
					className="!m-0 !p-0 cursor-pointer"
				>
					<SidebarMenuButton className="group/collapsible !pl-2">
						<ChevronRight className="transition-transform" />
						<Folder />
						<span className="flex-1">{file.name}</span>
						<TreeItemOption
							type={'COLLECTION'}
							optionId={file.id}
						/>
					</SidebarMenuButton>
				</CollapsibleTrigger>
				<CollapsibleContent className="w-full">
					<SidebarMenuSub className="pr-4 w-full">
						{!items.length && (
							<div className="flex flex-col border border-dashed text-muted-foreground text-xs">
								<p className="p-2 text-center">
									No Items Found
								</p>
								<TreeItemOption
									label="Add New Item"
									variant="item-drop"
									type={'COLLECTION'}
									optionId={file.id}
								/>
							</div>
						)}
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
	label,
	variant = 'item-collapsible',
}: {
	type?: 'COLLECTION' | RequestType;
	optionId?: string;
	label?: string;
	variant?: 'item-drop' | 'item-collapsible';
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
							'opacity-0 group-hover/item-collapsible:opacity-100 !m-0 !p-1 cursor-pointer',
							type === 'COLLECTION' &&
								'group-hover/collapsible:opacity-100',
							variant === 'item-drop' &&
								'mt-2 flex w-full flex-1 items-center justify-center border-t pt-2 opacity-100',
						),
					})}
				>
					{variant === 'item-collapsible' && (
						<MoreVertical className="size-4" />
					)}
					{label}
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
							className="group hover:!bg-muted dark:hover:!bg-secondary/60 text-foreground/80 hover:!text-primary dark:hover:!text-indigo-400 text-xs cursor-pointer"
							asChild
						>
							<AddNewCollection parentID={optionId} />
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={(e) => {
								e.stopPropagation();
							}}
							className="group hover:!bg-muted dark:hover:!bg-secondary/60 text-foreground/80 hover:!text-primary dark:hover:!text-indigo-400 text-xs cursor-pointer"
						>
							<IconWebSocket className="size-3" />
							Add New Websocket
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={(e) => {
								e.stopPropagation();
							}}
							className="group hover:!bg-muted dark:hover:!bg-secondary/60 text-foreground/80 hover:!text-primary dark:hover:!text-indigo-400 text-xs cursor-pointer"
						>
							<Code2 className="size-3 text-primary" />
							Add New Request
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={(e) => {
								e.stopPropagation();
							}}
							className="group hover:!bg-muted dark:hover:!bg-secondary/60 text-foreground/80 hover:!text-primary dark:hover:!text-indigo-400 text-xs cursor-pointer"
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
					className="group hover:!bg-muted dark:hover:!bg-secondary/60 text-foreground/80 hover:!text-primary dark:hover:!text-indigo-400 text-xs cursor-pointer"
				>
					<PencilIcon className="size-3" />
					Rename
				</DropdownMenuItem>{' '}
				<DropdownMenuItem
					onClick={(e) => {
						e.stopPropagation();
					}}
					className="group hover:!bg-muted dark:hover:!bg-secondary/60 text-foreground/80 hover:!text-red-400 text-xs cursor-pointer"
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
					className="!m-0 !p-1 cursor-pointer"
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
					className="group justify-center items-center hover:!bg-muted dark:hover:!bg-secondary/60 text-foreground/80 hover:!text-primary dark:hover:!text-indigo-400 text-xs cursor-pointer"
					asChild
				>
					<AddNewCollection />
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={(e) => {
						e.stopPropagation();
					}}
					className="group hover:!bg-muted dark:hover:!bg-secondary/60 text-foreground/80 hover:!text-primary dark:hover:!text-indigo-400 text-xs cursor-pointer"
				>
					<IconWebSocket className="size-3" />
					Add New Websocket
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={(e) => {
						e.stopPropagation();
					}}
					className="group hover:!bg-muted dark:hover:!bg-secondary/60 text-foreground/80 hover:!text-primary dark:hover:!text-indigo-400 text-xs cursor-pointer"
				>
					<Code2 className="size-3 text-primary" />
					Add New Request
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={(e) => {
						e.stopPropagation();
					}}
					className="group hover:!bg-muted dark:hover:!bg-secondary/60 text-foreground/80 hover:!text-primary dark:hover:!text-indigo-400 text-xs cursor-pointer"
				>
					<IconSocketIO className="size-3 text-green-600" />
					Add New SocketIO
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
