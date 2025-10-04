import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

const FormDataComponent = () => {
	const [formData, setFormData] = React.useState<
		{
			key: string;
			value: string;
			type: 'number' | 'file' | 'string' | 'boolean';
			isActive: boolean;
		}[]
	>([{ key: '', value: '', type: 'string', isActive: true }]);
	return (
		<div className="relative flex h-fit w-full flex-col gap-4 rounded-lg">
			<Button
				variant={'ghost'}
				size={'sm'}
				onClick={() =>
					setFormData([
						...formData,
						{
							key: '',
							value: '',
							type: 'string',
							isActive: false,
						},
					])
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
							Description
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{formData.map((param, index) => (
						<TableRow key={index} className="hover:!bg-transparent">
							<TableCell>
								<Checkbox
									id={`query-param-${index}`}
									checked={param.isActive}
									onCheckedChange={(checked) => {
										const newParams = [...formData];
										newParams[index].isActive =
											checked as boolean;
										setFormData(newParams);
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
