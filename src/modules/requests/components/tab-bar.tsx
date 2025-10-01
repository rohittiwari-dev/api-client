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
import { cn, scrollToSection } from '@/lib/utils';
import { requestColorMap } from '@/lib/utils/colors';
import useRequestTabsStore from '../store';
import { RequestMethod, RequestType } from '../types';
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
}: {
	id: string;
	title: string;
	type: RequestType;
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
				<div className="absolute top-0 bottom-0 left-0 z-10 w-0.5 animate-pulse bg-blue-500" />
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
					'group dark:bg-muted/60 dark:data-[state=active]:bg-background dark:hover:bg-input/40 border-b-border data-[state=active]:!border-b-background data-[state=active]:border-border flex !h-[40px] w-44 max-w-44 cursor-move justify-between gap-0 rounded-none rounded-t-lg border border-transparent bg-white/40 transition-all hover:bg-white/85 data-[state=active]:-mb-0.5 data-[state=active]:shadow-none dark:border-b-0 dark:data-[state=active]:-mb-0.5',
					isDragging && 'scale-95 opacity-30',
					showDropIndicator && 'ml-1',
				)}
			>
				<span
					className={cn(
						'rounded p-2 py-0.5 text-xs',
						requestColorMap[method || 'GET'],
					)}
				>
					{type === 'api' ? (
						method
					) : (
						<RequestIcon type={type} className="!w-[30px]" />
					)}
				</span>
				<span className="flex-1 truncate overflow-hidden text-start text-ellipsis whitespace-nowrap">
					{title}
				</span>
				<div
					data-close-button
					className="bg-muted ml-2 cursor-pointer rounded-full p-0.5 text-sm opacity-0 transition-colors duration-300 group-hover:opacity-100 hover:text-slate-400"
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
			className="!bg-muted !h-fit max-h-[40px] w-full flex-1 justify-start gap-2 overflow-hidden rounded-none p-0 pt-2"
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
						onTabClick={() => setActiveTabById(tab.id)}
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
					<PopoverTrigger asChild className="sticky right-0">
						<Button
							size={'icon'}
							variant={'ghost'}
							className="sticky right-0 cursor-pointer"
						>
							<MoreHorizontal />
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-auto p-1">
						<div className="flex flex-col gap-1">
							{hiddenTabs.map((tab) => (
								<TabsTrigger
									value={tab.id}
									key={tab.id + tab.title}
									onClick={() => setActiveTabById(tab.id)}
									className="group dark:bg-muted/60 dark:hover:bg-input/40 border-b-border flex !h-[40px] w-44 max-w-44 cursor-pointer justify-between gap-0 rounded-lg border border-transparent bg-white/40 hover:bg-white/85 dark:border-b-0"
								>
									<span
										className={cn(
											'rounded p-2 py-0.5 text-xs',
											requestColorMap[
												tab.method || 'GET'
											],
										)}
									>
										{tab.type === 'api' ? (
											tab.method
										) : (
											<RequestIcon
												type={tab.type}
												className="!w-[30px]"
											/>
										)}
									</span>
									<span className="flex-1 truncate overflow-hidden text-start text-ellipsis whitespace-nowrap">
										{tab.title}
									</span>
									<div
										className="bg-muted ml-2 cursor-pointer rounded-full p-0.5 text-sm opacity-0 transition-colors duration-300 group-hover:opacity-100 hover:text-slate-400"
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
				className="sticky right-0 cursor-pointer hover:opacity-80"
				onClick={() =>
					addTab({
						id: createId(),
						title: 'New...',
						type: 'new',
					})
				}
			>
				<Plus />
			</Button>
		</TabsList>
	);
};

export default TabBar;
