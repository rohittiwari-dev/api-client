export type RequestMethod =
	| 'GET'
	| 'POST'
	| 'PUT'
	| 'PATCH'
	| 'DELETE'
	| 'HEAD'
	| 'OPTIONS';

export type RequestType =
	| 'api'
	| 'websocket'
	| 'socketio'
	| 'grpc'
	| 'graphql'
	| 'new';

export type AuthType =
	| 'none'
	| 'bearer'
	| 'basic'
	| 'api-key'
	| 'oauth2'
	| 'inherit';

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

export interface AuthConfig {
	type: AuthType;
	inherit?: boolean;
	bearer?: { token: string };
	basic?: { username: string; password: string };
	apiKey?: { key: string; value: string; addTo: 'header' | 'query' };
	oauth2?: {
		accessToken: string;
		refreshToken?: string;
		clientId?: string;
		clientSecret?: string;
	};
}

export interface HttpRequest {
	id: string;
	name: string;
	method: RequestMethod;
	url: string;
	headers: KeyValue[];
	queryParams: KeyValue[];
	body?: {
		type:
			| 'none'
			| 'json'
			| 'xml'
			| 'form-data'
			| 'x-www-form-urlencoded'
			| 'raw'
			| 'binary';
		content: string | FormData;
	};
	auth: AuthConfig;
	cookies: Cookie[];
	preRequestScript?: string;
	postResponseScript?: string;
}

export interface WebSocketMessage {
	id: string;
	name: string;
	event?: string;
	data: string;
	timestamp?: number;
}

export interface WebSocketRequest {
	id: string;
	name: string;
	url: string;
	protocols?: string[];
	headers: KeyValue[];
	messages: WebSocketMessage[];
	auth: AuthConfig;
}

export interface SocketIORequest {
	id: string;
	name: string;
	url: string;
	path?: string;
	namespace?: string;
	headers: KeyValue[];
	events: SocketIOEvent[];
	listeners: SocketIOListener[];
	auth: AuthConfig;
}

export interface SocketIOEvent {
	id: string;
	name: string;
	eventName: string;
	data: string;
	enabled: boolean;
}

export interface SocketIOListener {
	id: string;
	eventName: string;
	enabled: boolean;
	handler?: string;
}

export interface Cookie {
	id: string;
	name: string;
	value: string;
	domain: string;
	path: string;
	expires?: Date;
	httpOnly: boolean;
	secure: boolean;
	sameSite: 'Strict' | 'Lax' | 'None';
}

export interface RequestResponse {
	status: number;
	statusText: string;
	headers: Record<string, string>;
	data: any;
	time: number;
	size: number;
	cookies?: Cookie[];
}
