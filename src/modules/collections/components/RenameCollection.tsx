import React from 'react';
import { Edit2 } from 'lucide-react';
import { toast } from 'sonner';
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from '@/components/ui/input-group';
import { Kbd } from '@/components/ui/kbd';
import { Spinner } from '@/components/ui/spinner';
import { useRenameCollection } from '../hooks/queries';

const RenameCollection = ({ id }: { id: string }) => {
	const [dialogOpen, setDialogOpen] = React.useState(false);
	const [newName, setNewName] = React.useState('');
	const {
		mutate: renameCollection,
		isPending,
		isSuccess,
		isError,
	} = useRenameCollection(id, newName);

	React.useEffect(() => {
		if (isSuccess) {
			setDialogOpen(false);
			toast.success('Collection renamed successfully');
		}
		if (isError) {
			toast.error('Failed to rename collection');
		}
	}, [isSuccess, isError]);

	return (
		<AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<AlertDialogTrigger className="hover:!bg-muted dark:hover:!bg-secondary/60 text-foreground/80 hover:!text-primary flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 !text-xs">
				<Edit2 className="group-hover:text-primary size-3 !text-inherit" />{' '}
				Rename Collection
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogTitle>Rename Collection</AlertDialogTitle>
				<AlertDialogDescription>
					<span className="text-muted-foreground">
						Rename your collection to better organize your requests.
					</span>
				</AlertDialogDescription>
				<InputGroup>
					<InputGroupInput
						value={newName}
						onChange={(e) => setNewName(e.target.value)}
					/>
					<InputGroupAddon>New Name</InputGroupAddon>
				</InputGroup>
				<AlertDialogFooter>
					<AlertDialogCancel className="cursor-pointer">
						Cancel
					</AlertDialogCancel>
					<Button
						className="cursor-pointer"
						onClick={() => renameCollection()}
						disabled={
							!newName ||
							newName.trim().length === 0 ||
							newName.trim() === id ||
							isPending
						}
					>
						{isPending && <Spinner />}
						Rename
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default RenameCollection;
