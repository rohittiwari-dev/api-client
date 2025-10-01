'use client';

import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import useRequestTabsStore from '../store';

const TabContent = ({ id }: { id: string }) => {
	const { tabs } = useRequestTabsStore();
	return (
		<TabsContent value={id}>
			{tabs.length <= 0 && (
				<div className="flex h-[400px] w-full items-center justify-center border">
					No Requests
				</div>
			)}
		</TabsContent>
	);
};

export default TabContent;
