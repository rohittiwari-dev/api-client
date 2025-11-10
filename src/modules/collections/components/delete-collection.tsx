import React from "react";
import { IconAlertTriangleFilled } from "@tabler/icons-react";
import { Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useDeleteCollection } from "../hooks/queries";
import useRequestStore from "@/modules/requests/store/request.store";
import useRequestTabsStore from "@/modules/requests/store/tabs.store";
import useSidebarStore from "@/modules/layout/store/sidebar.store";

interface DeleteCollectionProps {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DeleteCollection = ({ id, open, onOpenChange }: DeleteCollectionProps) => {
  const {
    mutate: deleteCollection,
    isPending,
    isSuccess,
    isError,
  } = useDeleteCollection(id);

  const { requests, updateRequest } = useRequestStore();
  const { replaceTabData, tabs } = useRequestTabsStore();
  const removeItemDeep = useSidebarStore((s) => s.removeItemDeep);

  React.useEffect(() => {
    if (isSuccess) {
      // Update sidebar immediately
      removeItemDeep(id);
      onOpenChange(false);
    }
    if (isError) {
      console.error("Failed to delete collection");
    }
  }, [isSuccess, isError, onOpenChange, removeItemDeep, id]);

  const handleDelete = () => {
    // Rescue unsaved requests: Set collectionId to null for unsaved requests in this collection
    requests.forEach((req) => {
      if (req.collectionId === id && req.unsaved) {
        updateRequest(req.id, { collectionId: null });
        replaceTabData(req.id, { collectionId: null });
      }
    });

    deleteCollection();
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogTitle className="dark:text-destructive-foreground flex items-center gap-2">
          <IconAlertTriangleFilled className="size-5" />
          Are you sure? you want to delete this collection?
        </AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone, and all the requests inside this will be
          deleted and nested collections and requests inside theme will moved to
          one higher level.
        </AlertDialogDescription>
        <AlertDialogFooter>
          <Button
            variant="destructive"
            disabled={isPending}
            className="cursor-pointer"
            onClick={handleDelete}
          >
            {isPending && <Spinner />}
            Delete
          </Button>
          <AlertDialogCancel onClick={() => onOpenChange(false)} className="cursor-pointer">
            Cancel
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteCollection;
