"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { SidebarItemInterface, SidebarCollectionItemInterface } from "../../store/sidebar.store";
import { SidebarFile } from "./SidebarFile";
import { SidebarFolder } from "./SidebarFolder";
import { useSidebarTree } from "./SidebarTreeContext";

interface SidebarItemProps {
    item: SidebarItemInterface;
}

export function SidebarItem({ item }: SidebarItemProps) {
    const { activeId, justMovedId, dropPosition, overId } = useSidebarTree();

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.id });

    // Ghost placeholder stays in place with NO transform during drag
    const style: React.CSSProperties = {
        transform: CSS.Translate.toString(transform),
        transition,
    };

    const isOver = overId === item.id;
    const isJustMoved = justMovedId === item.id;

    // Drop Indicators
    // We render them conditionally based on global context match
    const showDropBefore = isOver && dropPosition === "before";
    const showDropAfter = isOver && dropPosition === "after";

    return (
        <motion.li
            layout={!isJustMoved}
            animate={isJustMoved ? { scale: [0.98, 1], opacity: [0, 1] } : { scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={cn(
                "relative group/item outline-none",
                isDragging && "opacity-40 z-0",
                // We apply z-index relative to prevent overlapping issues
                // But dragging item usually needs high z-index, handled by overlay.
                // Here we just dim the original.
            )}
        >
            {/* Drop indicator - before */}
            {showDropBefore && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary z-[100] rounded-full pointer-events-none" />
            )}

            {/* Drop indicator - after */}
            {showDropAfter && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary z-[100] rounded-full pointer-events-none" />
            )}

            {item.type === "COLLECTION" ? (
                <SidebarFolder item={item as SidebarCollectionItemInterface} />
            ) : (
                <SidebarFile item={item} />
            )}
        </motion.li>
    );
}
