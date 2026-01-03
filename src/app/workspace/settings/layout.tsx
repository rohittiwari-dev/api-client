"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  Building2,
  Users,
  ChevronLeft,
  Shield,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import useWorkspaceState from "@/modules/workspace/store";

interface SettingsLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  {
    title: "Profile",
    href: "/workspace/settings/profile",
    icon: User,
    description: "Manage your personal information",
  },
  {
    title: "Security",
    href: "/workspace/settings/security",
    icon: Shield,
    description: "Password and authentication",
  },
  {
    title: "Current Workspace",
    href: "/workspace/settings/workspace",
    icon: Building2,
    description: "Configure workspace settings",
  },
  {
    title: "All Workspaces",
    href: "/workspace/settings/workspaces",
    icon: Layers,
    description: "Manage all your workspaces",
  },
  {
    title: "Team",
    href: "/workspace/settings/team",
    icon: Users,
    description: "Manage team members and roles",
  },
];

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const pathname = usePathname();
  const { activeWorkspace } = useWorkspaceState();
  const slug = activeWorkspace?.slug || "";

  return (
    <div className="min-h-screen bg-background">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[100px]" />
      </div>

      <div className="relative flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border/40 bg-background/60 backdrop-blur-xl p-6 flex flex-col">
          {/* Back Button */}
          <Link href={slug ? `/workspace/${slug}` : "/workspace"}>
            <Button
              variant="ghost"
              size="sm"
              className="mb-6 -ml-2 gap-2 text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="size-4" />
              Back to Workspace
            </Button>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-xl font-semibold tracking-tight">Settings</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your account and preferences
            </p>
          </div>

          {/* Navigation */}
          <nav className="space-y-1 flex-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                    "text-sm font-medium",
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <item.icon className="size-4" />
                  {item.title}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="pt-6 border-t border-border/40">
            <p className="text-xs text-muted-foreground/60">ApiClient v1.0.0</p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-3xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
