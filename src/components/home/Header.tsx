'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/modules/authentication/store';
import { Menu, X, Github, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const MotionLink = motion.create(Link);

export default function Header() {
    const { data } = useAuthStore();
    const isSignedIn = !!data?.session;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 left-0 right-0 z-50"
        >
            <div className="mx-4 mt-4">
                <div className="max-w-6xl mx-auto rounded-2xl bg-background/60 backdrop-blur-xl border border-white/10 shadow-lg shadow-black/5">
                    <div className="px-6 py-3">
                        <div className="flex items-center justify-between">
                            {/* Logo */}
                            <Link href="/" className="flex items-center gap-2 group">
                                <motion.div
                                    className="relative w-8 h-8"
                                    whileHover={{ rotate: 360 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <Image
                                        src="/logo.png"
                                        alt="ApiClient Logo"
                                        fill
                                        className="object-contain"
                                    />
                                </motion.div>
                                <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                                    ApiClient
                                </span>
                            </Link>

                            {/* Desktop Navigation */}
                            <nav className="hidden md:flex items-center gap-1">
                                {[
                                    { label: 'Features', href: '#features' },
                                    { label: 'Community', href: '#testimonials' },
                                    { label: 'Docs', href: '/docs' },
                                ].map((link) => (
                                    <Link
                                        key={link.label}
                                        href={link.href}
                                        className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-white/5 transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                <a
                                    href="https://github.com/rohittiwari-dev/api-client"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-white/5 transition-colors flex items-center gap-1.5"
                                >
                                    <Github className="w-4 h-4" />
                                    GitHub
                                </a>
                            </nav>

                            {/* Auth Buttons */}
                            <div className="hidden md:flex items-center gap-2">
                                {isSignedIn ? (
                                    <MotionLink
                                        href="/workspace"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium text-sm shadow-lg shadow-violet-500/25 flex items-center gap-1.5"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        Open App
                                    </MotionLink>
                                ) : (
                                    <>
                                        <Link
                                            href="/sign-in"
                                            className="px-4 py-2 rounded-xl text-foreground font-medium text-sm hover:bg-white/5 transition-colors"
                                        >
                                            Sign In
                                        </Link>
                                        <MotionLink
                                            href="/sign-up"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium text-sm shadow-lg shadow-violet-500/25"
                                        >
                                            Get Started
                                        </MotionLink>
                                    </>
                                )}
                            </div>

                            {/* Mobile Menu Button */}
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
                            >
                                {mobileMenuOpen ? (
                                    <X className="w-5 h-5" />
                                ) : (
                                    <Menu className="w-5 h-5" />
                                )}
                            </motion.button>
                        </div>

                        {/* Mobile Menu */}
                        <AnimatePresence>
                            {mobileMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="md:hidden overflow-hidden"
                                >
                                    <nav className="py-4 border-t border-white/10 mt-4 flex flex-col gap-2">
                                        {[
                                            { label: 'Features', href: '#features' },
                                            { label: 'Community', href: '#testimonials' },
                                            { label: 'Docs', href: '/docs' },
                                        ].map((link) => (
                                            <Link
                                                key={link.label}
                                                href={link.href}
                                                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-white/5 transition-colors"
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                {link.label}
                                            </Link>
                                        ))}
                                        <a
                                            href="https://github.com/rohittiwari-dev/api-client"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-white/5 transition-colors flex items-center gap-1.5"
                                        >
                                            <Github className="w-4 h-4" />
                                            GitHub
                                        </a>

                                        <div className="flex flex-col gap-2 pt-4 border-t border-white/10 mt-2">
                                            {isSignedIn ? (
                                                <Link
                                                    href="/workspace"
                                                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium text-sm text-center"
                                                    onClick={() => setMobileMenuOpen(false)}
                                                >
                                                    Open App
                                                </Link>
                                            ) : (
                                                <>
                                                    <Link
                                                        href="/sign-in"
                                                        className="px-4 py-3 rounded-xl text-foreground font-medium text-sm text-center hover:bg-white/5 transition-colors"
                                                        onClick={() => setMobileMenuOpen(false)}
                                                    >
                                                        Sign In
                                                    </Link>
                                                    <Link
                                                        href="/sign-up"
                                                        className="px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium text-sm text-center"
                                                        onClick={() => setMobileMenuOpen(false)}
                                                    >
                                                        Get Started
                                                    </Link>
                                                </>
                                            )}
                                        </div>
                                    </nav>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </motion.header>
    );
}
