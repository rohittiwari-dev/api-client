import React, { useState, useEffect } from 'react';
import { IconPlugConnected, IconPlugConnectedX, IconTrash } from '@tabler/icons-react';
import { SaveIcon } from 'lucide-react';
import { AddOnInput } from '@/components/app-ui/inputs';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from '@/components/ui/resizable';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import useRequestStore from '../store/request.store';
import useRequestTabsStore from '../store/tabs.store';
import useSocketIOStore from '../store/socketio.store';
import { useUpsertRequest } from '../hooks/queries';
import MessageEditor from './shared/MessageEditor';
import SavedMessages from './shared/SavedMessages';
import ParameterComponent from './api-request-components/parameter-component';
import HeaderComponent from './api-request-components/header-component';

const SocketIORequestComponent = () => {
	const { activeRequest, updateRequest } = useRequestStore();
	const { replaceTabData } = useRequestTabsStore();
	const {
		connect,
		disconnect,
		emit,
		messages,
		connectionStatus,
		clearMessages,
	} = useSocketIOStore();

	const [eventName, setEventName] = useState('');
	const [eventArgs, setEventArgs] = useState('');
	const [ack, setAck] = useState(false);
	const [activeTab, setActiveTab] = useState('message');
	const requestId = activeRequest?.id || '';
	const status = connectionStatus[requestId] || 'disconnected';
	const requestMessages = messages[requestId] || [];

	// Use the upsert mutation hook for saving
	const upsertMutation = useUpsertRequest(activeRequest?.workspaceId || '', {
		onSuccess: () => {
			// Mark as saved in both request and tab stores
			if (activeRequest?.id) {
				updateRequest(activeRequest.id, { unsaved: false });
				replaceTabData(activeRequest.id, { unsaved: false });
			}
		},
		onError: (error) => {
			console.error('Failed to save request', error);
		},
	});

	const handleConnect = () => {
		if (status === 'connected') {
			disconnect(requestId);
		} else {
			if (activeRequest?.url) {
				connect(requestId, activeRequest.url);
			}
		}
	};

	const handleSend = () => {
		if (eventName && status === 'connected') {
			try {
				const args = eventArgs ? JSON.parse(eventArgs) : undefined;
				const argsArray = Array.isArray(args) ? args : args ? [args] : [];
				emit(requestId, eventName, ...argsArray);
				// Optional: Clear inputs
				// setEventName('');
				// setEventArgs('');
			} catch (e) {
				console.error('Invalid JSON args', e);
				// Ideally show a toast or error message here
			}
		}
	};

	const handleSave = () => {
		if (!activeRequest?.id) return;
		upsertMutation.mutate({
			requestId: activeRequest.id,
			name: activeRequest.name || 'Untitled Socket.IO',
			url: activeRequest.url || '',
			workspaceId: activeRequest.workspaceId,
			collectionId: activeRequest.collectionId,
			headers: activeRequest.headers,
			parameters: activeRequest.parameters,
			type: 'SOCKET_IO',
		});
	};

	// Keyboard shortcut for Ctrl+S to save
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.ctrlKey || e.metaKey) && e.key === 's') {
				e.preventDefault();
				handleSave();
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [activeRequest]);

	return (
		<div className="flex h-full w-full flex-col gap-2 backdrop-blur-md">
			<div className="flex w-full items-center gap-4 p-4">
				<AddOnInput
					placeholder="Enter request URL (http:// or https://)"
					className="flex-1"
					containerClassName="flex-1"
					value={activeRequest?.url || ''}
					onChange={(e) => {
						if (activeRequest?.id) {
							updateRequest(activeRequest.id, {
								url: e.target.value,
							});
						}
					}}
					rightIcon={
						<Button
							className={cn(
								'cursor-pointer rounded-none rounded-r-md',
								status === 'connected'
									? 'bg-red-500 hover:bg-red-600'
									: 'bg-green-500 hover:bg-green-600',
							)}
							onClick={handleConnect}
						>
							{status === 'connected' ? (
								<>
									<IconPlugConnectedX className="!text-white" />
									Disconnect
								</>
							) : (
								<>
									<IconPlugConnected className="!text-white" />
									Connect
								</>
							)}
						</Button>
					}
					leftIcon={
						<Select
							defaultValue="HTTP"
							onValueChange={(value) => console.log(value)}
						>
							<SelectTrigger
								className={cn(
									'w-28',
									'cursor-pointer rounded-none rounded-l-md !bg-indigo-500 font-semibold text-white dark:!bg-indigo-800',
								)}
							>
								<SelectValue
									placeholder="Protocol"
									className="text-white"
								/>
							</SelectTrigger>
							<SelectContent color="white">
								<SelectItem
									value="HTTP"
									className="cursor-pointer"
								>
									HTTP
								</SelectItem>
								<SelectItem
									value="HTTPS"
									className="cursor-pointer"
								>
									HTTPS
								</SelectItem>
							</SelectContent>
						</Select>
					}
				/>
				<Button
					variant={'secondary'}
					className="!bg-muted !text-muted-foreground cursor-pointer shadow transition-all duration-300 hover:opacity-75"
					onClick={handleSave}
					disabled={upsertMutation.isPending}
				>
					{upsertMutation.isPending ? (
						<span className="animate-spin mr-1">⏳</span>
					) : (
						<SaveIcon className="text-muted-foreground" />
					)}
					{upsertMutation.isPending ? 'Saving...' : 'Save'}
				</Button>
			</div>

			<Tabs
				value={activeTab}
				onValueChange={setActiveTab}
				className="flex-1 flex flex-col overflow-hidden"
			>
				<div className="px-4">
					<TabsList className="bg-muted/70 !h-[30px] gap-2 !overflow-hidden rounded">
						<TabsTrigger
							value="message"
							className="data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground dark:data-[state=active]:!bg-white/10 dark:data-[state=active]:!text-white h-fit cursor-pointer rounded px-2 !py-1 !text-[0.65rem] transition-colors"
						>
							Message
						</TabsTrigger>
						<TabsTrigger
							value="params"
							className="data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground dark:data-[state=active]:!bg-white/10 dark:data-[state=active]:!text-white h-fit cursor-pointer rounded px-2 !py-1 !text-[0.65rem] transition-colors"
						>
							Params
						</TabsTrigger>
						<TabsTrigger
							value="headers"
							className="data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground dark:data-[state=active]:!bg-white/10 dark:data-[state=active]:!text-white h-fit cursor-pointer rounded px-2 !py-1 !text-[0.65rem] transition-colors"
						>
							Headers
						</TabsTrigger>
					</TabsList>
				</div>

				<TabsContent value="message" className="flex-1 flex overflow-hidden mt-2 border-t">
					<ResizablePanelGroup direction="horizontal" className="h-full w-full">
						<ResizablePanel defaultSize={75} minSize={30}>
							<ResizablePanelGroup direction="vertical">
								<ResizablePanel defaultSize={60} minSize={30} className="flex flex-col">
									<div className="flex items-center justify-between p-2 border-b bg-muted/20">
										<h3 className="text-xs font-semibold">Log</h3>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => clearMessages(requestId)}
											className="h-6 px-2 text-[10px]"
										>
											<IconTrash className="mr-1 h-3 w-3" />
											Clear
										</Button>
									</div>
									<ScrollArea className="flex-1 p-4">
										<div className="flex flex-col gap-2">
											{requestMessages.map((msg) => (
												<div
													key={msg.id}
													className={cn(
														'flex w-full flex-col gap-1 rounded p-2 text-sm',
														msg.direction === 'sent'
															? 'bg-primary/10 items-end'
															: msg.direction === 'received'
																? 'bg-secondary/10 items-start'
																: 'bg-muted items-center text-muted-foreground',
													)}
												>
													<span className="text-[10px] opacity-50">
														{new Date(msg.timestamp).toLocaleTimeString()} - {msg.direction.toUpperCase()}
														{msg.eventName && ` - ${msg.eventName}`}
													</span>
													<pre className="whitespace-pre-wrap font-mono text-xs">
														{msg.content}
													</pre>
												</div>
											))}
											{requestMessages.length === 0 && (
												<div className="flex h-full items-center justify-center text-muted-foreground text-xs">
													No messages yet
												</div>
											)}
										</div>
									</ScrollArea>
								</ResizablePanel>
								<ResizableHandle withHandle />
								<ResizablePanel defaultSize={40} minSize={20} className="flex flex-col p-4 gap-2">
									<div className="flex gap-2 items-center">
										<AddOnInput
											placeholder="Event Name"
											className="flex-1"
											value={eventName}
											onChange={(e) => setEventName(e.target.value)}
										/>
										<div className="flex items-center space-x-2">
											<Checkbox
												id="ack"
												checked={ack}
												onCheckedChange={(c) => setAck(!!c)}
											/>
											<Label htmlFor="ack" className="text-xs">Ack</Label>
										</div>
									</div>
									<MessageEditor
										value={eventArgs}
										onChange={setEventArgs}
										onSend={handleSend}
										disabled={status !== 'connected'}
										placeholder="Arguments (JSON array or object)"
									/>
								</ResizablePanel>
							</ResizablePanelGroup>
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel defaultSize={25} minSize={15} maxSize={40}>
							<SavedMessages
								requestId={requestId}
								type="SOCKET_IO"
								onSelect={(msg) => {
									setEventName(msg.eventName || '');
									setEventArgs(msg.args || '');
									setAck(msg.ack || false);
								}}
								currentMessage={{
									content: '', // SocketIO uses args
									eventName,
									args: eventArgs,
									ack
								}}
							/>
						</ResizablePanel>
					</ResizablePanelGroup>
				</TabsContent>

				<TabsContent value="params" className="flex-1 overflow-y-auto">
					<ParameterComponent />
				</TabsContent>

				<TabsContent value="headers" className="flex-1 overflow-y-auto">
					<HeaderComponent />
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default SocketIORequestComponent;
