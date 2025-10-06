import React from 'react';
import { IconDeviceRemote } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyMedia,
} from '@/components/ui/empty';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BodyType } from '@/generated/prisma';
import useRequestStore from '../../store/reques.store';
import FormDataComponent from './formdata-component';
import JsonAndRawBodyComponent from './json-raw-body-component';

const BodyComponent = () => {
	const { activeRequest, updateRequest } = useRequestStore();
	return (
		<Tabs
			defaultValue="none"
			onValueChange={(val) => {
				if (val === 'none') {
					updateRequest(activeRequest?.id || '', {
						body: null,
						bodyType: BodyType.NONE,
					});
				} else if (val === 'json') {
					updateRequest(activeRequest?.id || '', {
						bodyType: BodyType.JSON,
						body: {},
					});
				} else if (val === 'form-data') {
					updateRequest(activeRequest?.id || '', {
						bodyType: BodyType.FORM_DATA,
						body: [],
					});
				} else if (val === 'x-www-form-urlencoded') {
					updateRequest(activeRequest?.id || '', {
						bodyType: BodyType.X_WWW_FORM_URLENCODED,
						body: [],
					});
				} else if (val === 'raw') {
					updateRequest(activeRequest?.id || '', {
						bodyType: BodyType.RAW,
						body: '',
					});
				}
			}}
		>
			<TabsList className="rounded h-fit">
				<TabsTrigger
					className="px-2 py-1 rounded text-[0.6rem] cursor-pointer"
					value="none"
				>
					None
				</TabsTrigger>
				<TabsTrigger
					className="px-2 py-1 rounded text-[0.6rem] cursor-pointer"
					value="json"
				>
					Json
				</TabsTrigger>
				<TabsTrigger
					className="px-2 py-1 rounded text-[0.6rem] cursor-pointer"
					value="form-data"
				>
					Form Data
				</TabsTrigger>
				<TabsTrigger
					className="px-2 py-1 rounded text-[0.6rem] cursor-pointer"
					value="x-www-form-urlencoded"
				>
					x-www-form-urlencoded
				</TabsTrigger>
				<TabsTrigger
					className="px-2 py-1 rounded text-[0.6rem] cursor-pointer"
					value="raw"
				>
					Raw
				</TabsTrigger>
			</TabsList>
			<TabsContent value="none" className="p-2 !pt-0">
				<Empty className="flex flex-1 justify-center items-center w-full h-full min-h-[200px] max-h-[350px]">
					<EmptyContent className="flex justify-center items-center w-full h-full">
						<EmptyMedia>
							<Card className="flex justify-center items-center bg-muted/30 border-none rounded-3xl w-24 h-24">
								<IconDeviceRemote
									className="size-12 text-primary/70"
									stroke={0.5}
								/>
							</Card>
						</EmptyMedia>
						<EmptyDescription>No Body Selected</EmptyDescription>
					</EmptyContent>
				</Empty>
			</TabsContent>
			<TabsContent value="json">
				<JsonAndRawBodyComponent
					type="json"
					value={activeRequest?.body || ''}
					onChange={(value) => {
						updateRequest(activeRequest?.id || '', {
							body: JSON.parse(value),
						});
					}}
				/>
			</TabsContent>
			<TabsContent value="form-data">
				<FormDataComponent />
			</TabsContent>
			<TabsContent value="x-www-form-urlencoded">
				<FormDataComponent />
			</TabsContent>
			<TabsContent value="raw">
				<JsonAndRawBodyComponent
					type="raw"
					value={activeRequest?.body || ''}
					onChange={(value) => {
						updateRequest(activeRequest?.id || '', {
							body: value,
						});
					}}
				/>
			</TabsContent>
		</Tabs>
	);
};

export default BodyComponent;
