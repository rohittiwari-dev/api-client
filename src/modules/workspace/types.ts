import { Environment } from '@/lib/utils';
import {
	AuthConfig,
	HttpRequest,
	RequestType,
	SocketIORequest,
	WebSocketRequest,
} from '../requests/types/core.types';

export interface Workspace {
	id: string;
	name: string;
	description?: string;
	ownerId: string;
	members: WorkspaceMember[];
	collections: Collection[];
	environments: Environment[];
	createdAt: Date;
	updatedAt: Date;
}

export interface WorkspaceMember {
	id: string;
	userId: string;
	workspaceId: string;
	role: 'owner' | 'admin' | 'editor' | 'viewer';
	invitedAt: Date;
}

export interface Collection {
	id: string;
	name: string;
	description?: string;
	workspaceId: string;
	parentId?: string;
	auth?: AuthConfig;
	items: CollectionItem[];
	folders: Collection[];
	order: number;
}

export interface CollectionItem {
	id: string;
	type: RequestType;
	request: HttpRequest | WebSocketRequest | SocketIORequest;
	collectionId: string;
	order: number;
}
