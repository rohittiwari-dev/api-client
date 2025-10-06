import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import useRequestStore from '../../store/reques.store';

const FormDataComponent = () => {
	const { activeRequest, updateRequest } = useRequestStore();
	return (
		<div className="relative flex flex-col gap-4 rounded-lg w-full h-fit">
			<Button
				variant={'ghost'}
				size={'sm'}
				onClick={() =>
					updateRequest(activeRequest?.id || '', {
						body: [
							...((Array.isArray(activeRequest?.body)
								? activeRequest?.body
								: []) as any[]),
							{
								key: '',
								value: '',
								type: 'string',
								isActive: true,
							},
						],
					})
				}
				className="right-1 z-50 absolute items-center gap-1 hover:!bg-transparent !text-[0.6rem] hover:!text-foreground/70 cursor-pointer"
			>
				<Plus className="!size-3" /> Add Key
			</Button>
			<Table className="!m-0 !p-0">
				<TableHeader className="select-none">
					<TableRow className="hover:!bg-transparent !py-0.5 select-none">
						<TableHead className="!py-0.5 !text-xs"> </TableHead>
						<TableHead className="!py-0.5 !text-xs">Key</TableHead>
						<TableHead className="!py-0.5 !text-xs">
							Value
						</TableHead>
						<TableHead className="!py-0.5 !text-xs">
							File Type
						</TableHead>
						<TableHead className="!py-0.5 !text-xs">
							Description
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{(Array.isArray(activeRequest?.body)
						? activeRequest?.body
						: []
					)?.map((param: any, index) => (
						<TableRow key={index} className="hover:!bg-transparent">
							<TableCell>
								<Checkbox
									id={`query-param-${index}`}
									checked={param.isActive}
									onCheckedChange={(checked) => {
										const body = Array.isArray(
											activeRequest?.body,
										)
											? activeRequest?.body
											: [];
										body[index] = {
											...((body[index] as object) || {}),
											isActive: checked,
										};
										updateRequest(activeRequest?.id || '', {
											body,
										});
									}}
									className="rounded-full size-5 cursor-pointer"
								/>
							</TableCell>
							<TableCell>
								<Input
									placeholder="Key"
									className="py-2 h-fit !text-xs"
								/>
							</TableCell>
							<TableCell>
								<Select defaultValue="string">
									<SelectTrigger className="w-full !text-xs text-left">
										<SelectValue placeholder="Select type" />
									</SelectTrigger>
									<SelectContent>
										{[
											'string',
											'number',
											'file',
											'boolean',
										].map((type) => (
											<SelectItem key={type} value={type}>
												{type}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</TableCell>
							<TableCell>
								<Input
									placeholder="Value"
									className="py-2 h-fit !text-xs"
								/>
							</TableCell>
							<TableCell>
								<Input
									placeholder="Description"
									className="py-2 h-fit !text-xs"
								/>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};

export default FormDataComponent;
