import * as React from 'react';
import { ChevronRight, EllipsisIcon, File, Folder, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuBadge,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarRail,
} from '@/components/ui/sidebar';

// This is sample data.
const data = {
	tree: [
		[
			'app',
			[
				'api',
				['hello', ['route.ts']],
				'page.tsx',
				'layout.tsx',
				['blog', ['page.tsx']],
			],
		],
		[
			'components',
			['ui', 'button.tsx', 'card.tsx'],
			'header.tsx',
			'footer.tsx',
		],
		['lib', ['util.ts']],
		['public', 'favicon.ico', 'vercel.svg'],
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
	const [name, ...items] = Array.isArray(item) ? item : [item];

	if (!items.length) {
		return (
			<SidebarMenuButton
				isActive={name === 'button.tsx'}
				className="data-[active=true]:bg-transparent"
			>
				<File />
				<span className="flex-1">{name}</span>
				<EllipsisIcon className="!size-3" />
			</SidebarMenuButton>
		);
	}

	return (
		<SidebarMenuItem>
			<Collapsible
				className="group/collapsible w-full [&[data-state=open]>button>svg:first-child]:rotate-90"
				defaultOpen={name === 'components' || name === 'ui'}
			>
				<CollapsibleTrigger asChild>
					<SidebarMenuButton>
						<ChevronRight className="transition-transform" />
						<Folder />
						<span className="flex-1">{name}</span>
						<EllipsisIcon className="!size-3" />
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
