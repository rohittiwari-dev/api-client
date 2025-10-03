import React from 'react';
import { createId } from '@paralleldrive/cuid2';
import { Code2 } from 'lucide-react';
import { IconSocketIO, IconWebSocket } from '@/assets/app-icons';
import useRequestTabsStore from '../store/tabs.store';

const NewRequestTabContent = () => {
	const { replaceTabData, activeTab } = useRequestTabsStore();
	return (
		<div className="flex justify-around items-center gap-4 w-[400px] h-full text-muted-foreground text-sm">
			<button
				onClick={() => {
					replaceTabData(activeTab?.id || '', {
						id: createId() || '',
						title: 'New Request',
						type: 'API',
						method: 'GET',
						isSaved: false,
					});
				}}
				className="group flex flex-col justify-center items-center gap-2 bg-card/50 p-3 rounded-md ring-primary/20 hover:ring-1 font-medium text-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer"
			>
				<div className="flex justify-center items-center bg-accent/30 group-hover:opacity-80 rounded-md !w-[130px] !h-[100px] text-primary transition-all duration-300">
					<Code2 className="opacity-60 group-hover:opacity-100 size-12 transition-all duration-300" />
				</div>
				<span className="bg-accent/30 group-hover:opacity-80 p-2 rounded-md w-full h-[40px] group-hover:text-primary text-sm text-center transition-all duration-300">
					New Request
				</span>
			</button>
			<button
				onClick={() => {
					replaceTabData(activeTab?.id || '', {
						id: createId() || '',
						title: 'New Request',
						type: 'WEBSOCKET',
						isSaved: false,
					});
				}}
				className="group flex flex-col justify-center items-center gap-2 bg-card/50 p-3 rounded-md ring-primary/20 hover:ring-1 font-medium text-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer"
			>
				<div className="flex justify-center items-center bg-accent/30 group-hover:opacity-80 rounded-md !w-[130px] !h-[100px] text-primary transition-all duration-300">
					<IconWebSocket className="opacity-60 group-hover:opacity-100 size-12 transition-all duration-300" />
				</div>
				<span className="bg-accent/30 group-hover:opacity-80 p-2 rounded-md w-full h-[40px] group-hover:text-primary text-sm text-center transition-all duration-300">
					Websocket
				</span>
			</button>
			<button
				onClick={() => {
					replaceTabData(activeTab?.id || '', {
						id: createId() || '',
						title: 'New Request',
						type: 'SOCKET_IO',
						isSaved: false,
					});
				}}
				className="group flex flex-col justify-center items-center gap-2 bg-card/50 p-3 rounded-md ring-primary/20 hover:ring-1 font-medium text-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer"
			>
				<div className="flex justify-center items-center bg-accent/30 group-hover:opacity-80 rounded-md !w-[130px] !h-[100px] text-primary transition-all duration-300">
					<IconSocketIO className="opacity-60 group-hover:opacity-100 size-12 transition-all duration-300" />
				</div>
				<span className="bg-accent/30 group-hover:opacity-80 p-2 rounded-md w-full h-[40px] group-hover:text-primary text-sm text-center transition-all duration-300">
					Socket Io
				</span>
			</button>
		</div>
	);
};

export default NewRequestTabContent;
