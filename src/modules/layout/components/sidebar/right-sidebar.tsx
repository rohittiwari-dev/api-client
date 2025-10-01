import React from 'react';
import { IconLayoutBoardFilled } from '@tabler/icons-react';
import { Code2, Layout } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import {
	Sidebar,
	SidebarContent,
	SidebarMenuButton,
} from '@/components/ui/sidebar';

const RightSidebar = () => {
	return (
		<Sidebar
			side="right"
			collapsible="none"
			className="top-(--header-height) h-[calc(100svh-var(--header-height))]! w-[3.5rem]"
		>
			<SidebarContent className="flex flex-col items-center gap-2 py-2">
				<SidebarMenuButton
					className={buttonVariants({
						variant: 'ghost',
						size: 'icon',
						className: 'cursor-pointer',
					})}
				>
					<IconLayoutBoardFilled />
				</SidebarMenuButton>
				<SidebarMenuButton
					className={buttonVariants({
						variant: 'ghost',
						size: 'icon',
						className: 'cursor-pointer',
					})}
				>
					<Code2 />
				</SidebarMenuButton>
				<SidebarMenuButton
					className={buttonVariants({
						variant: 'ghost',
						size: 'icon',
						className: 'cursor-pointer',
					})}
				>
					<Code2 />
				</SidebarMenuButton>
			</SidebarContent>
		</Sidebar>
	);
};

export default RightSidebar;
