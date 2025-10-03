import React from 'react';
import {
	IconCode,
	IconCookie,
	IconLayoutBoardFilled,
	IconPackage,
} from '@tabler/icons-react';
import { buttonVariants } from '@/components/ui/button';
import {
	Sidebar,
	SidebarContent,
	SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';

const menuData = [
	{
		id: 'request',
		icon: IconLayoutBoardFilled,
		tooltip: 'Request',
	},
	{
		id: 'environment',
		icon: IconPackage,
		tooltip: 'Environment',
	},
	{
		id: 'code',
		icon: IconCode,
		tooltip: 'Code',
	},
	{
		id: 'cookies',
		icon: IconCookie,
		tooltip: 'Cookies',
	},
];

const RightSidebar = () => {
	return (
		<Sidebar
			side="right"
			collapsible="none"
			className="top-(--header-height) h-[calc(100svh-var(--header-height))]! !w-[3.5rem]"
		>
			<SidebarContent className="flex flex-col items-center gap-2 py-2">
				{menuData.map((item) => (
					<SidebarMenuButton
						asChild
						key={item.id + item.tooltip}
						value={item.id}
					>
						<Tooltip>
							<TooltipTrigger
								className={buttonVariants({
									variant: 'ghost',
									size: 'icon',
									className: 'cursor-pointer',
								})}
							>
								<item.icon />
							</TooltipTrigger>
							<TooltipContent
								side="left"
								className="font-semibold !text-[0.66rem]"
							>
								{item.tooltip}
							</TooltipContent>
						</Tooltip>
					</SidebarMenuButton>
				))}
			</SidebarContent>
		</Sidebar>
	);
};

export default RightSidebar;
