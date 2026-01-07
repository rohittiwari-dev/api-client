import { NextRequest, NextResponse } from "next/server";
import redis from "@/lib/redis";

// Configuration
const MAX_EVENTS_PER_HOOK = 100; // Maximum stored events per hookId
const EVENT_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days TTL

interface WebhookEvent {
  id: string;
  hookId: string;
  timestamp: string;
  method: string;
  url: string;
  pathname: string;
  searchParams: Record<string, string>;
  headers: Record<string, string>;
  body: unknown;
  bodyRaw: string | null;
  contentType: string | null;
  ip: string | null;
  userAgent: string | null;
  size: number;
}

// Context parameter type for dynamic routes
type RouteContext = {
  params: Promise<{ hookId: string }>;
};

/**
 * Parse request body based on content type
 */
async function parseBody(
  req: NextRequest
): Promise<{ parsed: unknown; raw: string | null }> {
  const contentType = req.headers.get("content-type") || "";

  try {
    const text = await req.text();

    if (!text) {
      return { parsed: null, raw: null };
    }

    // Try JSON parsing
    if (contentType.includes("application/json")) {
      try {
        return { parsed: JSON.parse(text), raw: text };
      } catch {
        return { parsed: text, raw: text };
      }
    }

    // Form URL encoded
    if (contentType.includes("application/x-www-form-urlencoded")) {
      const params = new URLSearchParams(text);
      const parsed: Record<string, string> = {};
      params.forEach((value, key) => {
        parsed[key] = value;
      });
      return { parsed, raw: text };
    }

    // XML/HTML
    if (contentType.includes("xml") || contentType.includes("html")) {
      return { parsed: text, raw: text };
    }

    // Default: try JSON, fallback to text
    try {
      return { parsed: JSON.parse(text), raw: text };
    } catch {
      return { parsed: text, raw: text };
    }
  } catch {
    return { parsed: null, raw: null };
  }
}

/**
 * Extract headers as a plain object
 */
function extractHeaders(headers: Headers): Record<string, string> {
  const result: Record<string, string> = {};
  headers.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

/**
 * Extract search params as a plain object
 */
function extractSearchParams(
  searchParams: URLSearchParams
): Record<string, string> {
  const result: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

/**
 * Generate a unique event ID
 */
function generateEventId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Store webhook event in Redis
 */
async function storeWebhookEvent(event: WebhookEvent): Promise<void> {
  const listKey = `webhook:${event.hookId}:events`;
  const eventKey = `webhook:${event.hookId}:event:${event.id}`;

  // Store the full event
  await redis.setex(eventKey, EVENT_TTL_SECONDS, JSON.stringify(event));

  // Add to the list (prepend for newest first)
  await redis.lpush(listKey, event.id);

  // Trim to max events
  await redis.ltrim(listKey, 0, MAX_EVENTS_PER_HOOK - 1);

  // Set TTL on the list
  await redis.expire(listKey, EVENT_TTL_SECONDS);
}

/**
 * Get all webhook events for a hookId
 */
async function getWebhookEvents(hookId: string): Promise<WebhookEvent[]> {
  const listKey = `webhook:${hookId}:events`;
  const eventIds = await redis.lrange(listKey, 0, -1);

  if (!eventIds.length) {
    return [];
  }

  const events: WebhookEvent[] = [];
  for (const eventId of eventIds) {
    const eventKey = `webhook:${hookId}:event:${eventId}`;
    const eventData = await redis.get(eventKey);
    if (eventData) {
      events.push(JSON.parse(eventData));
    }
  }

  return events;
}

/**
 * Clear all webhook events for a hookId
 */
async function clearWebhookEvents(hookId: string): Promise<number> {
  const listKey = `webhook:${hookId}:events`;
  const eventIds = await redis.lrange(listKey, 0, -1);

  let deleted = 0;
  for (const eventId of eventIds) {
    const eventKey = `webhook:${hookId}:event:${eventId}`;
    deleted += await redis.del(eventKey);
  }
  await redis.del(listKey);

  return deleted;
}

/**
 * Handle incoming webhook - common handler for all methods
 */
async function handleWebhook(
  req: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    const { hookId } = await context.params;
    const { parsed: body, raw: bodyRaw } = await parseBody(req);

    const headers = extractHeaders(req.headers);
    const searchParams = extractSearchParams(req.nextUrl.searchParams);

    const event: WebhookEvent = {
      id: generateEventId(),
      hookId,
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      pathname: req.nextUrl.pathname,
      searchParams,
      headers,
      body,
      bodyRaw,
      contentType: req.headers.get("content-type"),
      ip:
        req.headers.get("x-forwarded-for") ||
        req.headers.get("x-real-ip") ||
        null,
      userAgent: req.headers.get("user-agent"),
      size: bodyRaw?.length || 0,
    };

    // Store the event
    await storeWebhookEvent(event);

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Webhook received",
        eventId: event.id,
        hookId,
        timestamp: event.timestamp,
      },
      {
        status: 200,
        headers: {
          "X-Webhook-Event-Id": event.id,
          "X-Webhook-Hook-Id": hookId,
        },
      }
    );
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}

/**
 * GET - Retrieve stored webhook events for a hookId
 */
export async function GET(
  req: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    const { hookId } = await context.params;
    const events = await getWebhookEvents(hookId);

    return NextResponse.json({
      success: true,
      hookId,
      count: events.length,
      events,
    });
  } catch (error) {
    console.error("GET webhook events error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve events",
      },
      { status: 500 }
    );
  }
}

/**
 * POST - Receive webhook event
 */
export async function POST(
  req: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  return handleWebhook(req, context);
}

/**
 * PUT - Receive webhook event
 */
export async function PUT(
  req: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  return handleWebhook(req, context);
}

/**
 * PATCH - Receive webhook event
 */
export async function PATCH(
  req: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  return handleWebhook(req, context);
}

/**
 * DELETE - Clear webhook events OR receive webhook event
 * If query param ?clear=true, clears all events. Otherwise, treats as incoming webhook.
 */
export async function DELETE(
  req: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    const { hookId } = await context.params;
    const shouldClear = req.nextUrl.searchParams.get("clear") === "true";

    if (shouldClear) {
      const deleted = await clearWebhookEvents(hookId);
      return NextResponse.json({
        success: true,
        message: "Webhook events cleared",
        hookId,
        deleted,
      });
    }

    // Otherwise, treat as incoming webhook
    return handleWebhook(req, context);
  } catch (error) {
    console.error("DELETE webhook error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process request",
      },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS - Handle CORS preflight
 */
export async function OPTIONS(
  req: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  const { hookId } = await context.params;

  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Max-Age": "86400",
      "X-Webhook-Hook-Id": hookId,
    },
  });
}

/**
 * HEAD - Check if hookId exists
 */
export async function HEAD(
  req: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    const { hookId } = await context.params;
    const events = await getWebhookEvents(hookId);

    return new NextResponse(null, {
      status: 200,
      headers: {
        "X-Webhook-Hook-Id": hookId,
        "X-Webhook-Event-Count": events.length.toString(),
      },
    });
  } catch {
    return new NextResponse(null, { status: 500 });
  }
}
