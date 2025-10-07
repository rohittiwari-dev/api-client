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
import useRequestStore from '../../store/request.store';

const FormDataComponent = () => {
	const { activeRequest, updateRequest } = useRequestStore();
	return (
		<div className="relative flex h-fit w-full flex-col gap-4 rounded-lg">
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
				className="hover:!text-foreground/70 absolute right-1 z-50 cursor-pointer items-center gap-1 !text-[0.6rem] hover:!bg-transparent"
			>
				<Plus className="!size-3" /> Add Key
			</Button>
			<Table className="!m-0 !p-0">
				<TableHeader className="select-none">
					<TableRow className="!py-0.5 select-none hover:!bg-transparent">
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
									className="size-5 cursor-pointer rounded-full"
								/>
							</TableCell>
							<TableCell>
								<Input
									placeholder="Key"
									className="h-fit py-2 !text-xs"
								/>
							</TableCell>
							<TableCell>
								<Select defaultValue="string">
									<SelectTrigger className="w-full text-left !text-xs">
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
									className="h-fit py-2 !text-xs"
								/>
							</TableCell>
							<TableCell>
								<Input
									placeholder="Description"
									className="h-fit py-2 !text-xs"
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
