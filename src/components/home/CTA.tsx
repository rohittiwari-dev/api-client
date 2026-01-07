"use client";

import Link from "next/link";
import { useAuthStore } from "@/modules/authentication/store";
import {
  ArrowRight,
  Sparkles,
  Heart,
  Github,
  Zap,
  Shield,
  Globe,
} from "lucide-react";
import { motion } from "motion/react";

const MotionLink = motion.create(Link);

export default function CTA() {
  const { data } = useAuthStore();
  const isSignedIn = !!data?.session;

  return (
    <section className="py-24 relative overflow-hidden bg-background">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-primary/5 to-transparent" />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/10 rounded-full blur-[120px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main CTA Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative rounded-3xl bg-card border border-border p-8 md:p-12 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500">
            {/* Animated gradient border */}
            <div className="absolute inset-0 rounded-3xl bg-linear-to-r from-violet-500/10 via-purple-500/10 to-pink-500/10 opacity-0 hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10 text-center">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/20 mb-6"
              >
                <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
                <span className="text-sm font-medium text-pink-500 dark:text-pink-300">
                  Made with love for developers
                </span>
              </motion.div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-foreground">
                Ready to{" "}
                <motion.span
                  className="bg-linear-to-r from-violet-600 via-purple-600 to-pink-600 dark:from-violet-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent bg-size-[200%_auto]"
                  animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
                  transition={{ duration: 5, repeat: Infinity }}
                >
                  supercharge
                </motion.span>{" "}
                your API workflow?
              </h2>

              <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
                Join developers worldwide who have made Api Studio their daily
                companion. It&apos;s free, open source, and always will be.
              </p>

              {/* Feature highlights */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap justify-center gap-6 mb-10"
              >
                {[
                  {
                    icon: Zap,
                    label: "Lightning Fast",
                    color: "text-yellow-500",
                    bg: "bg-yellow-500/10",
                  },
                  {
                    icon: Shield,
                    label: "Secure & Private",
                    color: "text-blue-500",
                    bg: "bg-blue-500/10",
                  },
                  {
                    icon: Globe,
                    label: "Self-Hostable",
                    color: "text-green-500",
                    bg: "bg-green-500/10",
                  },
                ].map((item) => (
                  <motion.div
                    key={item.label}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="flex items-center gap-2 text-sm text-foreground/80"
                  >
                    <div
                      className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center`}
                    >
                      <item.icon className={`w-4 h-4 ${item.color}`} />
                    </div>
                    <span>{item.label}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <MotionLink
                  href={isSignedIn ? "/workspace" : "/sign-up"}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-lg overflow-hidden shadow-xl shadow-primary/20"
                >
                  {/* Shimmer */}
                  <motion.div
                    className="absolute inset-0 bg-linear-to-r from-transparent via-white/25 to-transparent"
                    animate={{ x: ["-200%", "200%"] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 2,
                    }}
                  />
                  <span className="relative flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    {isSignedIn ? "Open App" : "Get Started Free"}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </MotionLink>

                <motion.a
                  href="https://github.com/rohittiwari-dev/api-client"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 rounded-2xl bg-secondary/50 border border-border hover:bg-secondary hover:text-secondary-foreground font-semibold text-lg transition-all flex items-center gap-2"
                >
                  <Github className="w-5 h-5" />
                  Star on GitHub
                </motion.a>
              </div>

              {/* Trust text */}
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="mt-8 text-sm text-muted-foreground flex items-center justify-center gap-2"
              >
                <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
                No credit card • AGPL-3.0-only Licensed • Self-host anytime
              </motion.p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
