import {
	BodyType,
	Environment,
	HttpMethod,
	MessageType,
	RequestHistory,
	RequestMessage,
} from '@/generated/prisma';

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
