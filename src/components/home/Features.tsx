'use client';

import {
    Zap,
    Globe,
    Code2,
    Shield,
    Sparkles,
} from 'lucide-react';

export default function Features() {
    return (
        <section id="features" className="py-24 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-500/5 to-transparent" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                        Everything you need to{' '}
                        <span className="bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent">
                            master APIs
                        </span>
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        From simple GET requests to complex authentication flows, ApiClient
                        has all the tools you need to build and test APIs efficiently.
                    </p>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {/* Main Feature - Large */}
                    <div className="md:col-span-2 group relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border border-white/10 p-8 hover:border-violet-500/50 transition-colors">
                        <div className="absolute inset-0 bg-grid-white/5 mask-image-bottom opacity-50" />
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center mb-4 text-violet-400">
                                <Zap className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Lightning Fast Requests</h3>
                            <p className="text-muted-foreground mb-8 max-w-lg">
                                Execute REST, GraphQL, and WebSocket requests with zero latency overhead.
                                Optimized for performance and developer experience.
                            </p>
                            {/* Visual Decoration */}
                            <div className="bg-[#1e1e1e] rounded-xl border border-white/10 p-4 shadow-xl transform translate-y-4 group-hover:translate-y-2 transition-transform max-w-md">
                                <div className="flex items-center gap-3 mb-3 border-b border-white/5 pb-2">
                                    <span className="text-green-400 font-mono text-xs bg-green-500/10 px-2 py-0.5 rounded">GET</span>
                                    <span className="text-muted-foreground font-mono text-xs truncate">https://api.example.com/v1/users</span>
                                    <div className="ml-auto flex gap-1">
                                        <div className="w-2 h-2 rounded-full bg-red-500/50" />
                                        <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                                        <div className="w-2 h-2 rounded-full bg-green-500/50" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full w-2/3 bg-violet-500 animate-pulse" />
                                    </div>
                                    <div className="h-2 w-3/4 bg-white/5 rounded-full" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feature 2 - Tall */}
                    <div className="md:row-span-2 group relative overflow-hidden rounded-3xl bg-[#0f0f11] border border-white/10 p-8 hover:border-pink-500/50 transition-colors">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-bl-full blur-2xl" />
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center mb-4 text-pink-400">
                                <Globe className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Real-time WebSockets</h3>
                            <p className="text-muted-foreground mb-6 text-sm">
                                Debug WebSocket, Socket.io, and SSE connections with ease. View messages in real-time.
                            </p>
                            <div className="space-y-3 font-mono text-xs">
                                <div className="p-3 bg-green-500/5 text-green-400 rounded-lg border border-green-500/20 flex items-center gap-2">
                                    <span>↓</span> <span>{`{ "type": "connected" }`}</span>
                                </div>
                                <div className="p-3 bg-blue-500/5 text-blue-400 rounded-lg border border-blue-500/20 flex items-center gap-2">
                                    <span>↑</span> <span>{`{ "action": "sub" }`}</span>
                                </div>
                                <div className="p-3 bg-green-500/5 text-green-400 rounded-lg border border-green-500/20 flex items-center gap-2">
                                    <span>↓</span> <span>{`{ "data": "updated" }`}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feature 3 - Standard */}
                    <div className="group relative overflow-hidden rounded-3xl bg-[#0f0f11] border border-white/10 p-6 hover:border-blue-500/50 transition-colors">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mb-3 text-blue-400">
                            <Shield className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold mb-2">Auth Helpers</h3>
                        <p className="text-muted-foreground text-sm">
                            Built-in support for Bearer, Basic, OAuth 2.0, and API Key authentication methods.
                        </p>
                    </div>

                    {/* Feature 4 - Standard */}
                    <div className="group relative overflow-hidden rounded-3xl bg-[#0f0f11] border border-white/10 p-6 hover:border-orange-500/50 transition-colors">
                        <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center mb-3 text-orange-400">
                            <Code2 className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold mb-2">Code Gen</h3>
                        <p className="text-muted-foreground text-sm">
                            Generate code snippets for 20+ languages and libraries instantly.
                        </p>
                    </div>

                    {/* Feature 5 - Wide */}
                    <div className="md:col-span-2 group relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0f0f11] to-violet-950/20 border border-white/10 p-6 hover:border-indigo-500/50 transition-colors flex flex-col md:flex-row items-center gap-6">
                        <div className="flex-1">
                            <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center mb-3 text-indigo-400">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Team Collections</h3>
                            <p className="text-muted-foreground text-sm">
                                Organize requests into collections and share them with your team via export/import.
                            </p>
                        </div>
                        <div className="hidden sm:block w-full md:w-1/3 bg-[#1e1e1e] rounded-lg border border-white/10 p-4 shadow-lg transform rotate-3 group-hover:rotate-0 transition-transform">
                            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/5">
                                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                                <span className="text-xs font-medium text-muted-foreground">My Collection</span>
                            </div>
                            <div className="space-y-2">
                                <div className="h-1.5 w-3/4 bg-white/10 rounded-full" />
                                <div className="h-1.5 w-1/2 bg-white/10 rounded-full" />
                                <div className="h-1.5 w-5/6 bg-white/10 rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
