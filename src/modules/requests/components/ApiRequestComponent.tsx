import React from 'react';
import { IconSend } from '@tabler/icons-react';
import { SaveIcon } from 'lucide-react';
import { AddOnInput } from '@/components/app-ui/inputs';
import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn, getColorFromClass, requestBgColorMap } from '@/lib/utils';
import useRequestTabsStore from '../store/tabs.store';
import BodyComponent from './api-request-components/body-component';
import CookieComponent from './api-request-components/cookie-component';
import HeaderComponent from './api-request-components/header-component';
import ParameterComponent from './api-request-components/parameter-component';

const ApiRequestComponent = () => {
	const {} = useRequestTabsStore();
	return (
		<div className="flex h-full w-full flex-col gap-2">
			<div className="flex w-full items-center gap-4 p-4">
				<AddOnInput
					placeholder="Enter request URL"
					className="flex-1"
					containerClassName="flex-1"
					rightIcon={
						<Button className="cursor-pointer rounded-none rounded-r-md">
							<IconSend className="fill-white" /> Send
						</Button>
					}
					leftIcon={
						<Select
							defaultValue="GET"
							onValueChange={(value) => console.log(value)}
						>
							<SelectTrigger
								className={cn(
									'w-28',
									'cursor-pointer rounded-none rounded-l-md font-semibold text-white',
									requestBgColorMap[
										'GET' as keyof typeof requestBgColorMap
									],
								)}
							>
								<SelectValue
									placeholder="Select HTTP Method"
									className="text-white"
								/>
							</SelectTrigger>
							<SelectContent color="white">
								<SelectItem
									value="GET"
									className="cursor-pointer"
								>
									GET
								</SelectItem>
								<SelectItem
									value="POST"
									className="cursor-pointer"
								>
									POST
								</SelectItem>
								<SelectItem
									value="PUT"
									className="cursor-pointer"
								>
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
								<SelectItem
									value="HEAD"
									className="cursor-pointer"
								>
									HEAD
								</SelectItem>
								<SelectItem
									value="OPTIONS"
									className="cursor-pointer"
								>
									OPTIONS
								</SelectItem>
							</SelectContent>
						</Select>
					}
				/>
				<Button
					variant={'secondary'}
					className="!bg-muted !text-muted-foreground cursor-pointer shadow transition-all duration-300 hover:opacity-75"
				>
					<SaveIcon className="text-muted-foreground" /> Save
				</Button>
			</div>
			<div className="px-4">
				<Tabs defaultValue="parameters" className="w-full">
					<TabsList className="bg-muted gap-2">
						<TabsTrigger
							value="parameters"
							className="data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground cursor-pointer"
						>
							Params
						</TabsTrigger>
						<TabsTrigger
							value="headers"
							className="data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground cursor-pointer"
						>
							Headers
						</TabsTrigger>
						<TabsTrigger
							value="body"
							className="data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground cursor-pointer"
						>
							Body
						</TabsTrigger>
						<TabsTrigger
							value="cookies"
							className="data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground cursor-pointer"
						>
							Cookies
						</TabsTrigger>
					</TabsList>
					<TabsContent value="parameters">
						<ParameterComponent />
					</TabsContent>
					<TabsContent value="headers">
						<HeaderComponent />
					</TabsContent>
					<TabsContent value="body">
						<BodyComponent />
					</TabsContent>
					<TabsContent value="cookies">
						<CookieComponent />
					</TabsContent>
				</Tabs>
			</div>
			<div className="flex flex-1 items-center justify-center">
				<p>Here Response will go on</p>
			</div>
		</div>
	);
};

export default ApiRequestComponent;
