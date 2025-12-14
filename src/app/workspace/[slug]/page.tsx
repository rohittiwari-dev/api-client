"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { Tabs } from "@/components/ui/tabs";
import TabBar from "@/modules/requests/components/tab-bar";
import TabContent from "@/modules/requests/components/tab-content";
import { useTabRequestSync } from "@/modules/requests/hooks/use-tab-request-sync";
import { useWorkspaceSwitcher } from "@/modules/workspace/hooks/use-workspace-switcher";
import useWorkspaceState from "@/modules/workspace/store";

const Page = () => {
  const { activeTab, tabs, setActiveById } = useTabRequestSync();
  const { activeWorkspace } = useWorkspaceState();
  const { initializeWorkspaceTracking, currentWorkspaceId } =
    useWorkspaceSwitcher();

  // Initialize workspace tracking when the page loads
  useEffect(() => {
    if (activeWorkspace?.id && currentWorkspaceId !== activeWorkspace.id) {
      initializeWorkspaceTracking(activeWorkspace.id);
    }
  }, [activeWorkspace?.id, currentWorkspaceId, initializeWorkspaceTracking]);

  return (
    <Tabs
      value={activeTab?.id || tabs[0]?.id}
      onValueChange={(id) => {
        // Sync both tab and request stores
        setActiveById(id);
      }}
      className="h-full w-full flex flex-col !gap-0"
    >
      <TabBar />
      <TabContent id={activeTab?.id || tabs[0]?.id} />
      {tabs.length <= 0 && (
        <div className="flex  flex-1 items-center justify-center select-none">
          <div className="flex items-center gap-2 font-medium opacity-25">
            <Image
              src="/logo.png"
              alt="ApiClient"
              width={100}
              height={100}
              priority
              className="h-[160px] w-[170px]"
            />
          </div>
        </div>
      )}
    </Tabs>
  );
};

export default Page;
