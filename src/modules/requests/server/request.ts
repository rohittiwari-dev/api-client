'use server';

import { Request } from '@/generated/prisma';
import db from '@/lib/db';

export const getAllRequests = async (workspace: string) => {
	return await db.request.findMany({
		where: {
			collection: {
				workspaceId: workspace,
			},
		},
		include: {
			history: true,
			messages: true,
		},
	});
};

export const getRequestById = async (id: string, workspace: string) => {
	return await db.request.findUnique({
		where: { id, collection: { workspaceId: workspace } },
		include: {
			history: true,
			messages: true,
		},
	});
};

export const createRequest = async (data: Request) => {
	return await db.request.create({
		data: {
			name: data.name,
			url: data.url,
			method: data.method,
			headers: (data.headers || []) as any,
			parameters: (data.parameters || []) as any,
			body: data.body || undefined,
			collectionId: data.collectionId,
			auth: data.auth || undefined,
			bodyType: data.bodyType || undefined,
			createdAt: new Date(),
			updatedAt: new Date(),
			type: data.type,
			messageType: data.messageType,
			id: data.id,
		},
		include: {
			history: true,
			messages: true,
		},
	});
};

export const updateRequest = async (
	id: string,
	data: Partial<Request>,
	workspace: string,
) => {
	const { collectionId, ...updateData } = data;
	return await db.request.update({
		where: { id, collection: { workspaceId: workspace, id: collectionId } },
		data: {
			...updateData,
			headers: (data.headers || []) as any,
			parameters: (data.parameters || []) as any,
			body: data.body || undefined,
			auth: data.auth || undefined,
			updatedAt: new Date(),
		},
	});
};

export const deleteRequest = async (id: string, workspace: string) => {
	return await db.request.delete({
		where: { id, collection: { workspaceId: workspace } },
	});
};
