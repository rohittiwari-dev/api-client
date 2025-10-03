export type RequestMethod =
	| 'GET'
	| 'POST'
	| 'PUT'
	| 'PATCH'
	| 'DELETE'
	| 'HEAD'
	| 'OPTIONS';

export type ContentType =
	| 'application/json'
	| 'application/xml'
	| 'application/x-www-form-urlencoded'
	| 'multipart/form-data'
	| 'text/plain'
	| 'text/html';

export interface KeyValue {
	id: string;
	key: string;
	value: string;
	enabled: boolean;
	description?: string;
}

/**
 * API Request Configuration
 */
export interface ApiRequestConfig {
	method: RequestMethod;
	url: string;
	headers: Header[];
	queryParams: Param[];
	pathParams: Param[];
	body: RequestBody;
	auth: AuthConfig | null;
}

export interface Header {
	key: string;
	value: string;
	enabled: boolean;
	description?: string;
}

export interface Param {
	key: string;
	value: string;
	enabled: boolean;
	description?: string;
}

export interface RequestBody {
	type:
		| 'none'
		| 'json'
		| 'form-data'
		| 'x-www-form-urlencoded'
		| 'raw'
		| 'binary'
		| 'graphql';
	content: any;
	options?: {
		raw?: {
			language?: string;
		};
	};
}

/**
 * Authentication Configuration
 */
export type AuthType =
	| 'none'
	| 'bearer'
	| 'basic'
	| 'api-key'
	| 'oauth2'
	| 'digest'
	| 'hawk'
	| 'aws-signature'
	| 'inherit';

export interface AuthConfig {
	type: AuthType;
	inherit?: boolean; // Inherit from parent (collection/folder)
	bearer?: {
		token: string;
	};
	basic?: {
		username: string;
		password: string;
	};
	apiKey?: {
		key: string;
		value: string;
		in: 'header' | 'query';
	};
	oauth2?: {
		grantType:
			| 'authorization_code'
			| 'client_credentials'
			| 'password'
			| 'implicit';
		accessToken?: string;
		tokenUrl?: string;
		authUrl?: string;
		clientId?: string;
		clientSecret?: string;
		scope?: string;
		redirectUrl?: string;
	};
}

/**
 * WebSocket Configuration
 */
export interface WebSocketConfig {
	url: string;
	protocols?: string[];
	headers: Header[];
	events: WebSocketEvent[];
	auth: AuthConfig | null;
}

export interface WebSocketEvent {
	id: string;
	name: string;
	data: any;
	enabled: boolean;
	order: number;
}

/**
 * SocketIO Configuration
 */
export interface SocketIOConfig {
	url: string;
	path?: string;
	transports?: ('websocket' | 'polling')[];
	headers: Header[];
	events: SocketIOEvent[];
	listeners: SocketIOListener[];
	auth: AuthConfig | null;
}

export interface SocketIOEvent {
	id: string;
	eventName: string;
	data: any;
	enabled: boolean;
	order: number;
}

export interface SocketIOListener {
	id: string;
	eventName: string;
	enabled: boolean;
}

/**
 * GraphQL Configuration
 */
export interface GraphQLConfig {
	url: string;
	query: string;
	variables?: Record<string, any>;
	headers: Header[];
	auth: AuthConfig | null;
}

/**
 * gRPC Configuration
 */
export interface GRPCConfig {
	url: string;
	protoFile: string;
	service: string;
	method: string;
	metadata: Header[];
	message: any;
	auth: AuthConfig | null;
}

/**
 * Environment Variables
 */
export interface EnvironmentVariable {
	key: string;
	value: string;
	type: 'default' | 'secret';
	enabled: boolean;
}

/**
 * Cookie Storage (Persisted Storage - Not in DB)
 */
export interface CookieStore {
	[domain: string]: Cookie[];
}

export interface Cookie {
	name: string;
	value: string;
	domain: string;
	path: string;
	expires?: number;
	httpOnly?: boolean;
	secure?: boolean;
	sameSite?: 'strict' | 'lax' | 'none';
}

/**
 * Response Types
 */
export interface ApiResponse {
	status: number;
	statusText: string;
	headers: Record<string, string>;
	body: any;
	duration: number; // ms
	size: number; // bytes
	timestamp: Date;
}

export interface WebSocketMessage {
	type: 'sent' | 'received';
	data: any;
	timestamp: Date;
}

export interface SocketIOMessage {
	type: 'sent' | 'received';
	eventName: string;
	data: any;
	timestamp: Date;
}

/**
 * Workspace & Collaboration
 */
export type WorkspaceRole = 'owner' | 'admin' | 'member' | 'viewer';

export interface WorkspaceInviteData {
	email: string;
	role: WorkspaceRole;
	workspaceId: string;
}

/**
 * Optimistic UI Update Types
 */
export interface OptimisticUpdate<T> {
	id: string;
	type: 'create' | 'update' | 'delete';
	data: T;
	timestamp: number;
}
