import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Collection } from '@/generated/prisma';
import { useAuthStore } from '@/modules/authentication/store';
import {
	createCollectionAction,
	deleteCollectionAction,
	getAllCollections,
	getAllCollectionsOnLevelOne,
	renameCollectionAction,
} from '../server/collection.action';
import { NestedCollection } from '../types/sidebar.types';

export function useCollectionsOnTopLevel(workspaceId: string) {
	return useQuery({
		queryKey: ['collections-top-level', workspaceId],
		queryFn: async () => getAllCollectionsOnLevelOne(workspaceId),
	});
}

export function useCollections(workspaceId: string, initialData?: any) {
	const { data: sessionData } = useAuthStore();
	return useQuery<NestedCollection[]>({
		queryKey: ['collections', workspaceId],
		queryFn: async () => {
			const { data } = await getAllCollections(
				workspaceId,
				sessionData?.session?.userId!,
			);
			if (!data) throw new Error('Failed to fetch collections');
			return data;
		},
		initialData,
	});
}

export function useCreateCollection(workspaceId: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({
			name,
			parentId,
		}: {
			name: string;
			parentId?: string;
		}) => createCollectionAction(name, workspaceId, parentId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['collections', workspaceId],
			});
			queryClient.invalidateQueries({
				queryKey: ['collections-top-level', workspaceId],
			});
		},
	});
}

export function useDeleteCollection(collectionId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async () => deleteCollectionAction(collectionId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['collections'],
			});
			queryClient.invalidateQueries({
				queryKey: ['collections-top-level'],
			});
		},
	});
}

export function useRenameCollection(collectionId: string, name: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async () => renameCollectionAction(collectionId, name),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['collections'],
			});
			queryClient.invalidateQueries({
				queryKey: ['collections-top-level'],
			});
		},
	});
}
