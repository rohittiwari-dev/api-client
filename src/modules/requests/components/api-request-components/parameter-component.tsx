import React from 'react';
import { Plus } from 'lucide-react';
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

const ParameterComponent = () => {
	const [queryParams, setQueryParams] = React.useState<
		{ key: string; value: string; description: string; isActive: boolean }[]
	>([
		{
			key: '',
			value: '',
			description: '',
			isActive: true,
		},
	]);

	return (
		<div className="relative flex h-fit w-full flex-col gap-4 rounded-lg">
			<Button
				variant={'ghost'}
				size={'sm'}
				onClick={() =>
					setQueryParams([
						...queryParams,
						{
							key: '',
							value: '',
							description: '',
							isActive: false,
						},
					])
				}
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
					</TableRow>
				</TableHeader>
				<TableBody>
					{queryParams.map((param, index) => (
						<TableRow key={index} className="hover:!bg-transparent">
							<TableCell className="justify-center">
								<Checkbox
									id={`query-param-${index}`}
									checked={param.isActive}
									onCheckedChange={(checked) => {
										const newParams = [...queryParams];
										newParams[index].isActive =
											checked as boolean;
										setQueryParams(newParams);
									}}
									className="size-5 cursor-pointer rounded-full"
								/>
							</TableCell>
							<TableCell>
								<Input
									placeholder="Key"
									className="!bg-card h-fit py-2 !text-xs"
								/>
							</TableCell>
							<TableCell>
								<Input
									placeholder="Value"
									className="!bg-card h-fit py-2 !text-xs"
								/>
							</TableCell>
							<TableCell>
								<Input
									placeholder="Description"
									className="!bg-card h-fit py-2 !text-xs"
								/>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};

export default ParameterComponent;
