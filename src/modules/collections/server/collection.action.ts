'use server';

import { Collection } from '@/generated/prisma';
import db from '@/lib/db';
import {
	CollectionWithRelations,
	NestedCollection,
} from '../types/sidebar.types';
import { buildNestedCollections } from '../utils';

export async function getAllCollections(
	workspaceId: string,
	userId: string,
): Promise<{
	success: boolean;
	data?: NestedCollection[];
	error?: string;
}> {
	try {
		// Verify user has access to the workspace
		const workspaceAccess = await db.member.findFirst({
			where: {
				organizationId: workspaceId,
				userId: userId,
			},
		});

		if (!workspaceAccess) {
			return { success: false, error: 'No access to workspace' };
		}

		// Get all collections for the workspace
		const collections = await db.collection.findMany({
			where: {
				workspaceId,
			},
			include: {
				requests: {
					include: {
						messages: true,
						history: {
							orderBy: { timestamp: 'desc' },
							take: 5, // Last 5 history entries
						},
					},
					orderBy: { createdAt: 'asc' },
				},
				children: {
					include: {
						requests: {
							include: {
								messages: true,
								history: {
									orderBy: { timestamp: 'desc' },
									take: 5,
								},
							},
							orderBy: { createdAt: 'asc' },
						},
						children: {
							include: {
								requests: {
									include: {
										messages: true,
										history: {
											orderBy: { timestamp: 'desc' },
											take: 5,
										},
									},
									orderBy: { createdAt: 'asc' },
								},
								children: true,
							},
						},
					},
				},
			},
			orderBy: { createdAt: 'asc' },
		});

		// Build nested structure
		const nestedCollections = buildNestedCollections(
			collections as unknown as CollectionWithRelations[],
		);

		return {
			success: true,
			data: nestedCollections,
		};
	} catch (error) {
		return {
			success: false,
			error: 'Failed to fetch collections',
		};
	}
}

export const createCollectionAction = async (
	name: string,
	workspaceId: string,
	parentID?: string,
) => {
	return await db.collection.create({
		data: {
			name,
			workspaceId,
			...(parentID && { parentId: parentID }),
			createdAt: new Date(),
		},
		include: {
			workspace: true,
		},
	});
};

export const renameCollectionAction = async (id: string, newName: string) => {
	return await db.collection.update({
		where: { id },
		data: { name: newName },
	});
};

export const deleteCollectionAction = async (id: string) => {
	return await db.collection.delete({
		where: { id },
	});
};

export const getAllCollectionsOnLevelOne = async (
	workspaceId: string,
): Promise<Collection[]> => {
	const collections = await db.collection.findMany({
		where: {
			workspaceId,
		},
		orderBy: { createdAt: 'desc' },
		include: {
			children: true,
			parent: true,
		},
	});

	// Flatten all collections to top level
	const flattenedCollections = new Map();

	const flatten = (collection: any) => {
		if (!flattenedCollections.has(collection.id)) {
			flattenedCollections.set(collection.id, {
				...collection,
				children: [],
				parent: null,
				parentId: null,
			});
		}

		if (collection.children && collection.children.length > 0) {
			collection.children.forEach((child: any) => flatten(child));
		}
	};

	collections.forEach((collection) => flatten(collection));

	return Array.from(flattenedCollections.values());
};
