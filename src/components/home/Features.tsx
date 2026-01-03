"use client";

import {
  Zap,
  Globe,
  Code2,
  Shield,
  Sparkles,
  FolderOpen,
  Cookie,
  Variable,
} from "lucide-react";
import { motion } from "motion/react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Execute REST, and WebSocket requests with zero overhead. Built for speed.",
    gradient: "from-yellow-500 to-orange-500",
    bgGradient: "from-yellow-500/10 to-orange-500/10",
    textColor: "text-yellow-500",
    delay: 0,
  },
  {
    icon: Shield,
    title: "All Auth Types",
    description:
      "Basic, Bearer, OAuth 1.0/2.0, Digest, and API Key authentication built-in.",
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-500/10 to-cyan-500/10",
    textColor: "text-blue-500",
    delay: 0.1,
  },
  {
    icon: Globe,
    title: "WebSocket & SSE",
    description:
      "Real-time debugging for WebSocket, Socket.io, and Server-Sent Events.",
    gradient: "from-pink-500 to-rose-500",
    bgGradient: "from-pink-500/10 to-rose-500/10",
    textColor: "text-pink-500",
    delay: 0.2,
  },
  {
    icon: Variable,
    title: "Environment Variables",
    description:
      "Manage multiple environments with {{variable}} syntax and auto-complete.",
    gradient: "from-green-500 to-emerald-500",
    bgGradient: "from-green-500/10 to-emerald-500/10",
    textColor: "text-green-500",
    delay: 0.3,
  },
  {
    icon: FolderOpen,
    title: "Collections",
    description:
      "Organize requests into collections and folders. Share and collaborate easily.",
    gradient: "from-violet-500 to-purple-500",
    bgGradient: "from-violet-500/10 to-purple-500/10",
    textColor: "text-violet-500",
    delay: 0.4,
  },
  {
    icon: Cookie,
    title: "Cookie Management",
    description:
      "Automatic cookie handling with jar view, attributes, and domain grouping.",
    gradient: "from-amber-500 to-yellow-500",
    bgGradient: "from-amber-500/10 to-yellow-500/10",
    textColor: "text-amber-500",
    delay: 0.5,
  },
  {
    icon: Code2,
    title: "Code Generation",
    description:
      "Export requests to 20+ languages and frameworks with one click.",
    gradient: "from-indigo-500 to-blue-500",
    bgGradient: "from-indigo-500/10 to-blue-500/10",
    textColor: "text-indigo-500",
    delay: 0.6,
  },
  {
    icon: Sparkles,
    title: "Beautiful UI",
    description:
      "A gorgeous, dark-themed interface designed with love for developers.",
    gradient: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-500/10 to-pink-500/10",
    textColor: "text-purple-500",
    delay: 0.7,
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="py-24 relative overflow-hidden bg-background"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-violet-500/5 to-background" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Packed with Features
            </span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 dark:from-violet-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              master APIs
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            From simple GET requests to complex authentication flows, ApiClient
            has all the tools you need, crafted with care and attention to
            detail.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: feature.delay }}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`group relative rounded-2xl bg-card border border-border p-6 hover:border-primary/50 transition-all duration-300 cursor-default overflow-hidden shadow-sm hover:shadow-md`}
            >
              {/* Glow on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300`}
              />

              <div className="relative z-10">
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} p-0.5 mb-4`}
                >
                  <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
                    <feature.icon className={`w-5 h-5 ${feature.textColor}`} />
                  </div>
                </motion.div>

                <h3 className="text-lg font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground group-hover:text-muted-foreground/80 transition-colors leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Highlight Box */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <div className="relative rounded-3xl bg-secondary/50 border border-border p-8 md:p-10 overflow-hidden">
            {/* Animated background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-purple-500/5 to-indigo-500/5"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 10, repeat: Infinity }}
              style={{ backgroundSize: "200% 200%" }}
            />

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-bold mb-3 text-foreground">
                  Self-host with{" "}
                  <span className="bg-gradient-to-r from-violet-600 to-pink-600 dark:from-violet-400 dark:to-pink-400 bg-clip-text text-transparent">
                    one command
                  </span>
                </h3>
                <p className="text-muted-foreground">
                  Deploy your own instance in seconds with Docker. Full control,
                  your data stays yours forever.
                </p>
              </div>
              <div className="flex-shrink-0">
                <code className="block px-6 py-4 rounded-xl bg-gray-950 border border-gray-800 font-mono text-sm text-violet-300 shadow-lg dark:bg-black/50">
                  docker compose up -d
                </code>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
