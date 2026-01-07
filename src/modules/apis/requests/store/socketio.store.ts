import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { io, Socket } from 'socket.io-client';

export type LogMessage = {
    id: string;
    timestamp: number;
    direction: 'sent' | 'received' | 'error' | 'system';
    content: string;
    eventName?: string;
};

interface SocketIOState {
    connections: Record<string, Socket>;
    messages: Record<string, LogMessage[]>;
    connectionStatus: Record<string, 'connected' | 'disconnected' | 'connecting' | 'error'>;

    connect: (requestId: string, url: string, options?: any) => void;
    disconnect: (requestId: string) => void;
    emit: (requestId: string, eventName: string, ...args: any[]) => void;
    clearMessages: (requestId: string) => void;
}

const useSocketIOStore = create<SocketIOState>()(
    devtools((set, get) => ({
        connections: {},
        messages: {},
        connectionStatus: {},

        connect: (requestId, url, options) => {
            const { connections } = get();
            if (connections[requestId]) {
                connections[requestId].disconnect();
            }

            try {
                set((state) => ({
                    connectionStatus: { ...state.connectionStatus, [requestId]: 'connecting' },
                }));

                const socket = io(url, {
                    ...options,
                    transports: ['websocket'], // Force WebSocket transport
                    autoConnect: false,
                });

                socket.connect();

                socket.on('connect', () => {
                    set((state) => ({
                        connectionStatus: { ...state.connectionStatus, [requestId]: 'connected' },
                        messages: {
                            ...state.messages,
                            [requestId]: [
                                ...(state.messages[requestId] || []),
                                {
                                    id: crypto.randomUUID(),
                                    timestamp: Date.now(),
                                    direction: 'system',
                                    content: 'Connected to ' + url,
                                },
                            ],
                        },
                    }));
                });

                socket.on('disconnect', () => {
                    set((state) => ({
                        connectionStatus: { ...state.connectionStatus, [requestId]: 'disconnected' },
                        messages: {
                            ...state.messages,
                            [requestId]: [
                                ...(state.messages[requestId] || []),
                                {
                                    id: crypto.randomUUID(),
                                    timestamp: Date.now(),
                                    direction: 'system',
                                    content: 'Disconnected',
                                },
                            ],
                        },
                    }));
                });

                socket.on('connect_error', (error) => {
                    set((state) => ({
                        connectionStatus: { ...state.connectionStatus, [requestId]: 'error' },
                        messages: {
                            ...state.messages,
                            [requestId]: [
                                ...(state.messages[requestId] || []),
                                {
                                    id: crypto.randomUUID(),
                                    timestamp: Date.now(),
                                    direction: 'error',
                                    content: error.message,
                                },
                            ],
                        },
                    }));
                });

                // Catch-all listener for any event
                socket.onAny((eventName, ...args) => {
                    set((state) => ({
                        messages: {
                            ...state.messages,
                            [requestId]: [
                                ...(state.messages[requestId] || []),
                                {
                                    id: crypto.randomUUID(),
                                    timestamp: Date.now(),
                                    direction: 'received',
                                    eventName,
                                    content: JSON.stringify(args),
                                },
                            ],
                        },
                    }));
                });

                set((state) => ({
                    connections: { ...state.connections, [requestId]: socket },
                }));

            } catch (error) {
                set((state) => ({
                    connectionStatus: { ...state.connectionStatus, [requestId]: 'error' },
                    messages: {
                        ...state.messages,
                        [requestId]: [
                            ...(state.messages[requestId] || []),
                            {
                                id: crypto.randomUUID(),
                                timestamp: Date.now(),
                                direction: 'error',
                                content: error instanceof Error ? error.message : 'Failed to connect',
                            },
                        ],
                    },
                }));
            }
        },

        disconnect: (requestId) => {
            const { connections } = get();
            if (connections[requestId]) {
                connections[requestId].disconnect();
            }
        },

        emit: (requestId, eventName, ...args) => {
            const { connections } = get();
            const socket = connections[requestId];

            if (socket && socket.connected) {
                socket.emit(eventName, ...args);
                set((state) => ({
                    messages: {
                        ...state.messages,
                        [requestId]: [
                            ...(state.messages[requestId] || []),
                            {
                                id: crypto.randomUUID(),
                                timestamp: Date.now(),
                                direction: 'sent',
                                eventName,
                                content: JSON.stringify(args),
                            },
                        ],
                    },
                }));
            } else {
                set((state) => ({
                    messages: {
                        ...state.messages,
                        [requestId]: [
                            ...(state.messages[requestId] || []),
                            {
                                id: crypto.randomUUID(),
                                timestamp: Date.now(),
                                direction: 'error',
                                content: 'Cannot emit event: Socket is not connected',
                            },
                        ],
                    },
                }));
            }
        },

        clearMessages: (requestId) => {
            set((state) => ({
                messages: { ...state.messages, [requestId]: [] },
            }));
        },
    }))
);

export default useSocketIOStore;
