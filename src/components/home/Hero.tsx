"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuthStore } from "@/modules/authentication/store";
import {
  ArrowRight,
  Sparkles,
  Github,
  CheckCircle2,
  Star,
  Heart,
  Zap,
  Terminal,
} from "lucide-react";
import { motion } from "motion/react";

const MotionLink = motion.create(Link);

export default function Hero() {
  const { data } = useAuthStore();
  const isSignedIn = !!data?.session;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 pb-20">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        {/* Refined gradient mesh */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl opacity-40 dark:opacity-20 pointer-events-none">
          <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-primary/30 rounded-full blur-[120px] mix-blend-screen" />
          <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px] mix-blend-screen" />
          <div className="absolute bottom-[0%] left-[30%] w-[700px] h-[700px] bg-violet-600/10 rounded-full blur-[140px] mix-blend-screen" />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] z-0" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Announcement Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-border backdrop-blur-sm mb-8 hover:bg-secondary/70 transition-colors cursor-default"
          >
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs font-medium text-muted-foreground">
              v1.0 is now available
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1] text-foreground"
          >
            The API Client for
            <span className="block mt-2 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 dark:from-violet-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent pb-4">
              Modern Developers
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Debug, test, and share your APIs with a beautiful, lightweight tool
            designed for speed. No subscriptions, no bloat, just code.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          >
            <MotionLink
              href={isSignedIn ? "/workspace" : "/sign-up"}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold text-lg hover:brightness-110 shadow-xl shadow-primary/20 transition-all flex items-center gap-2"
            >
              {isSignedIn ? "Go to Workspace" : "Start Building Free"}
              <ArrowRight className="w-5 h-5" />
            </MotionLink>

            <motion.a
              href="https://github.com/rohittiwari-dev/api-client"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-full bg-card border border-border hover:bg-accent hover:text-accent-foreground font-medium text-lg transition-all flex items-center gap-2"
            >
              <Github className="w-5 h-5" />
              Star on GitHub
            </motion.a>
          </motion.div>

          {/* Interactive Preview Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative max-w-6xl mx-auto"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-indigo-500 to-purple-600 rounded-2xl opacity-20 blur-2xl" />

            <div className="relative rounded-xl border border-border/40 bg-background/50 backdrop-blur-sm shadow-2xl overflow-hidden">
              {/* Window Actions */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border/40 bg-muted/20">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 text-center">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-background/50 border border-border/50 text-[10px] text-muted-foreground font-mono">
                    <Terminal className="w-3 h-3" />
                    api-client / workspace
                  </div>
                </div>
              </div>

              {/* App Content Construction */}
              <div className="relative aspect-[16/10] bg-background w-full flex flex-col md:flex-row overflow-hidden">
                {/* Sidebar Mockup */}
                <div className="w-16 md:w-64 border-r border-border/40 bg-muted/10 hidden md:flex flex-col gap-4 p-4">
                  <div className="h-8 w-24 rounded-md bg-muted animate-pulse" />
                  <div className="space-y-3">
                    <div className="h-4 w-full rounded bg-muted/50" />
                    <div className="h-4 w-3/4 rounded bg-muted/50" />
                    <div className="h-4 w-5/6 rounded bg-muted/50" />
                  </div>
                  <div className="mt-auto h-12 w-full rounded-lg bg-card border border-border/50 p-2 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20" />
                    <div className="h-3 w-16 rounded bg-muted/50" />
                  </div>
                </div>

                {/* Main Content Mockup */}
                <div className="flex-1 flex flex-col min-w-0">
                  {/* Tab Bar Mockup */}
                  <div className="h-12 border-b border-border/40 flex items-center px-4 gap-4">
                    <div className="h-8 w-32 rounded-t-lg bg-background border-t border-x border-border/40 relative top-2 flex items-center px-3 gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      <div className="h-2 w-16 rounded bg-foreground/10" />
                    </div>
                    <div className="h-4 w-4 rounded bg-muted/50 ml-auto" />
                  </div>

                  {/* Request Bar Mockup */}
                  <div className="p-4 md:p-6 space-y-6">
                    <div className="flex gap-2">
                      <div className="h-10 w-20 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xs font-bold text-emerald-500">
                        GET
                      </div>
                      <div className="h-10 flex-1 rounded-md bg-muted/30 border border-border/30 flex items-center px-4 text-sm text-muted-foreground font-mono">
                        https://api.example.com/v1/users
                      </div>
                      <div className="h-10 w-24 rounded-md bg-primary flex items-center justify-center text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25">
                        Send
                      </div>
                    </div>

                    {/* Response Area Mockup */}
                    <div className="rounded-lg border border-border/40 bg-card/50 flex flex-col h-64 md:h-80 overflow-hidden">
                      <div className="h-10 border-b border-border/40 bg-muted/10 flex items-center px-4 gap-4">
                        <div className="h-3 w-12 rounded bg-muted/50" />
                        <div className="h-3 w-12 rounded bg-muted/50" />
                        <div className="h-3 w-12 rounded bg-muted/50" />
                      </div>
                      <div className="p-4 space-y-2 font-mono text-xs md:text-sm text-muted-foreground/80">
                        <div className="flex">
                          <span className="text-purple-400">
                            &quot;status&quot;
                          </span>
                          :{" "}
                          <span className="text-green-400">
                            &quot;success&quot;
                          </span>
                          ,
                        </div>
                        <div className="flex">
                          <span className="text-purple-400">
                            &quot;data&quot;
                          </span>
                          : {"{"}
                        </div>
                        <div className="pl-4 flex">
                          <span className="text-purple-400">
                            &quot;id&quot;
                          </span>
                          : <span className="text-orange-400">12345</span>,
                        </div>
                        <div className="pl-4 flex">
                          <span className="text-purple-400">
                            &quot;username&quot;
                          </span>
                          :{" "}
                          <span className="text-green-400">
                            &quot;developer&quot;
                          </span>
                          ,
                        </div>
                        <div className="pl-4 flex">
                          <span className="text-purple-400">
                            &quot;role&quot;
                          </span>
                          :{" "}
                          <span className="text-green-400">
                            &quot;admin&quot;
                          </span>
                        </div>
                        <div>{"}"}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-20 pointer-events-none" />
              </div>
            </div>

            {/* Feature Badges interacting with screen */}
            <div className="absolute -right-4 top-1/4 hidden xl:block">
              <motion.div
                className="glass-card p-3 rounded-lg flex items-center gap-3 pr-6"
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-medium">Status</div>
                  <div className="text-sm font-bold text-green-500">200 OK</div>
                </div>
              </motion.div>
            </div>

            <div className="absolute -left-4 bottom-1/4 hidden xl:block">
              <motion.div
                className="glass-card p-3 rounded-lg flex items-center gap-3 pr-6"
                animate={{ y: [0, 10, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-500">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-medium">Latency</div>
                  <div className="text-sm font-bold text-violet-500">45ms</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
