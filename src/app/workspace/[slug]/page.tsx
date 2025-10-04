'use client';

import React from 'react';
import Image from 'next/image';
import { IconBrandSocketIo } from '@tabler/icons-react';
import { Tabs } from '@/components/ui/tabs';
import TabBar from '@/modules/requests/components/tab-bar';
import TabContent from '@/modules/requests/components/tab-content';
import useRequestTabsStore from '@/modules/requests/store/tabs.store';

const Page = () => {
	const { activeTab, setActiveTabById, tabs } = useRequestTabsStore();
	return (
		<Tabs value={activeTab?.id || tabs[0]?.id} className="h-full w-full">
			<TabBar />
			<TabContent id={activeTab?.id || tabs[0]?.id} />
			{tabs.length <= 0 && (
				<div className="flex flex-1 items-center justify-center select-none">
					<div className="flex items-center gap-2 font-medium opacity-25">
						<Image
							src="/logo.png"
							alt="ApiClient"
							width={100}
							height={100}
							priority
							className="h-[160px] w-[170px]"
						/>
					</div>
				</div>
			)}
		</Tabs>
	);
};

export default Page;
