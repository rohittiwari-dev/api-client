import React from 'react';
import { IconDeviceRemote, IconRocket } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyMedia,
} from '@/components/ui/empty';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FormDataComponent from './formdata-component';
import JsonBodyComponent from './json-body-component';

const BodyComponent = () => {
	return (
		<Tabs defaultValue="json" className="">
			<TabsList className="h-fit rounded">
				<TabsTrigger
					className="cursor-pointer rounded px-2 py-1 text-[0.6rem]"
					value="none"
				>
					None
				</TabsTrigger>
				<TabsTrigger
					className="cursor-pointer rounded px-2 py-1 text-[0.6rem]"
					value="json"
				>
					Json
				</TabsTrigger>
				<TabsTrigger
					className="cursor-pointer rounded px-2 py-1 text-[0.6rem]"
					value="form-data"
				>
					Form Data
				</TabsTrigger>
				<TabsTrigger
					className="cursor-pointer rounded px-2 py-1 text-[0.6rem]"
					value="x-www-form-urlencoded"
				>
					x-www-form-urlencoded
				</TabsTrigger>
				<TabsTrigger
					className="cursor-pointer rounded px-2 py-1 text-[0.6rem]"
					value="raw"
				>
					Raw
				</TabsTrigger>
				<TabsTrigger
					className="cursor-pointer rounded px-2 py-1 text-[0.6rem]"
					value="binary"
				>
					Binary
				</TabsTrigger>
			</TabsList>
			<TabsContent value="none" className="p-2 !pt-0">
				<Empty className="flex h-full max-h-[350px] min-h-[200px] w-full flex-1 items-center justify-center">
					<EmptyContent className="flex h-full w-full items-center justify-center">
						<EmptyMedia>
							<Card className="bg-muted/30 flex h-24 w-24 items-center justify-center rounded-3xl border-none">
								<IconDeviceRemote
									className="text-primary/70 size-12"
									stroke={0.5}
								/>
							</Card>
						</EmptyMedia>
						<EmptyDescription>No Body Selected</EmptyDescription>
					</EmptyContent>
				</Empty>
			</TabsContent>
			<TabsContent value="json">
				<JsonBodyComponent />
			</TabsContent>
			<TabsContent value="form-data">
				<FormDataComponent />
			</TabsContent>
			<TabsContent value="x-www-form-urlencoded">
				<FormDataComponent />
			</TabsContent>
			<TabsContent value="raw">
				<JsonBodyComponent />
			</TabsContent>
			<TabsContent value="binary">
				<Button>Upload</Button>
			</TabsContent>
		</Tabs>
	);
};

export default BodyComponent;
