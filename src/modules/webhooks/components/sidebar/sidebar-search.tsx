"use client";

import React from "react";
import { Search } from "lucide-react";
import { SidebarInput, useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface SidebarSearchProps {
  value: string;
  onChange: (value: string) => void;
}

const SidebarSearch: React.FC<SidebarSearchProps> = ({ value, onChange }) => {
  const { state } = useSidebar();

  return (
    <div
      className={cn(
        "mt-0 px-4 pb-2 transition-all duration-300",
        state === "collapsed" && "opacity-0 h-0 overflow-hidden"
      )}
    >
      <div className="relative group">
        <div className="absolute inset-0 bg-linear-to-r from-violet-500/10 to-transparent rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/70 group-focus-within:text-violet-500 transition-colors duration-300" />

        <SidebarInput
          placeholder="Filter endpoints..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 pl-10 bg-white/5 border-white/5 hover:bg-white/10 focus:bg-background/80 focus:border-violet-500/30 transition-all duration-300 rounded-xl text-sm placeholder:text-muted-foreground/50 shadow-inner ring-offset-0 focus:ring-0"
        />

        {/* Keyboard shortcut hint could go here */}
      </div>
    </div>
  );
};

export default SidebarSearch;
