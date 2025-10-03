import {
	BodyType,
	Environment,
	HttpMethod,
	MessageType,
	Organization,
	RequestHistory,
	RequestMessage,
} from '@/generated/prisma';

// types/collection.ts
export interface CollectionWithRelations {
	id: string;
	name: string;
	description: string | null;
	parentId: string | null;
	workspaceId: string;
	createdAt: Date;
	updatedAt: Date;

	// Relations
	requests: RequestWithRelations[];
	environments: Environment[];
	children: CollectionWithRelations[];
	parent?: CollectionWithRelations | null;
	workspace: Organization;
}

export interface NestedCollection {
	id: string;
	name: string;
	description: string | null;
	parentId: string | null;
	workspaceId: string;
	createdAt: Date;
	updatedAt: Date;

	requests: RequestWithRelations[];
	environments: Environment[];
	children: NestedCollection[];
}

export interface RequestWithRelations {
	id: string;
	name: string;
	description: string | null;
	method: HttpMethod | null;
	url: string | null;
	type: RequestType;
	headers: any;
	parameters: any;
	body: any;
	bodyType: BodyType | null;
	auth: any;
	messageType: MessageType | null;
	createdAt: Date;
	updatedAt: Date;
	collectionId: string;

	messages: RequestMessage[];
	environments: Environment[];
	history: RequestHistory[];
}

export type RequestType = 'API' | 'WEBSOCKET' | 'SOCKET_IO';
