"use client";

import React from "react";
import Image from "next/image";
import { Session, User } from "better-auth";
import { Separator } from "@/components/ui/separator";
import ThemeSwitcher from "@/components/app-ui/theme-switcher";
import UserButton from "@/modules/authentication/components/user-button";
import { useAuthStore } from "@/modules/authentication/store";
import SearchPanel from "@/modules/layout/components/Search-Panel";
import EnvironmentDropdown from "@/modules/workspace/components/EnvironmentDropdown";
import WorkspaceInvite from "@/modules/workspace/components/workspace-invite";
import WorkspaceSwitcher from "@/modules/workspace/components/WorkspaceSwitcher";

const Header = ({
  currentUserSession,
}: {
  currentUserSession: { user: User | null; session: Session | null };
}) => {
  const { setAuthSession } = useAuthStore();

  React.useEffect(() => {
    if (currentUserSession) {
      setAuthSession(currentUserSession);
    }
  }, [currentUserSession, setAuthSession]);

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl border-b border-border/30">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.02] via-transparent to-primary/[0.02] pointer-events-none" />

      <div className="relative flex h-[var(--header-height)] items-center justify-between gap-6 px-4">
        {/* Left Section - Brand & Navigation */}
        <div className="flex flex-1 justify-start items-center gap-3">
          {/* Logo */}
          <a
            href="#"
            className="group flex items-center gap-2.5 font-semibold text-foreground transition-all duration-200"
          >
            <div className="relative flex items-center justify-center size-9 rounded-xl bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5 border border-primary/20 shadow-sm group-hover:shadow-md group-hover:border-primary/30 transition-all duration-200 overflow-hidden">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 transition-opacity duration-200" />
              <Image
                src="/logo.png"
                alt="ApiClient"
                width={100}
                height={100}
                priority
                className="relative w-5 h-5 object-contain"
              />
            </div>
            <span className="hidden sm:inline-block text-sm font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
              ApiClient
            </span>
          </a>

          <div className="hidden sm:flex items-center">
            <Separator
              orientation="vertical"
              className="h-5 mx-1 bg-border/50"
            />
          </div>

          {/* Workspace Switcher */}
          <div className="hidden sm:block">
            <WorkspaceSwitcher />
          </div>

          <div className="hidden md:flex items-center">
            <Separator
              orientation="vertical"
              className="h-5 mx-1 bg-border/50"
            />
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 flex justify-center max-w-xl">
          <SearchPanel />
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center flex-1 justify-end gap-1">
          {/* Theme Switcher */}
          <div className="hidden sm:flex items-center">
            <ThemeSwitcher variant="multiple" />
          </div>
          <div className="hidden sm:flex items-center">
            <Separator
              orientation="vertical"
              className="h-5 mx-1 bg-border/50"
            />
          </div>
          {/* Environment */}
          <div className="hidden md:block">
            <EnvironmentDropdown />
          </div>
          <div className="hidden sm:flex items-center">
            <Separator
              orientation="vertical"
              className="h-5 mx-1 bg-border/50"
            />
          </div>
          {/* Workspace Actions */}
          <div className="flex items-center gap-1">
            <UserButton data={currentUserSession!} variant={"header"} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
