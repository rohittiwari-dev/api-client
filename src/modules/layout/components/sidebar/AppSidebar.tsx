"use client";

import * as React from "react";
import { createId } from "@paralleldrive/cuid2";
import {
  ChevronRight,
  ChevronDown,
  ChevronsDownUp,
  Code2,
  Edit2,
  MoreVertical,
  Move,
  Plus,
} from "lucide-react";
import { IconFolderFilled } from "@tabler/icons-react";
import { IconSocketIO, IconWebSocket } from "@/assets/app-icons";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarRail,
} from "@/components/ui/sidebar";
import useRequestStore from "@/modules/requests/store/request.store";
import useWorkspaceState from "@/modules/workspace/store";
import AddNewCollection from "../../../collections/components/AddNewCollection";
import useSidebarStore, {
  SidebarItemInterface,
} from "../../store/sidebar.store";
import { useRequestSideBarTree } from "../../hooks/queries";
import { DraggableSidebarTree } from "./DraggableSidebarTree";

export function AppSidebar({
  sidebarData,
  workspaceId,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  sidebarData: SidebarItemInterface[];
  workspaceId: string;
}) {
  const { setItems } = useSidebarStore();
  const { activeWorkspace } = useWorkspaceState();
  const [collapseKey, setCollapseKey] = React.useState(0);

  const { data: sidebarCachedData } = useRequestSideBarTree(
    workspaceId || activeWorkspace?.id || "",
    sidebarData
  );

  // Sync sidebar store from server cache
  React.useEffect(() => {
    if (sidebarCachedData) {
      setItems(sidebarCachedData);
    }
  }, [sidebarCachedData, setItems]);

  const handleCollapseAll = () => {
    setCollapseKey((prev) => prev + 1);
  };

  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]! border-r-0 "
      {...props}
    >
      <SidebarContent className="pt-3 bg-gradient-to-b from-sidebar to-background/95">
        <SidebarGroup>
          {/* Header Section */}
          <SidebarGroupLabel className="sticky top-0 z-10 !min-h-fit flex justify-between items-center gap-2 px-3 !py-2 w-full mb-3 rounded-lg bg-muted/50 backdrop-blur-sm border border-border/40">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center size-6 rounded-md bg-primary/10">
                <IconFolderFilled className="size-3.5 text-primary" />
              </div>
              <span className="font-semibold text-sm text-foreground">
                Collections
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 hover:bg-accent/80 rounded-lg transition-colors"
                onClick={handleCollapseAll}
                title="Collapse All Folders"
              >
                <ChevronsDownUp className="size-3.5 text-muted-foreground" />
              </Button>
              <AddNewCollectionOption workspaceId={workspaceId} />
            </div>
          </SidebarGroupLabel>

          {/* Tree Content */}
          <SidebarGroupContent>
            <DraggableSidebarTree
              workspaceId={workspaceId}
              collapseKey={collapseKey}
            />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail className="hover:after:bg-primary/20 after:transition-colors" />
    </Sidebar>
  );
}

const AddNewCollectionOption = ({ workspaceId }: { workspaceId: string }) => {
  const { addRequest } = useRequestStore();
  const [showAddCollectionDialog, setShowAddCollectionDialog] =
    React.useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:bg-accent/60"
          >
            <Plus className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 p-1.5">
          <DropdownMenuItem
            className="gap-3 cursor-pointer py-2 px-2.5 rounded-md focus:bg-emerald-500/10 focus:text-emerald-600 dark:focus:text-emerald-400"
            onClick={(e) => {
              const id = createId();
              e.stopPropagation();
              addRequest({
                id,
                type: "API",
                name: "New Request",
                url: "",
                method: "GET",
                unsaved: true,
                collectionId: null,
                workspaceId,
                body: {
                  raw: "",
                  formData: [],
                  urlEncoded: [],
                  file: null,
                  json: {},
                },
                auth: { type: "NONE" },
                headers: [],
                parameters: [],
                bodyType: "NONE",
                description: "",
                messageType: "CONNECTION",
                createdAt: new Date(),
                updatedAt: new Date(),
                savedMessages: [],
                sortOrder: 0,
              });
            }}
          >
            <div className="flex items-center justify-center size-7 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Code2 className="size-3.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">HTTP Request</span>
              <span className="text-xs text-muted-foreground">
                Create new API request
              </span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="gap-3 cursor-pointer py-2 px-2.5 rounded-md focus:bg-blue-500/10 focus:text-blue-600 dark:focus:text-blue-400"
            onClick={(e) => {
              const id = createId();
              e.stopPropagation();
              addRequest({
                id,
                type: "WEBSOCKET",
                name: "New Request",
                url: "",
                method: null,
                unsaved: true,
                collectionId: null,
                workspaceId,
                body: {
                  raw: "",
                  formData: [],
                  urlEncoded: [],
                  file: null,
                  json: {},
                },
                auth: { type: "NONE" },
                headers: [],
                parameters: [],
                bodyType: "NONE",
                description: "",
                messageType: "CONNECTION",
                createdAt: new Date(),
                updatedAt: new Date(),
                savedMessages: [],
                sortOrder: 0,
              });
            }}
          >
            <div className="flex items-center justify-center size-7 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <IconWebSocket className="size-3.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">WebSocket</span>
              <span className="text-xs text-muted-foreground">
                Real-time connection
              </span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="gap-3 cursor-pointer py-2 px-2.5 rounded-md focus:bg-green-500/10 focus:text-green-600 dark:focus:text-green-400"
            onClick={(e) => {
              const id = createId();
              e.stopPropagation();
              addRequest({
                id,
                type: "SOCKET_IO",
                name: "New Request",
                url: "",
                method: null,
                unsaved: true,
                collectionId: null,
                workspaceId,
                body: {
                  raw: "",
                  formData: [],
                  urlEncoded: [],
                  file: null,
                  json: {},
                },
                auth: { type: "NONE" },
                headers: [],
                parameters: [],
                bodyType: "NONE",
                description: "",
                messageType: "CONNECTION",
                createdAt: new Date(),
                updatedAt: new Date(),
                savedMessages: [],
                sortOrder: 0,
              });
            }}
          >
            <div className="flex items-center justify-center size-7 rounded-md bg-green-500/10 text-green-600 dark:text-green-400">
              <IconSocketIO className="size-3.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Socket.IO</span>
              <span className="text-xs text-muted-foreground">
                Event-based connection
              </span>
            </div>
          </DropdownMenuItem>

          <div className="h-px bg-border my-1.5" />

          <DropdownMenuItem
            className="gap-3 cursor-pointer py-2 px-2.5 rounded-md focus:bg-amber-500/10 focus:text-amber-600 dark:focus:text-amber-400"
            onClick={(e) => {
              e.stopPropagation();
              setShowAddCollectionDialog(true);
            }}
          >
            <div className="flex items-center justify-center size-7 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <IconFolderFilled className="size-3.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Collection</span>
              <span className="text-xs text-muted-foreground">
                Organize requests
              </span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AddNewCollection
        open={showAddCollectionDialog}
        onOpenChange={setShowAddCollectionDialog}
        parentID={undefined}
      />
    </>
  );
};
