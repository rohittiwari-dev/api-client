'use client';

import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import useRequestTabsStore from '../store/tabs.store';
import ApiRequestComponent from './ApiRequestComponent';
import NewRequestTabContent from './new-request-tab';
import SocketIORequestComponent from './SocketIORequestComponent';
import WebsocketRequestComponent from './WebsocketRequestComponent';

const TabContent = ({ id }: { id: string }) => {
	const { activeTab } = useRequestTabsStore();
	return (
		<TabsContent
			value={id}
			className="flex-1 flex h-full w-full !bg-background items-center justify-center overflow-hidden p-0"
		>
			{activeTab?.type === 'NEW' && <NewRequestTabContent />}
			{activeTab?.type === 'API' && <ApiRequestComponent />}
			{activeTab?.type === 'SOCKET_IO' && <SocketIORequestComponent />}
			{activeTab?.type === 'WEBSOCKET' && <WebsocketRequestComponent />}
		</TabsContent>
	);
};

export default TabContent;
