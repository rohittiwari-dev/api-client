import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import crypto from 'crypto';

// Auth type definitions
interface AuthConfig {
    type: 'NONE' | 'BASIC' | 'BEARER' | 'API_KEY' | 'DIGEST' | 'OAUTH1' | 'OAUTH2';
    data?: Record<string, any>;
}

/**
 * Compute MD5 hash
 */
function md5(str: string): string {
    return crypto.createHash('md5').update(str).digest('hex');
}

/**
 * Compute HMAC-SHA1 signature and return as base64
 */
function hmacSha1(key: string, data: string): string {
    return crypto.createHmac('sha1', key).update(data).digest('base64');
}

/**
 * Build OAuth 1.0 signature base string
 */
function buildOAuthSignatureBase(
    method: string,
    url: string,
    params: Record<string, string>
): string {
    const sortedParams = Object.keys(params)
        .sort()
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');

    const baseUrl = url.split('?')[0];
    return `${method.toUpperCase()}&${encodeURIComponent(baseUrl)}&${encodeURIComponent(sortedParams)}`;
}

/**
 * Process authentication and return Authorization header
 */
function processAuth(
    auth: AuthConfig | undefined,
    method: string,
    url: string
): { header?: string; queryParams?: Record<string, string> } {
    if (!auth || auth.type === 'NONE' || !auth.data) {
        return {};
    }

    const data = auth.data;

    switch (auth.type) {
        case 'BASIC': {
            if (data.username) {
                const credentials = Buffer.from(`${data.username}:${data.password || ''}`).toString('base64');
                return { header: `Basic ${credentials}` };
            }
            break;
        }
        case 'BEARER': {
            if (data.token) {
                return { header: `Bearer ${data.token}` };
            }
            break;
        }
        case 'API_KEY': {
            if (data.key && data.value) {
                if (data.addTo === 'query') {
                    return { queryParams: { [data.key]: data.value } };
                } else {
                    // Return as custom header - handled separately
                    return { header: `__API_KEY__:${data.key}:${data.value}` };
                }
            }
            break;
        }
        case 'DIGEST': {
            if (data.username && data.password) {
                const uri = new URL(url).pathname;
                const realm = data.realm || '';
                const nonce = data.nonce || '';
                const algorithm = data.algorithm || 'MD5';
                const qop = data.qop || 'auth';
                const nc = data.nc || '00000001';
                const cnonce = data.cnonce || crypto.randomUUID().replace(/-/g, '').substring(0, 16);
                const opaque = data.opaque || '';

                // Compute response hash
                const ha1 = md5(`${data.username}:${realm}:${data.password}`);
                const ha2 = md5(`${method}:${uri}`);
                const response = md5(`${ha1}:${nonce}:${nc}:${cnonce}:${qop}:${ha2}`);

                const digestParts = [
                    `username="${data.username}"`,
                    `realm="${realm}"`,
                    `nonce="${nonce}"`,
                    `uri="${uri}"`,
                    `algorithm=${algorithm}`,
                    `qop=${qop}`,
                    `nc=${nc}`,
                    `cnonce="${cnonce}"`,
                    `response="${response}"`,
                ];
                if (opaque) digestParts.push(`opaque="${opaque}"`);
                return { header: `Digest ${digestParts.join(', ')}` };
            }
            break;
        }
        case 'OAUTH1': {
            if (data.consumerKey) {
                const consumerSecret = data.consumerSecret || '';
                const token = data.token || '';
                const tokenSecret = data.tokenSecret || '';
                const signatureMethod = data.signatureMethod || 'HMAC-SHA1';
                const timestamp = data.timestamp || Math.floor(Date.now() / 1000).toString();
                const nonce = data.nonce || crypto.randomUUID().replace(/-/g, '');
                const version = data.version || '1.0';
                const realm = data.realm || '';

                // Build OAuth params for signature
                const oauthParams: Record<string, string> = {
                    oauth_consumer_key: data.consumerKey,
                    oauth_nonce: nonce,
                    oauth_signature_method: signatureMethod,
                    oauth_timestamp: timestamp,
                    oauth_version: version,
                };
                if (token) oauthParams.oauth_token = token;

                // Compute signature
                const signatureBase = buildOAuthSignatureBase(method, url, oauthParams);
                const signingKey = `${encodeURIComponent(consumerSecret)}&${encodeURIComponent(tokenSecret)}`;
                const signature = hmacSha1(signingKey, signatureBase);

                // Build header
                const oauthParts = [
                    `oauth_consumer_key="${encodeURIComponent(data.consumerKey)}"`,
                    `oauth_nonce="${nonce}"`,
                    `oauth_signature="${encodeURIComponent(signature)}"`,
                    `oauth_signature_method="${signatureMethod}"`,
                    `oauth_timestamp="${timestamp}"`,
                    `oauth_version="${version}"`,
                ];
                if (token) oauthParts.push(`oauth_token="${encodeURIComponent(token)}"`);
                if (realm) oauthParts.unshift(`realm="${realm}"`);
                return { header: `OAuth ${oauthParts.join(', ')}` };
            }
            break;
        }
        case 'OAUTH2': {
            if (data.accessToken) {
                return { header: `Bearer ${data.accessToken}` };
            }
            break;
        }
    }

    return {};
}

export async function POST(req: NextRequest) {
    try {
        const { url, method, headers, body, cookies, auth } = await req.json();

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        let finalUrl = url;

        // Prepare headers
        const requestHeaders: Record<string, string> = {
            'User-Agent': 'API-Client/1.0',
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive'
        };

        // Merge user headers
        if (headers && typeof headers === 'object') {
            Object.entries(headers).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    requestHeaders[key] = String(value);
                }
            });
        }

        // Process authentication
        const authResult = processAuth(auth, method || 'GET', finalUrl);
        if (authResult.header) {
            // Handle API Key special case
            if (authResult.header.startsWith('__API_KEY__:')) {
                const parts = authResult.header.split(':');
                requestHeaders[parts[1]] = parts[2];
            } else {
                requestHeaders['Authorization'] = authResult.header;
            }
        }
        if (authResult.queryParams) {
            const urlObj = new URL(finalUrl);
            Object.entries(authResult.queryParams).forEach(([key, value]) => {
                urlObj.searchParams.append(key, value);
            });
            finalUrl = urlObj.toString();
        }

        // Add cookies
        if (cookies && Array.isArray(cookies)) {
            const cookieString = cookies
                .map((c: any) => `${c.key}=${c.value}`)
                .join('; ');
            if (cookieString) {
                requestHeaders['Cookie'] = cookieString;
            }
        }

        const startTime = Date.now();

        // Prepare body
        let requestBody = body;

        // Handle special FormData reconstruction
        const contentType = requestHeaders['Content-Type'];
        if (contentType && contentType.includes('multipart/form-data') && typeof body === 'string') {
            try {
                const parsed = JSON.parse(body);
                if (parsed.formData && Array.isArray(parsed.formData)) {
                    const formData = new FormData();

                    for (const item of parsed.formData) {
                        if (item.type === 'FILE') {
                            if (item.value && typeof item.value === 'string' && item.value.includes('base64,')) {
                                const base64Data = item.value.split('base64,')[1];
                                const buffer = Buffer.from(base64Data, 'base64');
                                const blob = new Blob([buffer]);
                                formData.append(item.key, blob, item.fileName || 'file');
                            }
                        } else {
                            formData.append(item.key, item.value || '');
                        }
                    }

                    requestBody = formData;
                    delete requestHeaders['Content-Type'];
                }
            } catch (e) {
                console.warn('Failed to reconstruct FormData in proxy', e);
            }
        }

        // Axios request
        const response = await axios({
            method: method || 'GET',
            url: finalUrl,
            headers: requestHeaders,
            data: requestBody,
            validateStatus: () => true,
            responseType: 'arraybuffer',
            transformResponse: [(data) => data]
        });

        const endTime = Date.now();
        const time = endTime - startTime;

        // Process response body
        let responseBody: any = response.data;

        const responseContentType = response.headers['content-type'] || '';
        const isText = responseContentType.includes('text') ||
            responseContentType.includes('json') ||
            responseContentType.includes('xml') ||
            responseContentType.includes('javascript') ||
            responseContentType.includes('html');

        if (isText && Buffer.isBuffer(responseBody)) {
            responseBody = responseBody.toString('utf-8');
            try {
                responseBody = JSON.parse(responseBody);
            } catch {
                // Keep as string
            }
        } else if (Buffer.isBuffer(responseBody)) {
            responseBody = responseBody.toString('utf-8');
            try {
                responseBody = JSON.parse(responseBody);
            } catch {
                // Keep as string
            }
        }

        // Normalize headers
        const responseHeaders: Record<string, string> = {};
        Object.entries(response.headers).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                responseHeaders[key] = value.join(', ');
            } else {
                responseHeaders[key] = String(value);
            }
        });

        // Calculate size
        let size = 0;
        if (response.headers['content-length']) {
            size = parseInt(response.headers['content-length'] as string, 10);
        } else if (response.data) {
            size = Buffer.isBuffer(response.data) ? response.data.length : String(response.data).length;
        }

        return NextResponse.json({
            status: response.status,
            statusText: response.statusText,
            headers: responseHeaders,
            body: responseBody,
            time,
            size,
            setCookie: response.headers['set-cookie'],
            requestHeaders: response.config.headers
        });

    } catch (error: any) {
        console.error('Proxy Request Error:', error.message);
        return NextResponse.json({
            error: error.message || 'Internal Server Error',
            status: 500,
            statusText: 'Internal Server Error',
            headers: {},
            body: null,
            time: 0,
            size: 0
        }, { status: 500 });
    }
}
