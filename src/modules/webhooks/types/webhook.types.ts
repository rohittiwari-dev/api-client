// Webhook types

export interface Webhook {
  id: string;
  name: string;
  description?: string | null;
  url: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  workspaceId: string;
}

export interface WebhookEvent {
  id: string;
  webhookId: string;
  method: string;
  headers: Record<string, string>;
  body: unknown;
  bodyRaw?: string | null;
  searchParams?: Record<string, string> | null;
  ip?: string | null;
  userAgent?: string | null;
  contentType?: string | null;
  size: number;
  createdAt: Date;
}

export interface CreateWebhookInput {
  name: string;
  description?: string;
  workspaceId: string;
  userId: string;
}

export interface UpdateWebhookInput {
  name?: string;
  description?: string;
}

// Realtime event types
export interface WebhookRealtimeEvent {
  type: "NEW_EVENT" | "WEBHOOK_CREATED" | "WEBHOOK_DELETED";
  workspaceId: string;
  webhookId: string;
  data: WebhookEvent | Webhook;
}
