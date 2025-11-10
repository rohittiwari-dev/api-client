'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/modules/authentication/store';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Hero() {
    const { data } = useAuthStore();
    const isSignedIn = !!data?.session;

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Animated gradient orbs */}
                <div className="absolute top-1/4 -left-32 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-violet-500/10 to-transparent rounded-full" />

                {/* Grid pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-5xl mx-auto text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-violet mb-8 animate-fade-in">
                        <Sparkles className="w-4 h-4 text-violet-500" />
                        <span className="text-sm font-medium text-violet-500">
                            100% Free & Open Source
                        </span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
                        <span className="block text-foreground">No Bloat. Just</span>
                        <span className="block bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                            Pure API Development
                        </span>
                    </h1>

                    {/* Subheadline */}
                    <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                        A developer-to-developer commitment: No gates, no hidden fees, just a powerful, beautiful API client.
                        Self-hostable, customizable, and designed for your workflow.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                        <Link
                            href={isSignedIn ? '/workspace' : '/sign-up'}
                            className="group px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-lg hover:from-violet-700 hover:to-indigo-700 transition-all shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105 flex items-center gap-2"
                        >
                            {isSignedIn ? 'Open App' : 'Start Building'}
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <a
                            href="https://github.com/yourusername/api-client"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group px-8 py-4 rounded-xl glass hover:bg-accent/50 font-semibold text-lg transition-all flex items-center gap-2"
                        >
                            <div className="w-5 h-5">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                            </div>
                            GitHub
                        </a>
                    </div>

                    {/* App Preview */}
                    <div className="relative max-w-6xl mx-auto">
                        <div className="absolute -inset-4 bg-gradient-to-r from-violet-500/20 via-purple-500/20 to-indigo-500/20 rounded-2xl blur-2xl" />

                        {/* Main Image Container */}
                        <div className="relative rounded-2xl bg-[#1e1e1e] border border-white/10 shadow-2xl overflow-hidden group hover:scale-[1.01] transition-transform duration-500">
                            <Image
                                src="/app-screenshot.png"
                                alt="ApiClient Interface"
                                width={1400}
                                height={900}
                                className="w-full h-auto rounded-2xl"
                                priority
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1400px"
                            />

                            {/* Overlay gradient for depth */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f11] via-transparent to-transparent opacity-20 pointer-events-none" />

                            {/* Shine effect */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        </div>

                        {/* Floating elements/Decorations */}
                        <div className="absolute -right-8 top-20 bg-[#1e1e1e]/90 text-white p-4 rounded-xl border border-white/10 shadow-xl backdrop-blur-md animate-float hidden lg:block">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                                <span className="font-mono text-sm">Status: 200 OK</span>
                            </div>
                            <div className="mt-2 text-xs text-green-400 font-mono">145ms • 2.4KB</div>
                        </div>

                        <div className="absolute -left-8 bottom-20 bg-[#1e1e1e]/90 text-white p-4 rounded-xl border border-white/10 shadow-xl backdrop-blur-md animate-float-delayed hidden lg:block">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-0.5 rounded text-[10px] bg-violet-500/20 text-violet-300 font-medium">WS</span>
                                <span className="font-mono text-xs">socket.io/v4</span>
                            </div>
                            <div className="text-xs text-muted-foreground font-mono">Connected</div>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-3xl mx-auto">
                    {[
                        { value: '10K+', label: 'Developers' },
                        { value: '1M+', label: 'API Calls' },
                        { value: '99.9%', label: 'Uptime' },
                        { value: '4.9/5', label: 'Rating' },
                    ].map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent">
                                {stat.value}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
