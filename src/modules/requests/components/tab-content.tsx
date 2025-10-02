'use client';

import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import useRequestTabsStore from '../store/tabs.store';
import NewRequestTabContent from './new-request-tab';

const TabContent = ({ id }: { id: string }) => {
	const { activeTab } = useRequestTabsStore();
	return (
		<TabsContent
			value={id}
			className="flex justify-center items-center p-0 w-full h-full overflow-hidden"
		>
			{activeTab?.type === 'new' && <NewRequestTabContent />}
		</TabsContent>
	);
};

export default TabContent;
