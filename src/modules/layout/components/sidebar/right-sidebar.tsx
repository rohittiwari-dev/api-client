'use client';

import React from 'react';
import { Code, Cookie, FileText, Zap } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import useRightPanelStore from '../../store/right-panel.store';
import RightPanel from './right-panel';

const RightSidebar = () => {
    const { activePanel, togglePanel } = useRightPanelStore();

    const menuData = [
        {
            id: 'request' as const, icon: FileText, tooltip: 'Request Info', className: {
                triggerClassName: 'bg-emerald-500/70 border border-emerald-500/60',
                iconParentClassName: 'bg-emerald-500/70 border border-emerald-500/60',
                iconClassName: 'bg-emerald-500/70 border border-emerald-500/60'
            }
        },
        {
            id: 'environment' as const, icon: Zap, tooltip: 'Environment Variables', className: {
                triggerClassName: 'bg-rose-500/70 border border-rose-500/60',
                iconParentClassName: 'bg-rose-500/70 border border-rose-500/60',
                iconClassName: 'bg-rose-500/70 border border-rose-500/60'
            }
        },
        {
            id: 'code' as const, icon: Code, tooltip: 'Code Snippets', className: {
                triggerClassName: 'bg-indigo-500/70 border border-indigo-500/60',
                iconParentClassName: 'bg-indigo-500/70 border border-indigo-500/60',
                iconClassName: 'bg-indigo-500/70 border border-indigo-500/60'
            }
        },
        {
            id: 'cookies' as const, icon: Cookie, tooltip: 'Cookie Manager', className: {
                triggerClassName: 'bg-pink-500/70 border border-pink-500/60',
                iconParentClassName: 'bg-pink-500/70 border border-pink-500/60',
                iconClassName: 'bg-pink-500/70 border border-pink-500/60'
            }
        },
    ];

    return (
        <>
            {/* Modals/Drawers */}
            <RightPanel />

            {/* Icon Buttons Rail - Glassmorphic with emerald accents */}
            <div className="w-12 border-l border-border/30 space-y-1 bg-background/80 backdrop-blur-md flex flex-col items-center py-3 gap-2">
                <TooltipProvider delayDuration={100}>
                    {menuData.map((item) => {
                        const isActive = activePanel === item.id;
                        return (
                            <Tooltip key={item.id}>
                                <TooltipTrigger
                                    onClick={() => togglePanel(item.id)}
                                    className={cn(
                                        'relative cursor-pointer rounded-lg ',
                                        'flex items-center justify-center',
                                        'transition-all duration-200',
                                        'backdrop-blur-sm',
                                        !isActive
                                            ? item.className.triggerClassName
                                            : 'bg-slate-500/15 border border-slate-500/20'
                                    )}
                                >
                                    <div className={cn(
                                        "flex items-center justify-center !rounded transition-colors size-6",
                                        !isActive ? item.className.iconParentClassName : "bg-slate-500/20"
                                    )}>
                                        <item.icon className={cn(
                                            "size-3.5 transition-colors hover:text-slate-100/60  !text-slate-100",
                                            !isActive
                                            && item.className.iconClassName
                                        )} />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent
                                    side="left"
                                    className="font-medium text-xs bg-popover-foreground/95 backdrop-blur-md border-border/50"
                                >
                                    {item.tooltip}
                                </TooltipContent>
                            </Tooltip>
                        );
                    })}
                </TooltipProvider>
            </div>
        </>
    );
};

export default RightSidebar;
