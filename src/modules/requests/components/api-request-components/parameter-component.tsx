import React, { use, useEffect, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Input } from '@/components/app-ui/customInput';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import useRequestStore from '../../store/request.store';

const ParameterComponent = () => {
	const { activeRequest, updateRequest } = useRequestStore();

	return (
		<div className="relative flex h-fit w-full flex-col gap-4 rounded-lg">
			<Button
				variant={'ghost'}
				size={'sm'}
				onClick={() => {
					const existingKeys = new Set(
						(activeRequest?.parameters || []).map((p) =>
							p.key.trim(),
						),
					);
					const newKey = '';
					if (!existingKeys.has(newKey)) {
						const updatedParameters = [
							...(activeRequest?.parameters || []),
							{
								key: '',
								value: '',
								description: '',
								isActive: true,
							},
						];
						updateRequest(activeRequest?.id!, {
							parameters: updatedParameters,
							isSaved: false,
						});
					}
				}}
				className="hover:!text-foreground/70 absolute right-1 z-50 cursor-pointer items-center gap-1 !text-[0.6rem] hover:!bg-transparent"
			>
				<Plus className="!size-3" /> Add Parameter
			</Button>
			<Table className="!m-0 !p-0">
				<TableHeader>
					<TableRow className="!py-0.5 select-none hover:!bg-transparent">
						<TableHead className="!py-0.5 !text-xs"> </TableHead>
						<TableHead className="!py-0.5 !text-xs">Key</TableHead>
						<TableHead className="!py-0.5 !text-xs">
							Value
						</TableHead>
						<TableHead className="!py-0.5 !text-xs">
							Description
						</TableHead>
						<TableHead className="!py-0.5 !text-xs"> </TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{activeRequest?.parameters?.map((param, index) => (
						<TableRow key={index} className="hover:!bg-transparent">
							<TableCell className="justify-center">
								<Checkbox
									id={`query-param-${index}`}
									checked={param.isActive}
									onCheckedChange={(checked) => {
										const newParams = [
											...(activeRequest?.parameters ||
												[]),
										];
										newParams[index].isActive =
											checked as boolean;
										updateRequest(activeRequest?.id!, {
											parameters: newParams,
											isSaved: false,
										});
									}}
									className="size-5 cursor-pointer rounded-full"
								/>
							</TableCell>
							<TableCell>
								<Input
									placeholder="Key"
									value={param.key}
									onChange={(e) => {
										const newParams = [
											...(activeRequest?.parameters ||
												[]),
										];
										newParams[index].key = e.target.value;
										updateRequest(activeRequest?.id!, {
											parameters: newParams,
											isSaved: false,
										});
									}}
									className="!bg-card h-fit py-2 !text-xs"
								/>
							</TableCell>
							<TableCell>
								<Input
									placeholder="Value"
									value={param.value}
									onChange={(e) => {
										const newParams = [
											...(activeRequest?.parameters ||
												[]),
										];
										newParams[index].value = e.target.value;
										updateRequest(activeRequest?.id!, {
											parameters: newParams,
											isSaved: false,
										});
									}}
									className="!bg-card h-fit py-2 !text-xs"
								/>
							</TableCell>
							<TableCell>
								<Input
									placeholder="Description"
									value={param.description}
									onChange={(e) => {
										const newParams = [
											...(activeRequest?.parameters ||
												[]),
										];
										newParams[index].description =
											e.target.value;
										updateRequest(activeRequest?.id!, {
											parameters: newParams,
											isSaved: false,
										});
									}}
									className="!bg-card h-fit py-2 !text-xs"
								/>
							</TableCell>

							<TableCell width={10} className="justify-center">
								<Button
									size={'icon'}
									variant={'ghost'}
									onClick={() => {
										const newParams = [
											...(activeRequest?.parameters ||
												[]),
										];

										updateRequest(activeRequest?.id!, {
											parameters: newParams.filter(
												(_, i) => i !== index,
											),
											isSaved: false,
										});
									}}
									className="h-[30px] w-[30px] cursor-pointer rounded-full !p-0 hover:!bg-red-500/10 hover:!text-red-500/80"
								>
									<X className="size-4" />
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};

export default ParameterComponent;
