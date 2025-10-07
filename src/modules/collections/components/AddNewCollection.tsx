'use client';

import React, { useEffect } from 'react';
import { Folder } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import useWorkspaceState from '@/modules/workspace/store';
import { useCreateCollection } from '../hooks/queries';

const AddNewCollection = ({ parentID }: { parentID?: string }) => {
	const [dialogOpen, setDialogOpen] = React.useState(false);
	const [collectionName, setCollectionName] = React.useState('');
	const { activeWorkspace } = useWorkspaceState();
	const {
		mutate: createCollectionMutation,
		isPending,
		isSuccess,
		error,
	} = useCreateCollection(activeWorkspace?.id!);

	useEffect(() => {
		if (isSuccess) {
			setDialogOpen(false);
			setCollectionName('');
			toast.success('Collection created successfully');
		}
		if (error) {
			toast.error('Failed to create collection', {
				description:
					(error as any)?.data?.message ||
					(error as Error).message ||
					'Unknown error',
			});
		}
	}, [isSuccess]);

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogTrigger className="hover:!bg-muted dark:hover:!bg-secondary/60 text-foreground/80 hover:!text-primary flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-xs dark:hover:!text-indigo-400">
				<Folder className="size-3" />
				Add New Collection
			</DialogTrigger>
			<DialogContent>
				<DialogTitle>Add New Collection</DialogTitle>
				<DialogDescription>
					Create a new collection to organize your requests.
				</DialogDescription>
				<Input
					placeholder="Collection Name"
					value={collectionName}
					onChange={(e) => setCollectionName(e.target.value)}
				/>
				<DialogFooter>
					<DialogTrigger asChild>
						<Button variant="outline" className="cursor-pointer">
							Cancel
						</Button>
					</DialogTrigger>
					<Button
						onClick={async () => {
							createCollectionMutation({
								name: collectionName,
								parentId: parentID,
							});
						}}
						disabled={!collectionName || isPending}
						className="cursor-pointer"
					>
						{isPending && <Spinner />}
						Create
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default AddNewCollection;
