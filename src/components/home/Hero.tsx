'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/modules/authentication/store';
import { ArrowRight, Sparkles, Github, CheckCircle2, Star, Heart, Zap } from 'lucide-react';
import { motion } from 'motion/react';

const MotionLink = motion.create(Link);

export default function Hero() {
    const { data } = useAuthStore();
    const isSignedIn = !!data?.session;

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-20">
            {/* Stunning Background */}
            <div className="absolute inset-0">
                {/* Aurora-like gradient */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(120,119,198,0.15),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(168,85,247,0.15),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(79,70,229,0.1),transparent_50%)]" />

                {/* Animated floating orbs */}
                <motion.div
                    className="absolute top-1/4 left-[10%] w-64 h-64 bg-violet-600/20 rounded-full blur-[80px]"
                    animate={{
                        y: [0, -30, 0],
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute bottom-1/4 right-[10%] w-80 h-80 bg-indigo-600/20 rounded-full blur-[100px]"
                    animate={{
                        y: [0, 40, 0],
                        scale: [1, 1.2, 1],
                        opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                />
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px]"
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.1, 0.2, 0.1]
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Subtle grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.015)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_20%,transparent_100%)]" />

                {/* Floating particles */}
                <div className="absolute inset-0 overflow-hidden">
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-violet-400/30 rounded-full"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                                y: [0, -100, 0],
                                opacity: [0, 1, 0],
                            }}
                            transition={{
                                duration: 5 + Math.random() * 5,
                                repeat: Infinity,
                                delay: Math.random() * 5,
                            }}
                        />
                    ))}
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-5xl mx-auto text-center">
                    {/* Premium Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-indigo-500/10 border border-violet-500/20 mb-8 backdrop-blur-md"
                    >
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Sparkles className="w-4 h-4 text-violet-400" />
                        </motion.div>
                        <span className="text-sm font-semibold bg-gradient-to-r from-violet-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
                            Free & Open Source Forever
                        </span>
                        <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
                    </motion.div>

                    {/* Main Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]"
                    >
                        <span className="block text-foreground">The API Client</span>
                        <motion.span
                            className="block mt-2 bg-gradient-to-r from-violet-400 via-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent bg-[length:300%_auto]"
                            animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        >
                            Built with Love
                        </motion.span>
                    </motion.h1>

                    {/* Subheadline */}
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="text-lg sm:text-xl text-muted-foreground/90 max-w-2xl mx-auto mb-8 leading-relaxed"
                    >
                        A beautiful, powerful API testing tool crafted for developers who care about their workflow.
                        <span className="text-violet-400"> No bloat. No subscriptions. Just pure joy.</span>
                    </motion.p>

                    {/* Feature Pills */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex flex-wrap justify-center gap-3 mb-10"
                    >
                        {[
                            { icon: Zap, label: 'Lightning Fast', color: 'text-yellow-400' },
                            { icon: CheckCircle2, label: 'All Auth Types', color: 'text-green-400' },
                            { icon: Star, label: 'Self-Hostable', color: 'text-violet-400' },
                            { icon: Heart, label: 'MIT Licensed', color: 'text-pink-400' },
                        ].map((feature, index) => (
                            <motion.div
                                key={feature.label}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4 + index * 0.1 }}
                                whileHover={{ scale: 1.05, y: -2 }}
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm text-sm text-muted-foreground border border-white/10 hover:border-violet-500/30 hover:bg-violet-500/5 transition-colors cursor-default"
                            >
                                <feature.icon className={`w-4 h-4 ${feature.color}`} />
                                {feature.label}
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
                    >
                        <MotionLink
                            href={isSignedIn ? '/workspace' : '/sign-up'}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white font-semibold text-lg overflow-hidden shadow-2xl shadow-violet-500/30"
                        >
                            {/* Animated shimmer */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                                animate={{ x: ['-200%', '200%'] }}
                                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                            />
                            <span className="relative flex items-center gap-2">
                                {isSignedIn ? 'Open App' : 'Start Building Free'}
                                <motion.span
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    <ArrowRight className="w-5 h-5" />
                                </motion.span>
                            </span>
                        </MotionLink>

                        <motion.a
                            href="https://github.com/rohittiwari-dev/api-client"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            className="group px-8 py-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-violet-500/40 hover:bg-violet-500/10 font-semibold text-lg transition-all flex items-center gap-3"
                        >
                            <Github className="w-5 h-5" />
                            <span>Star on GitHub</span>
                            <motion.span
                                className="text-yellow-400"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                            >
                                ⭐
                            </motion.span>
                        </motion.a>
                    </motion.div>

                    {/* App Preview */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="relative max-w-5xl mx-auto"
                    >
                        {/* Glow effect */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-violet-600/30 via-purple-600/30 to-indigo-600/30 rounded-3xl blur-3xl opacity-50" />

                        {/* Browser Frame */}
                        <div className="relative rounded-2xl bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] border border-white/10 shadow-2xl overflow-hidden">
                            {/* Browser Bar */}
                            <div className="flex items-center gap-3 px-4 py-3 bg-[#1a1a1a] border-b border-white/5">
                                <div className="flex gap-2">
                                    <motion.div
                                        className="w-3 h-3 rounded-full bg-red-500"
                                        whileHover={{ scale: 1.2 }}
                                    />
                                    <motion.div
                                        className="w-3 h-3 rounded-full bg-yellow-500"
                                        whileHover={{ scale: 1.2 }}
                                    />
                                    <motion.div
                                        className="w-3 h-3 rounded-full bg-green-500"
                                        whileHover={{ scale: 1.2 }}
                                    />
                                </div>
                                <div className="flex-1 mx-4">
                                    <div className="flex items-center gap-2 bg-[#0a0a0a] rounded-lg px-4 py-2 text-xs text-muted-foreground font-mono max-w-sm mx-auto border border-white/5">
                                        <span className="text-green-400">🔒</span>
                                        <span>localhost:3000/workspace</span>
                                    </div>
                                </div>
                            </div>

                            {/* Screenshot */}
                            <motion.div
                                className="relative"
                                whileHover={{ scale: 1.01 }}
                                transition={{ duration: 0.4 }}
                            >
                                <Image
                                    src="/app-screenshot.png"
                                    alt="ApiClient Interface"
                                    width={1400}
                                    height={900}
                                    className="w-full h-auto"
                                    priority
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                                />
                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/50 via-transparent to-transparent pointer-events-none" />
                            </motion.div>
                        </div>

                        {/* Floating Cards */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1, duration: 0.6 }}
                            className="absolute right-4 top-32 hidden xl:block"
                        >
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="bg-[#1a1a1a]/95 backdrop-blur-xl p-4 rounded-xl border border-green-500/20 shadow-2xl shadow-green-500/10"
                            >
                                <div className="flex items-center gap-3">
                                    <motion.div
                                        className="w-2.5 h-2.5 rounded-full bg-green-400"
                                        animate={{ scale: [1, 1.3, 1] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                    />
                                    <span className="font-mono text-sm font-medium text-green-400">200 OK</span>
                                </div>
                                <div className="mt-2 text-xs text-muted-foreground font-mono">45ms • 1.2KB</div>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.2, duration: 0.6 }}
                            className="absolute left-4 bottom-32 hidden xl:block"
                        >
                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ duration: 5, repeat: Infinity }}
                                className="bg-[#1a1a1a]/95 backdrop-blur-xl p-4 rounded-xl border border-violet-500/20 shadow-2xl shadow-violet-500/10"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-0.5 rounded text-[10px] bg-violet-500/20 text-violet-300 font-bold">POST</span>
                                    <span className="font-mono text-xs text-muted-foreground">/api/v1/users</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] text-green-400">
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span>Bearer Token Applied</span>
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="mt-20 pt-12 border-t border-white/5"
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
                        {[
                            { value: '100%', label: 'Free Forever', emoji: '🎉' },
                            { value: 'MIT', label: 'Licensed', emoji: '📜' },
                            { value: '6+', label: 'Auth Methods', emoji: '🔐' },
                            { value: '∞', label: 'API Calls', emoji: '⚡' },
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.05, y: -5 }}
                                className="text-center cursor-default"
                            >
                                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-muted-foreground mt-1 flex items-center justify-center gap-1.5">
                                    <span>{stat.emoji}</span>
                                    <span>{stat.label}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
