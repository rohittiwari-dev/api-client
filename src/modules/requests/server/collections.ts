// app/actions/collections.ts
'use server';

import db from '@/lib/db';
import { currentUser } from '@/modules/authentication/server/auth.actions';
import {
	CollectionWithRelations,
	NestedCollection,
} from '../types/store.types';

export async function getAllCollections(workspaceId: string): Promise<{
	success: boolean;
	data?: NestedCollection[];
	error?: string;
}> {
	try {
		const user = await currentUser();
		if (!user) {
			return { success: false, error: 'Unauthorized' };
		}

		// Verify user has access to the workspace
		const workspaceAccess = await db.member.findFirst({
			where: {
				organizationId: workspaceId,
				userId: user?.user?.id,
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
		console.error('Error fetching collections:', error);
		return {
			success: false,
			error: 'Failed to fetch collections',
		};
	}
}

// Helper function to build nested structure from flat array
function buildNestedCollections(
	collections: CollectionWithRelations[],
	parentId: string | null = null,
): NestedCollection[] {
	return collections
		.filter((collection) => collection.parentId === parentId)
		.map((collection) => ({
			...collection,
			children: buildNestedCollections(collections, collection.id),
		}));
}
