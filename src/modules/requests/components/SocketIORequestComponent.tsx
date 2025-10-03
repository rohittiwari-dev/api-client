import React from 'react';
import { IconPlugConnectedX } from '@tabler/icons-react';
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
import { cn } from '@/lib/utils';
import useRequestTabsStore from '../store/tabs.store';

const SocketIORequestComponent = () => {
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
							<IconPlugConnectedX className="!text-white" />{' '}
							Connect
						</Button>
					}
					leftIcon={
						<Select
							defaultValue="HTTP"
							onValueChange={(value) => console.log(value)}
						>
							<SelectTrigger
								className={cn(
									'w-28',
									'cursor-pointer rounded-none rounded-l-md !bg-indigo-500 font-semibold text-white dark:!bg-indigo-800',
								)}
							>
								<SelectValue
									placeholder="Select HTTP Method"
									className="text-white"
								/>
							</SelectTrigger>
							<SelectContent color="white">
								<SelectItem
									value="HTTP"
									className="cursor-pointer"
								>
									HTTP
								</SelectItem>
								<SelectItem
									value="HTTPS"
									className="cursor-pointer"
								>
									HTTPS
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
			<div className="flex flex-1 items-center justify-center">
				<p>This is where the API request UI will go.</p>
			</div>
		</div>
	);
};

export default SocketIORequestComponent;
