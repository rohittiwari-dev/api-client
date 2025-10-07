'use client';

import * as React from 'react';
import { createId } from '@paralleldrive/cuid2';
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
import DeleteCollection from '@/modules/collections/components/delete-collection';
import RenameCollection from '@/modules/collections/components/RenameCollection';
import { useCollections } from '@/modules/collections/hooks/queries';
import { NestedCollection } from '@/modules/collections/types/sidebar.types';
import { RequestIcon } from '@/modules/requests/components/RequestType';
import useRequestStore from '@/modules/requests/store/request.store';
import useRequestTabsStore from '@/modules/requests/store/tabs.store';
import { extractRequestFromNestedCollection } from '@/modules/requests/utils';
import useWorkspaceState from '@/modules/workspace/store';
import AddNewCollection from '../../../collections/components/AddNewCollection';
import useSidebarStore from '../../store/sidebar.store';

export function AppSidebar({
	collections,
	...props
}: React.ComponentProps<typeof Sidebar> & { collections: NestedCollection[] }) {
	const { items, setItems } = useSidebarStore();
	const { activeWorkspace } = useWorkspaceState();
	const { data: collectionsData } = useCollections(
		activeWorkspace?.id!,
		collections,
	);

	React.useEffect(() => {
		const tree = collectionsData?.map((collection) => {
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

		setItems(tree);
	}, [setItems, collectionsData]);

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
							{items?.map((item, index) => (
								<Tree
									key={index}
									item={item}
									collectionsData={collectionsData}
								/>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	);
}

function Tree({
	item,
	collectionsData,
}: {
	item: string | any[];
	collectionsData?: NestedCollection[];
}) {
	const { activeTab, addTab } = useRequestTabsStore();
	const { addRequest } = useRequestStore();
	const [file, ...items] = Array.isArray(item) ? item : [item];
	const { activeWorkspace } = useWorkspaceState();
	const { data: collections } = useCollections(
		activeWorkspace?.id!,
		collectionsData,
	);

	if (!items.length && file.type !== 'COLLECTION') {
		return (
			<SidebarMenuButton
				isActive={activeTab?.id === file.id}
				onClick={() => {
					const requestFromCollectionList =
						extractRequestFromNestedCollection(
							file.id,
							collections,
						);

					if (!requestFromCollectionList) {
						return;
					}

					addTab({
						...requestFromCollectionList,
						isSaved: true,
						title: requestFromCollectionList.name,
						type: requestFromCollectionList.type || 'NEW',
					});
					addRequest({
						...requestFromCollectionList,
						isSaved: true,
						body: (requestFromCollectionList.body || {
							raw: '',
							formData: [],
							urlEncoded: [],
							file: null,
							json: {},
						}) as any,
						auth: (requestFromCollectionList.auth || {
							type: 'NONE',
						}) as any,
						headers: (requestFromCollectionList.headers ||
							[]) as any,
						parameters: (requestFromCollectionList.parameters ||
							[]) as any,
					});
				}}
				className="group/item-collapsible !m-0 !h-fit cursor-pointer !border-none !p-0 !pl-3 select-none data-[active=true]:bg-transparent"
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
					<SidebarMenuSub className="w-full pr-4">
						{!items.length && (
							<div className="text-muted-foreground flex flex-col border border-dashed text-xs">
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
	const { addTab } = useRequestTabsStore();
	const { addRequest } = useRequestStore();

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
							'!m-0 cursor-pointer !p-1 opacity-0 group-hover/item-collapsible:opacity-100',
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
				<DropdownMenuItem
					onClick={(e) => {
						e.stopPropagation();
					}}
					asChild
					className="group hover:!bg-muted dark:hover:!bg-secondary/60 text-foreground/80 hover:!text-primary cursor-pointer text-xs dark:hover:!text-indigo-400"
				>
					{type === 'COLLECTION' && (
						<RenameCollection id={optionId!} />
					)}
				</DropdownMenuItem>
				<DropdownMenuItem
					asChild
					className="group hover:!bg-muted dark:hover:!bg-secondary/60 text-foreground/80 cursor-pointer text-xs hover:!text-red-400"
				>
					{type === 'COLLECTION' && (
						<DeleteCollection id={optionId!} />
					)}
				</DropdownMenuItem>
				{type === 'COLLECTION' && (
					<>
						<DropdownMenuItem
							onClick={(e) => {
								e.stopPropagation();
								const id = createId();
								addTab({
									type: 'WEBSOCKET',
									title: 'New Request',
									isSaved: false,
									collectionId: undefined,
									id,
								});
								addRequest({
									id,
									type: 'WEBSOCKET',
									name: 'New Request',
									url: '',
									method: null,
									isSaved: false,
									collectionId: optionId,
									body: {
										raw: '',
										formData: [],
										urlEncoded: [],
										file: null,
										json: {},
									},
									auth: { type: 'NONE' },
									headers: [],
									parameters: [],
									bodyType: 'NONE',
									description: '',
									messageType: 'CONNECTION',
									createdAt: new Date(),
									updatedAt: new Date(),
								});
							}}
							className="group hover:!bg-muted dark:hover:!bg-secondary/60 text-foreground/80 hover:!text-primary cursor-pointer text-xs dark:hover:!text-indigo-400"
						>
							<Code2 className="text-primary size-3" />
							Add New Request
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={(e) => {
								e.stopPropagation();
								const id = createId();
								addTab({
									type: 'WEBSOCKET',
									title: 'New Request',
									isSaved: false,
									collectionId: undefined,
									id,
								});
								addRequest({
									id,
									type: 'WEBSOCKET',
									name: 'New Request',
									url: '',
									method: null,
									isSaved: false,
									collectionId: optionId,
									body: {
										raw: '',
										formData: [],
										urlEncoded: [],
										file: null,
										json: {},
									},
									auth: { type: 'NONE' },
									headers: [],
									parameters: [],
									bodyType: 'NONE',
									description: '',
									messageType: 'CONNECTION',
									createdAt: new Date(),
									updatedAt: new Date(),
								});
							}}
							className="group hover:!bg-muted dark:hover:!bg-secondary/60 text-foreground/80 hover:!text-primary cursor-pointer text-xs dark:hover:!text-indigo-400"
						>
							<IconWebSocket className="size-3" />
							Add New Websocket
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={(e) => {
								e.stopPropagation();
								const id = createId();
								addTab({
									type: 'SOCKET_IO',
									title: 'New Request',
									isSaved: false,
									collectionId: undefined,
									id,
								});
								addRequest({
									id,
									type: 'SOCKET_IO',
									name: 'New Request',
									url: '',
									method: null,
									isSaved: false,
									collectionId: optionId,
									body: {
										raw: '',
										formData: [],
										urlEncoded: [],
										file: null,
										json: {},
									},
									auth: { type: 'NONE' },
									headers: [],
									parameters: [],
									bodyType: 'NONE',
									description: '',
									messageType: 'CONNECTION',
									createdAt: new Date(),
									updatedAt: new Date(),
								});
							}}
							className="group hover:!bg-muted dark:hover:!bg-secondary/60 text-foreground/80 hover:!text-primary cursor-pointer text-xs dark:hover:!text-indigo-400"
						>
							<IconSocketIO className="size-3 text-green-600" />
							Add New SocketIO
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={(e) => {
								e.stopPropagation();
							}}
							className="group hover:!bg-muted dark:hover:!bg-secondary/60 text-foreground/80 hover:!text-primary cursor-pointer text-xs dark:hover:!text-indigo-400"
							asChild
						>
							<AddNewCollection parentID={optionId} />
						</DropdownMenuItem>
					</>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

const AddNewCollectionOption = () => {
	const { addTab } = useRequestTabsStore();
	const { addRequest } = useRequestStore();

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
						const id = createId();
						e.stopPropagation();
						addTab({
							type: 'API',
							title: 'New Request',
							isSaved: false,
							collectionId: undefined,
							id,
						});
						addRequest({
							id,
							type: 'API',
							name: 'New Request',
							url: '',
							method: 'GET',
							isSaved: false,
							collectionId: '',
							body: {
								raw: '',
								formData: [],
								urlEncoded: [],
								file: null,
								json: {},
							},
							auth: { type: 'NONE' },
							headers: [],
							parameters: [],
							bodyType: 'NONE',
							description: '',
							messageType: 'CONNECTION',
							createdAt: new Date(),
							updatedAt: new Date(),
						});
					}}
					className="group hover:!bg-muted dark:hover:!bg-secondary/60 text-foreground/80 hover:!text-primary cursor-pointer text-xs dark:hover:!text-indigo-400"
				>
					<Code2 className="text-primary size-3" />
					Add New Request
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={(e) => {
						e.stopPropagation();
						const id = createId();
						addTab({
							type: 'WEBSOCKET',
							title: 'New Request',
							isSaved: false,
							collectionId: undefined,
							id,
						});
						addRequest({
							id,
							type: 'WEBSOCKET',
							name: 'New Request',
							url: '',
							method: null,
							isSaved: false,
							collectionId: '',
							body: {
								raw: '',
								formData: [],
								urlEncoded: [],
								file: null,
								json: {},
							},
							auth: { type: 'NONE' },
							headers: [],
							parameters: [],
							bodyType: 'NONE',
							description: '',
							messageType: 'CONNECTION',
							createdAt: new Date(),
							updatedAt: new Date(),
						});
					}}
					className="group hover:!bg-muted dark:hover:!bg-secondary/60 text-foreground/80 hover:!text-primary cursor-pointer text-xs dark:hover:!text-indigo-400"
				>
					<IconWebSocket className="size-3" />
					Add New Websocket
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={(e) => {
						e.stopPropagation();
						const id = createId();
						addTab({
							type: 'SOCKET_IO',
							title: 'New Request',
							isSaved: false,
							collectionId: undefined,
							id,
						});
						addRequest({
							id,
							type: 'SOCKET_IO',
							name: 'New Request',
							url: '',
							method: null,
							isSaved: false,
							collectionId: '',
							body: {
								raw: '',
								formData: [],
								urlEncoded: [],
								file: null,
								json: {},
							},
							auth: { type: 'NONE' },
							headers: [],
							parameters: [],
							bodyType: 'NONE',
							description: '',
							messageType: 'CONNECTION',
							createdAt: new Date(),
							updatedAt: new Date(),
						});
					}}
					className="group hover:!bg-muted dark:hover:!bg-secondary/60 text-foreground/80 hover:!text-primary cursor-pointer text-xs dark:hover:!text-indigo-400"
				>
					<IconSocketIO className="size-3 text-green-600" />
					Add New SocketIO
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={(e) => {
						e.stopPropagation();
					}}
					className="group hover:!bg-muted dark:hover:!bg-secondary/60 text-foreground/80 hover:!text-primary cursor-pointer items-center justify-center text-xs dark:hover:!text-indigo-400"
					asChild
				>
					<AddNewCollection />
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
