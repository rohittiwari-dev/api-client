import React from 'react';
import { Folder } from 'lucide-react';
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
import useWorkspaceState from '@/modules/workspace/store';
import { createCollectionAction } from '../../server/collection.action';

const AddNewCollection = ({ parentID }: { parentID?: string }) => {
	const [collectionName, setCollectionName] = React.useState('');
	const { activeWorkspace } = useWorkspaceState();
	return (
		<Dialog>
			<DialogTrigger className="flex items-center gap-2 hover:!bg-muted dark:hover:!bg-secondary/60 px-2 py-1.5 rounded-md w-full text-foreground/80 hover:!text-primary dark:hover:!text-indigo-400 text-xs cursor-pointer">
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
					<Button>Cancel</Button>
					<Button
						onClick={() => {
							createCollectionAction(
								collectionName,
								activeWorkspace?.id!,
							);
							setCollectionName('');
						}}
					>
						Create
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default AddNewCollection;
