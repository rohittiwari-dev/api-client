import React from 'react';
import Link from 'next/link';
import { ContainerIcon } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const EnvironmentSwitcher = () => {
	return (
		<>
			<Select
				defaultValue="Environment"
				// onValueChange={async (val) => {
				// 	const workspace = workspaces.find(
				// 		(workspace) => workspace.id === val,
				// 	);
				// 	if (workspace) {
				// 		setSelected(workspace);
				// 		redirect(`/workspace/${workspace.slug}`);
				// 	}
				// }}
			>
				<SelectTrigger
					type={'button'}
					className={cn(
						'bg-input dark:!bg-muted/60 dark:!border-input/40 min-w-40 cursor-pointer border-slate-400/30',
					)}
				>
					<ContainerIcon />
					<SelectValue />
				</SelectTrigger>
				<SelectContent className={'px-2 py-2'}>
					<SelectItem
						className={'hover:!bg-input/40 cursor-pointer'}
						value={'Environment'}
					>
						Environment 1
					</SelectItem>
					<Link
						href={'/workspace/new'}
						className={buttonVariants({
							className:
								'hover:bg-primary mt-2 cursor-pointer text-sm hover:text-white',
							variant: 'secondary',
							size: 'sm',
						})}
					>
						Create Environment
					</Link>
				</SelectContent>
			</Select>
		</>
	);
};

export default EnvironmentSwitcher;
