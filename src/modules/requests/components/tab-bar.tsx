'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createId } from '@paralleldrive/cuid2';
import { MoreHorizontal, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BodyType } from '@/generated/prisma';
import { cn, scrollToSection } from '@/lib/utils';
import { requestTextColorMap } from '@/lib/utils/colors';
import useRequestStore from '../store/reques.store';
import useRequestTabsStore from '../store/tabs.store';
import { RequestMethod } from '../types/core.types';
import { RequestType } from '../types/store.types';
import { RequestIcon } from './RequestType';

const TabItem = ({
	id,
	title,
	type,
	method,
	onCloseClick = () => {},
	onTabClick = () => {},
	onDragStart = () => {},
	onDragEnd = () => {},
	onDragOver = () => {},
	onDragLeave = () => {},
	onDrop = () => {},
	isDragging = false,
	showDropIndicator = false,
	isSaved = false,
}: {
	id: string;
	title: string;
	type: RequestType | 'NEW';
	isSaved?: boolean;
	method?: RequestMethod;
	onCloseClick?: (id: string) => void;
	onTabClick?: (id: string) => void;
	onDragStart?: (e: React.DragEvent, id: string) => void;
	onDragEnd?: () => void;
	onDragOver?: (e: React.DragEvent, id: string) => void;
	onDragLeave?: () => void;
	onDrop?: (e: React.DragEvent, id: string) => void;
	isDragging?: boolean;
	showDropIndicator?: boolean;
}) => {
	return (
		<div
			className="relative flex items-center"
			id={id + type + method + title}
		>
			{showDropIndicator && (
				<div className="top-0 bottom-0 left-0 z-10 absolute bg-blue-500 w-0.5 animate-pulse" />
			)}
			<TabsTrigger
				value={id}
				onClick={(e) => {
					onTabClick(id);
				}}
				draggable
				onDragStart={(e) => onDragStart(e, id)}
				onDragEnd={onDragEnd}
				onDragOver={(e) => onDragOver(e, id)}
				onDragLeave={onDragLeave}
				onDrop={(e) => onDrop(e, id)}
				className={cn(
					'group flex justify-between gap-0 bg-white/40 hover:bg-white/85 dark:bg-muted/60 dark:data-[state=active]:bg-background dark:hover:bg-input/40 data-[state=active]:shadow-none data-[state=active]:-mb-0.5 dark:data-[state=active]:-mb-0.5 border border-transparent border-b-border data-[state=active]:!border-b-background data-[state=active]:border-border dark:border-b-0 rounded-none rounded-t-lg w-44 max-w-44 !h-[40px] text-xs transition-all cursor-pointer',
					isDragging && 'scale-95 opacity-30',
					showDropIndicator && 'ml-1',
					!isSaved && 'font-medium italic',
				)}
			>
				<span
					className={cn(
						'p-2 py-0.5 rounded text-xs',
						requestTextColorMap[method || 'GET'],
					)}
				>
					{type !== 'NEW' &&
						(type === 'API' ? (
							method
						) : (
							<RequestIcon type={type} className="size-4" />
						))}
				</span>
				<span className="flex flex-1 items-center gap-1 overflow-hidden text-start truncate text-ellipsis whitespace-nowrap">
					{title}
				</span>
				{!isSaved && (
					<span
						className="bg-indigo-400 opacity-50 mr-1 ml-2 rounded-full w-[5px] h-[5px] select-none"
						title="Unsaved"
					/>
				)}

				<div
					data-close-button
					className="bg-muted opacity-0 group-hover:opacity-100 ml-2 p-0.5 rounded-full hover:text-slate-400 text-sm transition-colors duration-300 cursor-pointer"
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						onCloseClick(id);
					}}
				>
					<X className="size-3.5" />
				</div>
			</TabsTrigger>
		</div>
	);
};

const TabBar = () => {
	const { tabs, removeTab, addTab, activeTab, setActiveTabById, setTabs } =
		useRequestTabsStore();
	const { activeRequest, addRequest } = useRequestStore();
	const [hiddenTabs, setHiddenTabs] = useState<typeof tabs>([]);
	const [draggedTabId, setDraggedTabId] = useState<string | null>(null);
	const [dragOverTabId, setDragOverTabId] = useState<string | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const tabBarRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const calculateVisibleTabs = () => {
			if (!tabBarRef.current || isDragging) return;

			const containerWidth = tabBarRef.current.offsetWidth;
			const availableWidth = containerWidth * 0.9;
			const tabWidth = 180;
			const maxVisibleTabs = Math.floor(availableWidth / tabWidth);

			if (maxVisibleTabs >= tabs.length) {
				setHiddenTabs([]);
				return;
			}

			const activeTabIndex = tabs.findIndex(
				(tab) => tab.id === activeTab?.id,
			);

			if (activeTabIndex === -1) {
				setHiddenTabs(tabs.slice(maxVisibleTabs));
				return;
			}

			let startIndex = Math.max(
				0,
				activeTabIndex - Math.floor(maxVisibleTabs / 2),
			);

			if (startIndex + maxVisibleTabs > tabs.length) {
				startIndex = tabs.length - maxVisibleTabs;
			}

			const endIndex = startIndex + maxVisibleTabs;

			const hiddenBefore = tabs.slice(0, startIndex);
			const hiddenAfter = tabs.slice(endIndex);
			const hidden = [...hiddenBefore, ...hiddenAfter];

			setHiddenTabs(hidden);
			if (activeTab)
				scrollToSection(
					activeTab.id +
						activeTab.type +
						activeTab.method +
						activeTab.title,
				);
		};

		calculateVisibleTabs();
		window.addEventListener('resize', calculateVisibleTabs);

		return () => {
			window.removeEventListener('resize', calculateVisibleTabs);
		};
	}, [tabs, activeTab?.id, isDragging]);

	const handleDragStart = (e: React.DragEvent, tabId: string) => {
		setDraggedTabId(tabId);
		setIsDragging(true);
		e.dataTransfer.effectAllowed = 'move';
		e.dataTransfer.setData('text/html', tabId);
	};

	const handleDragEnd = () => {
		setDraggedTabId(null);
		setDragOverTabId(null);
		setIsDragging(false);
	};

	const handleDragOver = (e: React.DragEvent, tabId: string) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = 'move';
		if (draggedTabId && draggedTabId !== tabId) {
			setDragOverTabId(tabId);
		}
	};

	const handleDragLeave = () => {
		setDragOverTabId(null);
	};

	const handleDrop = (e: React.DragEvent, targetTabId: string) => {
		e.preventDefault();

		if (!draggedTabId || draggedTabId === targetTabId) return;

		const draggedIndex = tabs.findIndex((tab) => tab.id === draggedTabId);
		const targetIndex = tabs.findIndex((tab) => tab.id === targetTabId);

		if (draggedIndex === -1 || targetIndex === -1) return;

		const newTabs = [...tabs];
		const [draggedTab] = newTabs.splice(draggedIndex, 1);
		newTabs.splice(targetIndex, 0, draggedTab);

		setTabs(newTabs);
		setActiveTabById(draggedTabId);
		setDraggedTabId(null);
		setDragOverTabId(null);
	};

	return (
		<TabsList
			className="flex-1 justify-start gap-2 !bg-muted p-0 pt-2 rounded-none w-full !h-fit max-h-[40px] overflow-hidden"
			ref={tabBarRef}
		>
			<div className="flex overflow-hidden">
				{tabs.map((tab) => (
					<TabItem
						key={tab.id + tab.title}
						id={tab.id}
						title={tab.title}
						type={tab.type}
						method={tab.method}
						onCloseClick={() => removeTab(tab.id)}
						onTabClick={() => {
							setActiveTabById(tab.id);
							setActiveTabById(tab.id || '');
						}}
						onDragStart={handleDragStart}
						onDragEnd={handleDragEnd}
						onDragOver={handleDragOver}
						onDragLeave={handleDragLeave}
						onDrop={handleDrop}
						isDragging={draggedTabId === tab.id}
						showDropIndicator={
							dragOverTabId === tab.id && draggedTabId !== tab.id
						}
					/>
				))}
			</div>
			{hiddenTabs.length > 0 && (
				<Popover>
					<PopoverTrigger asChild className="right-0 sticky">
						<Button
							size={'icon'}
							variant={'ghost'}
							className="right-0 sticky cursor-pointer"
						>
							<MoreHorizontal />
						</Button>
					</PopoverTrigger>
					<PopoverContent className="p-1 w-auto">
						<div className="flex flex-col gap-1">
							{hiddenTabs.map((tab) => (
								<TabsTrigger
									value={tab.id}
									key={tab.id + tab.title}
									onClick={() => setActiveTabById(tab.id)}
									className="group flex justify-between gap-0 bg-white/40 hover:bg-white/85 dark:bg-muted/60 dark:hover:bg-input/40 border border-transparent border-b-border dark:border-b-0 rounded-lg w-44 max-w-44 !h-[40px] cursor-pointer"
								>
									<span
										className={cn(
											'p-2 py-0.5 rounded text-xs',
											requestTextColorMap[
												tab.method || 'GET'
											],
										)}
									>
										{tab.type === 'API' ? (
											tab.method
										) : (
											<RequestIcon
												type={tab.type}
												className="!w-[30px]"
											/>
										)}
									</span>
									<span className="flex-1 overflow-hidden text-start truncate text-ellipsis whitespace-nowrap">
										{tab.title}
									</span>
									<div
										className="bg-muted opacity-0 group-hover:opacity-100 ml-2 p-0.5 rounded-full hover:text-slate-400 text-sm transition-colors duration-300 cursor-pointer"
										onClick={(e) => {
											e.preventDefault();
											e.stopPropagation();
											removeTab(tab.id);
										}}
									>
										<X className="size-3.5" />
									</div>
								</TabsTrigger>
							))}
						</div>
					</PopoverContent>
				</Popover>
			)}
			<Button
				size={'icon'}
				variant={'ghost'}
				className="right-0 sticky hover:opacity-80 cursor-pointer"
				onClick={() => {
					const requestId = createId();
					addTab({
						id: requestId,
						title: 'New...',
						type: 'NEW' as RequestType,
					});
					addRequest({
						id: requestId,
						name: 'New Request',
						type: 'API' as RequestType,
						method: 'GET' as RequestMethod,
						url: '',
						headers: [],
						body: '',
						bodyType: BodyType.NONE,
						parameters: [],
						auth: { type: 'NONE', data: {} },
						collectionId: '',
						description: '',
						messageType: 'CONNECTION',
						createdAt: new Date(),
						updatedAt: new Date(),
					});
				}}
			>
				<Plus />
			</Button>
		</TabsList>
	);
};

export default TabBar;
