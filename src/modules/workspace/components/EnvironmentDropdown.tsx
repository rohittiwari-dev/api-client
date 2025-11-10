'use client';

import React, { useEffect } from 'react';
import { Check, ChevronDown, Settings, Zap, Globe, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import useEnvironmentStore, { EnvironmentState } from '@/modules/environment/store/environment.store';
import { getEnvironmentsByWorkspace } from '@/modules/environment/actions';
import useWorkspaceState from '@/modules/workspace/store';
import useRightPanelStore from '@/modules/layout/store/right-panel.store';
import { toast } from 'sonner';

const EnvironmentDropdown = () => {
    const {
        environments,
        activeEnvironmentId,
        setEnvironments,
        setActiveEnvironment,
    } = useEnvironmentStore();

    const { activeWorkspace } = useWorkspaceState();
    const { setActivePanel } = useRightPanelStore();

    // Load environments when workspace changes
    useEffect(() => {
        if (activeWorkspace?.id) {
            loadEnvironments();
        }
    }, [activeWorkspace?.id]);

    const loadEnvironments = async () => {
        if (!activeWorkspace?.id) return;
        try {
            const envs = await getEnvironmentsByWorkspace(activeWorkspace.id);
            const mapped = envs.map((env): EnvironmentState => ({
                id: env.id,
                name: env.name,
                description: env.description,
                variables: Array.isArray(env.variables) ? env.variables as any : [],
                isGlobal: env.isGlobal,
                workspaceId: env.workspaceId,
            }));
            setEnvironments(mapped);
        } catch (error) {
            console.error('Failed to load environments', error);
        }
    };

    const activeEnv = environments.find((e) => e.id === activeEnvironmentId);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="h-auto py-1.5 px-2 gap-2 hover:bg-muted/50 rounded-xl transition-all group border border-transparent hover:border-border/40 max-w-[240px] focus-visible:ring-0 focus-visible:ring-offset-0"
                >
                    <div className={cn(
                        "size-7 rounded-lg flex items-center justify-center border transition-colors shrink-0",
                        activeEnv
                            ? "bg-emerald-500/10 border-emerald-500/20 group-hover:border-emerald-500/30"
                            : "bg-muted border-transparent group-hover:border-border/40"
                    )}>
                        <Zap className={cn(
                            "size-3.5",
                            activeEnv ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
                        )} />
                    </div>
                    <div className="flex flex-col items-start gap-px text-left min-w-0 flex-1">
                        <span className="text-[9px] uppercase font-bold text-muted-foreground/70 tracking-wider leading-none">
                            Environment
                        </span>
                        <div className="flex items-center gap-1.5 w-full">
                            <span className={cn(
                                "text-sm font-semibold truncate block w-full leading-none mt-0.5",
                                activeEnv ? "text-emerald-700 dark:text-emerald-400" : "text-muted-foreground"
                            )}>
                                {activeEnv?.name || 'No Environment'}
                            </span>
                            <ChevronDown className="size-3 text-muted-foreground/50 group-hover:text-foreground transition-colors shrink-0" />
                        </div>
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 p-1.5">
                {/* Header */}
                <div className="px-2 py-1.5 mb-1">
                    <p className="text-xs font-semibold text-foreground">Environments</p>
                    <p className="text-[10px] text-muted-foreground">Select active environment</p>
                </div>

                <DropdownMenuSeparator className="my-1" />

                {/* No Environment option */}
                <div className="flex flex-col gap-1">
                    <DropdownMenuItem
                        onClick={() => {
                            setActiveEnvironment(null);
                            toast.success('Environment cleared');
                        }}
                        className={cn(
                            "gap-3 py-2 px-2 rounded-md cursor-pointer",
                            !activeEnvironmentId && "bg-muted/50"
                        )}
                    >
                        <div className="flex items-center justify-center size-7 rounded-md bg-muted">
                            <Globe className="size-3.5 text-muted-foreground" />
                        </div>
                        <div className="flex flex-col flex-1">
                            <span className="text-xs font-medium">No Environment</span>
                            <span className="text-[10px] text-muted-foreground">Use without variables</span>
                        </div>
                        {!activeEnvironmentId && <Check className="size-4 text-primary" />}
                    </DropdownMenuItem>

                    {/* Environment list */}
                    {environments.length > 0 && (
                        <>
                            {environments.map((env) => (
                                <DropdownMenuItem
                                    key={env.id}
                                    onClick={() => {
                                        setActiveEnvironment(env.id);
                                        toast.success(`Active: ${env.name}`);
                                    }}
                                    className={cn(
                                        "gap-3 py-2 px-2 rounded-md cursor-pointer",
                                        activeEnvironmentId === env.id && "bg-emerald-500/10"
                                    )}
                                >
                                    <div className={cn(
                                        "flex items-center justify-center size-7 rounded-md",
                                        activeEnvironmentId === env.id
                                            ? "bg-emerald-500/20"
                                            : "bg-muted"
                                    )}>
                                        <Zap className={cn(
                                            "size-3.5",
                                            activeEnvironmentId === env.id
                                                ? "text-emerald-500"
                                                : "text-muted-foreground"
                                        )} />
                                    </div>
                                    <div className="flex flex-col flex-1 min-w-0">
                                        <span className={cn(
                                            "text-xs font-medium truncate",
                                            activeEnvironmentId === env.id && "text-emerald-600 dark:text-emerald-400"
                                        )}>
                                            {env.name}
                                        </span>
                                        {env.description && (
                                            <span className="text-[10px] text-muted-foreground truncate">
                                                {env.description}
                                            </span>
                                        )}
                                    </div>
                                    {activeEnvironmentId === env.id && (
                                        <Check className="size-4 text-emerald-500 shrink-0" />
                                    )}
                                </DropdownMenuItem>
                            ))}
                        </>
                    )}
                </div>

                <DropdownMenuSeparator className="my-1" />

                {/* Manage environments */}
                <DropdownMenuItem
                    onClick={() => setActivePanel('environment')}
                    className="gap-3 py-2 px-2 rounded-md cursor-pointer text-muted-foreground hover:text-foreground"
                >
                    <div className="flex items-center justify-center size-7 rounded-md bg-primary/10">
                        <Settings className="size-3.5 text-primary" />
                    </div>
                    <span className="text-xs font-medium">Manage Environments</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default EnvironmentDropdown;
