'use client';

import React from 'react';
import { IconBrandSocketIo } from '@tabler/icons-react';
import { Tabs } from '@/components/ui/tabs';
import TabBar from '@/modules/requests/components/tab-bar';
import TabContent from '@/modules/requests/components/tab-content';
import useRequestTabsStore from '@/modules/requests/store';

const Page = () => {
	const { activeTab, setActiveTabById, tabs } = useRequestTabsStore();
	return (
		<Tabs value={activeTab?.id || tabs[0]?.id} className="h-full w-full">
			<TabBar />
			<TabContent id={activeTab?.id || tabs[0]?.id} />
			{tabs.length <= 0 && (
				<div className="flex flex-1 items-center justify-center select-none">
					<div className="flex scale-150 items-center gap-2 font-medium opacity-25">
						<div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
							<IconBrandSocketIo className="size-4" />
						</div>
						ApiClient
					</div>
				</div>
			)}
		</Tabs>
	);
};

export default Page;
