"use client";

import React, { useState } from "react";
import { LogOut, Mail, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import Avatar from "@/modules/authentication/components/avatar";
import { useAuthStore } from "@/modules/authentication/store";
import { getInitialsFromName } from "@/lib/utils";
import UserInvitationsSheetList from "../../workspace/components/UserInvitationsSheetList";
import authClient from "@/lib/authClient";
import useCookieStore from "@/modules/apis/cookies/store/cookie.store";
import { redirect } from "next/navigation";
import Spinner from "@/components/app-ui/spinner";
import { useUserInvitationsQuery } from "@/modules/workspace/hooks/use-invitaions-query";

export default function WorkspaceUserButton() {
  const { data } = useAuthStore();
  const { setAuthSession } = useAuthStore();
  const { clearCookies } = useCookieStore();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Fetch invitations to show badge/count if needed, or just to know
  const { data: invitations } = useUserInvitationsQuery();
  const pendingCount = invitations?.length || 0;

  const user = data?.user;
  const name = user?.name || "";
  const image = user?.image || "";

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await authClient?.signOut({
      fetchOptions: {
        onSuccess: () => {
          setIsLoggingOut(false);
          setAuthSession({
            session: null,
            user: null,
          });
          clearCookies();
          document.cookie =
            "better-auth.session_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          document.cookie =
            "__Secure-better-auth.session_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          redirect("/sign-in");
        },
        onError: () => {
          setIsLoggingOut(false);
        },
      },
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="outline-none">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-10 w-10 p-0 border border-border/10 hover:bg-muted/50"
          >
            <Avatar
              className="h-8 w-8 rounded-full"
              fallbackClassName="h-8 w-8 rounded-full"
              href={image}
              alt={name}
              initial={getInitialsFromName(name)}
            />
            {pendingCount > 0 && (
              <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-red-500 border-2 border-background" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56" forceMount>
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              {name && <p className="font-medium">{name}</p>}
              {user?.email && (
                <p className="w-[200px] truncate text-xs text-muted-foreground">
                  {user.email}
                </p>
              )}
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setSheetOpen(true)}
            className="cursor-pointer gap-2"
          >
            <Mail className="h-4 w-4" />
            <span>Invitations</span>
            {pendingCount > 0 && (
              <span className="ml-auto text-xs bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded-full">
                {pendingCount}
              </span>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="text-red-600 focus:text-red-600 focus:bg-red-100 dark:focus:bg-red-900/10 cursor-pointer gap-2"
          >
            {isLoggingOut ? (
              <Spinner className="h-4 w-4" />
            ) : (
              <LogOut className="h-4 w-4" />
            )}
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          className="sm:max-w-md w-full backdrop-blur-3xl bg-white/90 dark:bg-neutral-800/30 border-l border-white/20 dark:border-white/10 shadow-[0_0_40px_-10px_rgba(0,0,0,0.1)] p-0 gap-0 fixed top-[2vh] right-[2vh] bottom-[2vh] h-[96vh] rounded-3xl outline-none data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right overflow-hidden ring-1 ring-border/5"
          side="right"
        >
          {/* Subtle Gradient Overlay */}
          <div className="absolute inset-0 bg-linear-to-b from-indigo-500/5 via-transparent to-transparent pointer-events-none" />

          <div className="p-6 h-full flex flex-col relative z-10 w-full">
            <SheetHeader className="text-left mb-6 pb-4 border-b border-border/10">
              <SheetTitle className="text-xl font-bold tracking-tight">
                Your Invitations
              </SheetTitle>
              <SheetDescription className="text-muted-foreground/80">
                Manage your pending workspace invitations.
              </SheetDescription>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto -mx-6 px-6 scrollbar-none hover:scrollbar-thin scrollbar-thumb-muted-foreground/20">
              <UserInvitationsSheetList />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
