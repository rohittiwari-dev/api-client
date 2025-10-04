import React from 'react';
import { IconRocket, IconSend } from '@tabler/icons-react';
import { SaveIcon } from 'lucide-react';
import { AddOnInput } from '@/components/app-ui/inputs';
import { Button } from '@/components/ui/button';
import { ButtonGroup, ButtonGroupText } from '@/components/ui/button-group';
import { Card } from '@/components/ui/card';
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyMedia,
} from '@/components/ui/empty';
import { Input } from '@/components/ui/input';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from '@/components/ui/input-group';
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from '@/components/ui/resizable';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn, requestBgColorMap } from '@/lib/utils';
import useRequestTabsStore from '../store/tabs.store';
import BodyComponent from './api-request-components/body-component';
import HeaderComponent from './api-request-components/header-component';
import ParameterComponent from './api-request-components/parameter-component';

const ApiRequestComponent = () => {
	const {} = useRequestTabsStore();
	return (
		<div className="mt-4 flex h-full w-full flex-col gap-4 px-4 select-none">
			<div className="flex w-full items-center gap-4">
				<ButtonGroup className="flex-1">
					<Select
						defaultValue="GET"
						onValueChange={(value) => console.log(value)}
					>
						<SelectTrigger
							className={cn(
								'cursor-pointer rounded-none rounded-l-md font-semibold text-white',
								requestBgColorMap[
									'GET' as keyof typeof requestBgColorMap
								],
								'!text-xs',
								'!w-full !max-w-24',
							)}
						>
							<SelectValue
								placeholder="Select HTTP Method"
								className="text-white"
							/>
						</SelectTrigger>
						<SelectContent align="start">
							<SelectItem value="GET" className="cursor-pointer">
								GET
							</SelectItem>
							<SelectItem value="POST" className="cursor-pointer">
								POST
							</SelectItem>
							<SelectItem value="PUT" className="cursor-pointer">
								PUT
							</SelectItem>
							<SelectItem
								value="DELETE"
								className="cursor-pointer"
							>
								DELETE
							</SelectItem>
							<SelectItem
								value="PATCH"
								className="cursor-pointer"
							>
								PATCH
							</SelectItem>
						</SelectContent>
					</Select>
					<InputGroup>
						<InputGroupInput id="url" />
					</InputGroup>
					<Button className="cursor-pointer rounded-none rounded-r-md">
						<IconSend className="fill-white" /> Send
					</Button>
				</ButtonGroup>
				<Button
					variant={'secondary'}
					className="!bg-muted !text-muted-foreground cursor-pointer shadow transition-all duration-300 hover:opacity-75"
				>
					<SaveIcon className="text-muted-foreground" /> Save
				</Button>
			</div>
			<Tabs
				defaultValue="parameters"
				className="w-full flex-1 select-none"
			>
				<TabsList className="bg-muted/70 !h-[30px] gap-2 !overflow-hidden rounded">
					<TabsTrigger
						value="parameters"
						className="data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground h-fit cursor-pointer rounded px-2 !py-1 !text-[0.65rem]"
					>
						Params
					</TabsTrigger>
					<TabsTrigger
						value="headers"
						className="data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground h-fit cursor-pointer rounded px-2 !py-1 !text-[0.65rem]"
					>
						Headers
					</TabsTrigger>
					<TabsTrigger
						value="body"
						className="data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground h-fit cursor-pointer rounded px-2 !py-1 !text-[0.65rem]"
					>
						Body
					</TabsTrigger>
				</TabsList>
				<ResizablePanelGroup
					direction="vertical"
					className="h-full w-full rounded-lg"
				>
					<ResizablePanel
						defaultSize={70}
						minSize={50}
						maxSize={90}
						className="flex flex-col !overflow-y-auto !pb-4"
					>
						<TabsContent
							value="parameters"
							className="w-full flex-1 overflow-y-auto !p-0"
						>
							<ParameterComponent />
						</TabsContent>
						<TabsContent
							value="headers"
							className="w-full flex-1 overflow-y-auto"
						>
							<HeaderComponent />
						</TabsContent>
						<TabsContent
							value="body"
							className="w-full flex-1 overflow-y-auto"
						>
							<BodyComponent />
						</TabsContent>
					</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel defaultSize={30} minSize={10} maxSize={50}>
						<Empty className="flex h-full items-center justify-center p-6 text-xs">
							<EmptyContent className="flex h-full w-full items-center justify-center">
								<EmptyMedia>
									<Card className="bg-muted/30 flex h-24 w-24 items-center justify-center rounded-3xl border-none">
										<IconRocket
											className="text-primary/70 size-12"
											stroke={0.5}
										/>
									</Card>
								</EmptyMedia>
								<EmptyDescription>
									Click Send to get a response
								</EmptyDescription>
							</EmptyContent>
						</Empty>
					</ResizablePanel>
				</ResizablePanelGroup>
			</Tabs>
		</div>
	);
};

export default ApiRequestComponent;
