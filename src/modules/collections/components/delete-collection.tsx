import React, { use } from 'react';
import { IconAlertTriangleFilled } from '@tabler/icons-react';
import { Trash } from 'lucide-react';
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
import { Spinner } from '@/components/ui/spinner';
import { useDeleteCollection } from '../hooks/queries';

const DeleteCollection = ({ id }: { id: string }) => {
	const [dialogOpen, setDialogOpen] = React.useState(false);
	const {
		mutate: deleteCollection,
		isPending,
		isSuccess,
		isError,
	} = useDeleteCollection(id);

	React.useEffect(() => {
		if (isSuccess) {
			console.log('Collection deleted successfully');
			setDialogOpen(false);
		}
		if (isError) {
			console.error('Failed to delete collection');
		}
	}, [isSuccess, isError]);

	return (
		<AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<AlertDialogTrigger className="hover:!bg-muted dark:hover:!bg-secondary/60 text-foreground/80 flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 !text-xs hover:!text-red-400">
				<Trash className="size-3 !text-inherit group-hover:text-red-400" />{' '}
				Delete Collection
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogTitle className="dark:text-destructive-foreground flex items-center gap-2">
					<IconAlertTriangleFilled className="size-5" />
					Are you sure? you want to delete this collection?
				</AlertDialogTitle>
				<AlertDialogDescription>
					This action cannot be undone, and all the requests inside
					this will be deleted and nested collections and requests
					inside theme will moved to one higher level.
				</AlertDialogDescription>
				<AlertDialogFooter>
					<Button
						variant="destructive"
						disabled={isPending}
						className="cursor-pointer"
						onClick={() => {
							deleteCollection();
						}}
					>
						{isPending && <Spinner />}
						Delete
					</Button>
					<AlertDialogCancel className="cursor-pointer">
						Cancel
					</AlertDialogCancel>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default DeleteCollection;
