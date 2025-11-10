import React from 'react';
import { IconSend } from '@tabler/icons-react';
import { CircleDot, Loader2, SaveIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { InputGroup } from '@/components/ui/input-group';
import { EnvironmentVariableInput } from '@/components/ui/environment-variable-input';
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from '@/components/ui/resizable';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { cn, requestBgColorMap } from '@/lib/utils';
import { substituteVariables, substituteVariablesInObject } from '@/lib/utils/substituteVariables';
import ApiResponse from '@/modules/response/components/api-response';
import useRequestStore from '../store/request.store';
import useRequestTabsStore from '../store/tabs.store';
import useResponseStore from '@/modules/response/store/response.store';
import useCookieStore from '@/modules/cookies/store/cookie.store';
import useEnvironmentStore from '@/modules/environment/store/environment.store';
import BodyComponent from './api-request-components/body-component';
import HeaderComponent from './api-request-components/header-component';
import ParameterComponent from './api-request-components/parameter-component';
import AuthComponent from './api-request-components/auth-component';
import { useUpsertRequest } from '../hooks/queries';
import type { RequestStateInterface } from '../types/request.types';
import { BodyType, HttpMethod } from '@/generated/prisma/browser';

/**
 * Parse Set-Cookie header string into cookie object
 */
function parseSetCookie(setCookieStr: string, defaultDomain: string) {
	const parts = setCookieStr.split(';').map((p) => p.trim());
	const [keyVal, ...attributes] = parts;
	const [key, ...valueParts] = keyVal.split('=');
	const value = valueParts.join('='); // Handle values with = in them

	const cookie: {
		key: string;
		value: string;
		domain: string;
		path: string;
		expires?: string;
		secure?: boolean;
		httpOnly?: boolean;
	} = {
		key: key.trim(),
		value: value.trim(),
		domain: defaultDomain,
		path: '/',
	};

	// Parse attributes
	for (const attr of attributes) {
		const [attrKey, attrVal] = attr.split('=');
		const attrKeyLower = attrKey.toLowerCase().trim();

		if (attrKeyLower === 'path' && attrVal) {
			cookie.path = attrVal.trim();
		} else if (attrKeyLower === 'domain' && attrVal) {
			cookie.domain = attrVal.trim().replace(/^\./, '');
		} else if (attrKeyLower === 'expires' && attrVal) {
			cookie.expires = attrVal.trim();
		} else if (attrKeyLower === 'secure') {
			cookie.secure = true;
		} else if (attrKeyLower === 'httponly') {
			cookie.httpOnly = true;
		}
	}

	return cookie;
}

/**
 * Compute HMAC-SHA1 signature (for OAuth 1.0)
 */
async function hmacSha1(key: string, message: string): Promise<string> {
	const encoder = new TextEncoder();
	const keyData = encoder.encode(key);
	const messageData = encoder.encode(message);

	const cryptoKey = await crypto.subtle.importKey(
		'raw',
		keyData,
		{ name: 'HMAC', hash: 'SHA-1' },
		false,
		['sign']
	);

	const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
	// Convert to base64
	const signatureArray = new Uint8Array(signature);
	let binary = '';
	signatureArray.forEach(byte => binary += String.fromCharCode(byte));
	return btoa(binary);
}

/**
 * Generate OAuth 1.0 signature base string
 */
function buildOAuthSignatureBase(
	method: string,
	url: string,
	params: Record<string, string>
): string {
	// Sort params alphabetically and encode
	const sortedParams = Object.keys(params)
		.sort()
		.map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
		.join('&');

	// Build base string: METHOD&URL&PARAMS (all percent-encoded)
	const baseUrl = url.split('?')[0];
	return `${method.toUpperCase()}&${encodeURIComponent(baseUrl)}&${encodeURIComponent(sortedParams)}`;
}

const ApiRequestComponent = () => {
	const { activeTab, replaceTabData } = useRequestTabsStore();
	const { activeRequest, updateRequest } = useRequestStore();
	const { setResponse, setLoading, setError, getResponse, setActualRequest } = useResponseStore();
	const { getCookiesForDomain, addCookie } = useCookieStore();
	const { getVariablesAsRecord } = useEnvironmentStore();
	const [requestInfoTab, setRequestInfoTab] = useLocalStorage(
		'api-client-request-active-data-tab',
		'parameters',
	);
	const [isSaving, setIsSaving] = React.useState(false);
	const [isSending, setIsSending] = React.useState(false);

	// Upsert mutation with query invalidation
	const upsertMutation = useUpsertRequest(activeRequest?.workspaceId || '', {
		onSuccess: () => {
			if (activeRequest?.id) {
				updateRequest(activeRequest.id, { unsaved: false });
				replaceTabData(activeRequest.id, { unsaved: false });
			}
			toast.success('Request saved successfully');
			setIsSaving(false);
		},
		onError: (error) => {
			console.error('Failed to save request', error);
			toast.error('Failed to save request');
			setIsSaving(false);
		},
	});

	// Ctrl+S handler for saving
	React.useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.ctrlKey || e.metaKey) && e.key === 's') {
				e.preventDefault();
				handleSave();
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [activeRequest]);

	const handleSend = async () => {
		if (!activeRequest?.url || !activeRequest.id || isSending) return;

		setIsSending(true);
		setLoading(activeRequest.id, true);
		setError(activeRequest.id, '');

		try {
			// Get environment variables for substitution
			const envVariables = getVariablesAsRecord();

			// Substitute variables in URL
			let finalUrl = substituteVariables(activeRequest.url, envVariables);

			// Build URL with query parameters
			// Build URL with query parameters & Auth params
			try {
				const url = new URL(finalUrl);
				const activeParams = activeRequest.parameters?.filter((p) => p.isActive && p.key) || [];

				activeParams.forEach((p) => {
					const key = substituteVariables(p.key, envVariables);
					const value = substituteVariables(p.value, envVariables);
					url.searchParams.append(key, value);
				});

				finalUrl = url.toString();
			} catch (e) {
				// Invalid URL
			}

			// Prepare headers with variable substitution
			const defaultHeaders: Record<string, string> = {
				'User-Agent': 'API-Client/1.0',
				'Accept': '*/*',
				'Accept-Encoding': 'gzip, deflate, br',
				'Connection': 'keep-alive',
			};

			try {
				const urlObj = new URL(finalUrl);
				defaultHeaders['Host'] = urlObj.host;
			} catch (e) {
				// Invalid URL, ignore host header
			}

			// Add a unique request token similar to Postman-Token
			defaultHeaders['API-Client-Token'] = crypto.randomUUID();

			const headers: Record<string, string> = { ...defaultHeaders };

			activeRequest.headers?.forEach((h) => {
				if (h.isActive && h.key) {
					const key = substituteVariables(h.key, envVariables);
					const value = substituteVariables(h.value, envVariables);
					headers[key] = value;
				}
			});

			// Prepare auth config with variable substitution for proxy
			let authConfig: { type: string; data: Record<string, unknown> } | null = null;
			if (activeRequest.auth?.type && activeRequest.auth.type !== 'NONE' && activeRequest.auth.data) {
				// Substitute variables in auth data
				const authData: Record<string, unknown> = { ...activeRequest.auth.data as Record<string, unknown> };
				for (const key of Object.keys(authData)) {
					if (typeof authData[key] === 'string') {
						authData[key] = substituteVariables(authData[key] as string, envVariables);
					}
				}
				authConfig = {
					type: activeRequest.auth.type,
					data: authData,
				};
			}

			// Prepare body based on bodyType
			let body: any = undefined;
			const method = activeRequest.method || 'GET';

			// Prepare body based on bodyType
			const bodyType = activeRequest.bodyType;

			switch (bodyType) {
				case BodyType.JSON:
					if (activeRequest.body?.json) {
						// Substitute variables in JSON body
						const jsonBody = substituteVariablesInObject(activeRequest.body.json, envVariables);
						body = JSON.stringify(jsonBody);
						if (!headers['Content-Type']) {
							headers['Content-Type'] = 'application/json';
						}
					}
					break;

				case BodyType.RAW:
					if (activeRequest.body?.raw) {
						body = substituteVariables(activeRequest.body.raw, envVariables);
					}
					break;

				case BodyType.FORM_DATA:
					if (activeRequest.body?.formData) {
						// For form-data, we send as JSON to proxy which will handle it
						// We need to handle file uploads by converting to base64
						const formData: Array<{ key: string; value: string; type: string; fileName?: string }> = [];

						const readFileAsBase64 = (file: File): Promise<string> => {
							return new Promise((resolve, reject) => {
								const reader = new FileReader();
								reader.onload = () => resolve(reader.result as string);
								reader.onerror = reject;
								reader.readAsDataURL(file);
							});
						};

						const processFormData = async () => {
							for (const f of activeRequest.body.formData) {
								if (f.isActive && f.key) {
									const key = substituteVariables(f.key, envVariables);

									if (f.type === 'FILE' && f.file) {
										try {
											const base64Details = await readFileAsBase64(f.file);
											formData.push({
												key,
												value: base64Details,
												type: 'FILE',
												fileName: f.value // Filename stored in value
											});
										} catch (e) {
											console.error('Failed to read file', e);
										}
									} else {
										const value = substituteVariables(f.value, envVariables);
										formData.push({
											key,
											value,
											type: 'TEXT'
										});
									}
								}
							}
						};

						await processFormData();

						body = JSON.stringify({ formData });
						if (!headers['Content-Type']) {
							headers['Content-Type'] = 'multipart/form-data';
						}
					}
					break;

				case BodyType.X_WWW_FORM_URLENCODED:
					if (activeRequest.body?.urlEncoded) {
						const params = new URLSearchParams();
						activeRequest.body.urlEncoded
							.filter((f) => f.isActive && f.key)
							.forEach((f) => {
								const key = substituteVariables(f.key, envVariables);
								const value = substituteVariables(f.value, envVariables);
								params.append(key, value);
							});
						body = params.toString();
						if (!headers['Content-Type']) {
							headers['Content-Type'] = 'application/x-www-form-urlencoded';
						}
					}
					break;
			}

			// Calculate Content-Length if body exists and header not set
			if (body && !headers['Content-Length']) {
				try {
					const textEncoder = new TextEncoder();
					const length = typeof body === 'string' ? textEncoder.encode(body).length : 0; // Approximate for string
					if (activeRequest.bodyType !== BodyType.FORM_DATA) {
						headers['Content-Length'] = length.toString();
					}
				} catch (e) {
					// Ignore
				}
			}

			// Get cookies for domain
			let domain = '';
			try {
				domain = new URL(finalUrl).hostname;
			} catch {
				throw new Error('Invalid URL');
			}
			const requestCookies = getCookiesForDomain(domain);

			// Store the actual request being sent
			const actualRequest = {
				url: finalUrl,
				method: method,
				headers,
				body,
				cookies: requestCookies,
				auth: authConfig,
			};
			setActualRequest(activeRequest.id, actualRequest);

			const res = await fetch('/api/proxy', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(actualRequest),
			});

			const data = await res.json();

			if (data.error) {
				setError(activeRequest.id, data.error);
			} else {
				setResponse(activeRequest.id, {
					status: data.status,
					statusText: data.statusText,
					headers: data.headers,
					body: data.body,
					time: data.time,
					size: data.size,
					setCookie: data.setCookie, // Store raw setCookie (array or string)
					loading: false,
					error: null,
				});

				// Handle Set-Cookie headers (can be multiple)
				// Prioritize the raw array from proxy if available to avoid comma splitting issues
				const setCookieData = data.setCookie || data.headers?.['set-cookie'];

				if (setCookieData) {
					// Handle multiple cookies (array or single string)
					const cookieStrings = Array.isArray(setCookieData)
						? setCookieData
						: [setCookieData];

					for (const cookieStr of cookieStrings) {
						try {
							const cookie = parseSetCookie(cookieStr, domain);
							if (cookie.key && cookie.value) {
								addCookie(cookie);
							}
						} catch (e) {
							console.warn('Failed to parse Set-Cookie:', cookieStr);
						}
					}
				}

				// Update Actual Request with real headers sent by Proxy (if available)
				if (data.requestHeaders) {
					const updatedActualRequest = {
						...actualRequest,
						headers: data.requestHeaders as Record<string, string>
					};
					setActualRequest(activeRequest.id, updatedActualRequest);
				}
			}
		} catch (err: any) {
			setError(activeRequest.id, err.message || 'Failed to send request');
		} finally {
			setLoading(activeRequest.id, false);
			setIsSending(false);
		}
	};

	const handleSave = () => {
		if (!activeRequest?.id || isSaving || upsertMutation.isPending) return;
		setIsSaving(true);

		upsertMutation.mutate({
			requestId: activeRequest.id,
			name: activeRequest.name,
			url: activeRequest.url || "",
			workspaceId: activeRequest.workspaceId,
			collectionId: activeRequest.collectionId,
			type: 'API',
			method: activeRequest.method,
			headers: activeRequest.headers,
			parameters: activeRequest.parameters,
			body: activeRequest.body,
			bodyType: activeRequest.bodyType,
			auth: activeRequest.auth,
			savedMessages: activeRequest.savedMessages ?? [],
		});
	};

	const isUnsaved = activeRequest?.unsaved ?? false;

	// Use responses from store directly for proper reactivity
	const { responses } = useResponseStore();
	const currentResponse = activeRequest?.id ? responses[activeRequest.id] : null;
	const isLoading = currentResponse?.loading || false;

	return (
		<div className="flex h-full w-full flex-col backdrop-blur-md">
			{/* Premium URL Bar */}
			<div className="flex w-full items-center !border-t-0 gap-3 px-4 py-3 border-b border-primary/15 glass-subtle">
				{/* Method Selector */}
				<Select
					value={activeRequest?.method || 'GET'}
					onValueChange={(value) => {
						const updatedRequest = {
							...activeRequest,
							method: value as HttpMethod,
							unsaved: true,
						};
						if (activeRequest?.id) {
							updateRequest(activeRequest?.id, updatedRequest);
							replaceTabData(activeRequest.id, {
								unsaved: true,
								method: value as HttpMethod
							});
						}
					}}
				>
					<SelectTrigger
						className={cn(
							'w-24 h-9',
							'cursor-pointer rounded-lg',
							'font-bold text-xs',
							'border shadow-md',
							'hover:opacity-90',
							'focus:ring-2 focus:ring-primary/40',
							'transition-all duration-200',
							requestBgColorMap[
							(activeRequest?.method || 'GET') as keyof typeof requestBgColorMap
							],
							'text-white'
						)}
					>
						<SelectValue placeholder="Method" />
					</SelectTrigger>
					<SelectContent
						align="start"
						className="rounded-lg p-1.5 shadow-2xl shadow-primary/20 bg-popover/98 backdrop-blur-xl border border-primary/20"
					>
						{['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'].map((method) => (
							<SelectItem
								key={method}
								value={method}
								className="cursor-pointer rounded-md text-xs font-semibold px-3 py-2.5 focus:bg-primary/15 transition-colors"
							>
								{method}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				{/* URL Input */}
				<InputGroup className="flex-1">
					<EnvironmentVariableInput
						id="url"
						placeholder="Enter request URL (use {{variable}} for env vars)"
						value={activeRequest?.url || ''}
						onChange={(value) => {
							const updatedRequest = {
								...activeRequest,
								url: value,
								unsaved: true,
							};
							if (activeRequest?.id) {
								updateRequest(activeRequest?.id, updatedRequest);
								replaceTabData(activeRequest.id, { unsaved: true });
							}
						}}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								handleSend();
							}
						}}
						className="flex-1 h-9 rounded-lg border-primary/20 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary/40 transition-all duration-200"
					/>
				</InputGroup>

				{/* Loading Indicator */}
				{isLoading && (
					<div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-amber-500/30 shadow-md shadow-amber-500/10">
						<div className="size-2.5 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 animate-pulse shadow-lg shadow-amber-500/50" />
						<span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">Sending</span>
					</div>
				)}

				{/* Send Button */}
				<Button
					className={cn(
						'h-9 px-5 rounded-lg font-bold text-sm',
						'transition-all duration-200 active:scale-[0.97]',
						'shadow-lg',
						'bg-gradient-to-r from-primary via-primary/90 to-primary text-primary-foreground hover:from-primary/90 hover:via-primary/80 hover:to-primary/90 shadow-primary/30'
					)}
					onClick={handleSend}
					disabled={isSending || !activeRequest?.url}
				>
					{isSending ? (
						<Loader2 className="h-4 w-4 animate-spin mr-2" />
					) : (
						<IconSend className="size-4 mr-2 fill-current" />
					)}
					{isSending ? 'Sending...' : 'Send'}
				</Button>

				{/* Save Button */}
				<Button
					variant="outline"
					className={cn(
						'h-9 px-4 rounded-lg font-medium text-sm',
						'border-border/60 hover:bg-muted/50 hover:border-border',
						'transition-all duration-200 active:scale-[0.98]',
						isUnsaved && 'border-orange-500/50 text-orange-600 dark:text-orange-400'
					)}
					onClick={handleSave}
					disabled={isSaving}
				>
					{isSaving ? (
						<Loader2 className="h-4 w-4 animate-spin mr-2" />
					) : isUnsaved ? (
						<CircleDot className="size-3 mr-2 text-orange-500" />
					) : (
						<SaveIcon className="size-4 mr-2" />
					)}
					{isSaving ? 'Saving...' : 'Save'}
				</Button>
			</div>

			{/* Tabs Section */}
			<Tabs
				value={requestInfoTab}
				className="flex flex-1 min-h-0 flex-col w-full overflow-hidden"
				onValueChange={(val) => {
					setRequestInfoTab(val);
				}}
			>
				<div className="px-4  pt-1">
					<TabsList className="h-9 gap-1 p-1 rounded-lg bg-muted/70">
						{[
							{ value: 'parameters', label: 'Params', count: activeRequest?.parameters?.filter(p => p.isActive)?.length },
							{ value: 'headers', label: 'Headers', count: activeRequest?.headers?.filter(h => h.isActive)?.length },
							{ value: 'body', label: 'Body' },
							{ value: 'auth', label: 'Auth' },
						].map((tab) => (
							<TabsTrigger
								key={tab.value}
								value={tab.value}
								className={cn(
									'h-7 px-4 rounded-md text-xs font-medium cursor-pointer',
									'transition-all',
									'data-[state=active]:bg-primary/20 dark:data-[state=active]:bg-primary/25 data-[state=active]:text-primary dark:data-[state=active]:text-primary-foreground data-[state=active]:border data-[state=active]:border-primary/40',
									'data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground data-[state=inactive]:hover:bg-accent'
								)}
							>
								{tab.label}
								{tab.count !== undefined && tab.count > 0 && (
									<span className="ml-1.5 px-1.5 py-0.5 text-[9px] rounded-full bg-primary/20 text-primary font-bold">
										{tab.count}
									</span>
								)}
							</TabsTrigger>
						))}
					</TabsList>
				</div>

				<ResizablePanelGroup
					direction="vertical"
					className="flex-1 min-h-0 w-full"
				>
					<ResizablePanel
						defaultSize={70}
						minSize={10}
						maxSize={90}
						className="flex flex-col min-h-0 !overflow-hidden"
					>
						<TabsContent
							value="parameters"
							className="w-full flex-1 min-h-0 overflow-y-auto !p-4 !pt-0 data-[state=active]:flex data-[state=active]:flex-col"
						>
							<ParameterComponent />
						</TabsContent>
						<TabsContent
							value="headers"
							className="w-full flex-1 min-h-0 overflow-y-auto !p-4 !pt-0 data-[state=active]:flex data-[state=active]:flex-col"
						>
							<HeaderComponent />
						</TabsContent>
						<TabsContent
							value="body"
							className="w-full flex-1 min-h-0 overflow-y-auto !p-4 !pt-0 data-[state=active]:flex data-[state=active]:flex-col"
						>
							<BodyComponent />
						</TabsContent>
						<TabsContent
							value="auth"
							className="w-full flex-1 min-h-0 overflow-y-auto !p-4 !pt-0 data-[state=active]:flex data-[state=active]:flex-col"
						>
							<AuthComponent />
						</TabsContent>
					</ResizablePanel>
					<ResizableHandle withHandle className="bg-border/30 hover:bg-primary/20 transition-colors" />
					<ResizablePanel
						defaultSize={30}
						minSize={4}
						maxSize={90}
						className="flex flex-col !overflow-y-auto px-4 !pb-4"
					>
						<ApiResponse />
					</ResizablePanel>
				</ResizablePanelGroup>
			</Tabs>
		</div>
	);
};

export default ApiRequestComponent;

