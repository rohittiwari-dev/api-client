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
import useRequestStore from '../../store/request.store';
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
