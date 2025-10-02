'use client';

import React from 'react';
import { IconBrandSocketIo } from '@tabler/icons-react';
import { Tabs } from '@/components/ui/tabs';
import TabBar from '@/modules/requests/components/tab-bar';
import TabContent from '@/modules/requests/components/tab-content';
import useRequestTabsStore from '@/modules/requests/store/tabs.store';

const Page = () => {
	const { activeTab, setActiveTabById, tabs } = useRequestTabsStore();
	return (
		<Tabs value={activeTab?.id || tabs[0]?.id} className="w-full h-full">
			<TabBar />
			<TabContent id={activeTab?.id || tabs[0]?.id} />
			{tabs.length <= 0 && (
				<div className="flex flex-1 justify-center items-center select-none">
					<div className="flex items-center gap-2 opacity-25 font-medium scale-150">
						<div className="flex justify-center items-center bg-primary rounded-md size-6 text-primary-foreground">
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
