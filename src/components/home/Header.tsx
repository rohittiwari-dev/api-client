'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/modules/authentication/store';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
    const { data } = useAuthStore();
    const isSignedIn = !!data?.session;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative w-8 h-8 transition-transform group-hover:scale-110">
                            <Image
                                src="/logo.png"
                                alt="ApiClient Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent">
                            ApiClient
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link
                            href="/docs"
                            className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
                        >
                            Docs
                        </Link>
                        <Link
                            href="#features"
                            className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
                        >
                            Features
                        </Link>
                        <Link
                            href="#testimonials"
                            className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
                        >
                            Community
                        </Link>
                    </nav>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        {isSignedIn ? (
                            <Link
                                href="/workspace"
                                className="px-5 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium text-sm hover:from-violet-700 hover:to-indigo-700 transition-all shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40"
                            >
                                Open App
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/sign-in"
                                    className="px-4 py-2 rounded-lg text-foreground font-medium text-sm hover:bg-accent transition-colors"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/sign-up"
                                    className="px-5 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium text-sm hover:from-violet-700 hover:to-indigo-700 transition-all shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
                    >
                        {mobileMenuOpen ? (
                            <X className="w-5 h-5" />
                        ) : (
                            <Menu className="w-5 h-5" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-border/50">
                        <nav className="flex flex-col gap-4">
                            <Link
                                href="/docs"
                                className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Docs
                            </Link>
                            <Link
                                href="#features"
                                className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Features
                            </Link>
                            <Link
                                href="#testimonials"
                                className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Testimonials
                            </Link>
                            <div className="flex flex-col gap-2 pt-4 border-t border-border/50">
                                {isSignedIn ? (
                                    <Link
                                        href="/workspace"
                                        className="px-5 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium text-sm text-center"
                                    >
                                        Open App
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href="/sign-in"
                                            className="px-4 py-2 rounded-lg text-foreground font-medium text-sm text-center hover:bg-accent"
                                        >
                                            Sign In
                                        </Link>
                                        <Link
                                            href="/sign-up"
                                            className="px-5 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium text-sm text-center"
                                        >
                                            Sign Up
                                        </Link>
                                    </>
                                )}
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
