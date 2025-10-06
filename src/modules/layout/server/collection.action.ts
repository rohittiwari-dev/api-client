'use server';

import { revalidatePath } from 'next/cache';
import db from '@/lib/db';

export const createCollectionAction = async (
	name: string,
	workspaceId: string,
	parentID?: string,
) => {
	const collection = await db.collection.create({
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
	revalidatePath('/workspace/' + collection.workspace.slug);
};

export const renameCollectionAction = async (id: string, newName: string) => {
	await db.collection.update({
		where: { id },
		data: { name: newName },
	});
};

export const deleteCollectionAction = async (id: string) => {
	await db.collection.delete({
		where: { id },
	});
};
