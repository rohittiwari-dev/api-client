'use client';

import React, { useEffect, useState } from 'react';
import {
    Plus,
    Trash2,
    Check,
    Globe,
    Eye,
    EyeOff,
    Zap,
    MoreHorizontal,
    Search,
    Lock,
    Unlock,
    Copy,
    LayoutGrid,
    List
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import useEnvironmentStore, {
    EnvironmentState,
    EnvironmentVariable,
} from '@/modules/environment/store/environment.store';
import {
    createEnvironmentAction,
    deleteEnvironmentAction,
    getEnvironmentsByWorkspace,
    updateEnvironmentAction,
} from '@/modules/environment/actions';
import useWorkspaceState from '@/modules/workspace/store';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const EnvironmentSwitcher = () => {
    const {
        environments,
        activeEnvironmentId,
        setEnvironments,
        setActiveEnvironment,
        addEnvironment,
        updateEnvironment,
        removeEnvironment,
    } = useEnvironmentStore();

    const { activeWorkspace } = useWorkspaceState();
    const [selectedEnvId, setSelectedEnvId] = useState<string | null>(null);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [newEnvName, setNewEnvName] = useState('');
    const [editedVariables, setEditedVariables] = useState<EnvironmentVariable[]>([]);
    const [revealedRows, setRevealedRows] = useState<Set<number>>(new Set());
    const [searchTerm, setSearchTerm] = useState('');
    const [envSearchTerm, setEnvSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

    const toggleRowVisibility = (index: number) => {
        setRevealedRows(prev => {
            const newSet = new Set(prev);
            if (newSet.has(index)) {
                newSet.delete(index);
            } else {
                newSet.add(index);
            }
            return newSet;
        });
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard');
    };

    useEffect(() => {
        if (!selectedEnvId && activeEnvironmentId) {
            setSelectedEnvId(activeEnvironmentId);
        } else if (!selectedEnvId && environments.length > 0) {
            setSelectedEnvId(environments[0].id);
        }
    }, [activeEnvironmentId, environments, selectedEnvId]);

    useEffect(() => {
        if (selectedEnvId) {
            const env = environments.find(e => e.id === selectedEnvId);
            if (env) {
                setEditedVariables(env.variables || []);
            }
        }
    }, [selectedEnvId, environments]);

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
                variables: Array.isArray(env.variables) ? env.variables as unknown as EnvironmentVariable[] : [],
                isGlobal: env.isGlobal,
                workspaceId: env.workspaceId,
            }));
            setEnvironments(mapped);
        } catch (error) {
            console.error('Failed to load environments', error);
        }
    };

    const handleCreate = async () => {
        if (!activeWorkspace?.id || !newEnvName.trim()) return;
        try {
            const env = await createEnvironmentAction(
                activeWorkspace.id,
                newEnvName.trim(),
                []
            );
            const newEnv: EnvironmentState = {
                id: env.id,
                name: env.name,
                description: env.description,
                variables: [],
                isGlobal: env.isGlobal,
                workspaceId: env.workspaceId,
            };
            addEnvironment(newEnv);
            setNewEnvName('');
            setIsCreateDialogOpen(false);
            setSelectedEnvId(newEnv.id);
            toast.success('Environment created');
        } catch (error) {
            toast.error('Failed to create environment');
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await deleteEnvironmentAction(id);
            removeEnvironment(id);
            if (selectedEnvId === id) {
                setSelectedEnvId(environments[0]?.id || null);
            }
            if (activeEnvironmentId === id) {
                setActiveEnvironment(null);
            }
            toast.success('Environment deleted');
        } catch (error) {
            toast.error('Failed to delete environment');
        }
    };

    const handleVariableChange = (index: number, field: keyof EnvironmentVariable, value: string | boolean) => {
        const newVars = [...editedVariables];
        newVars[index] = { ...newVars[index], [field]: value };
        setEditedVariables(newVars);
    };

    const handleAddVariable = () => {
        setEditedVariables([...editedVariables, { key: '', value: '', enabled: true, type: 'default' }]);
    };

    const handleRemoveVariable = (index: number) => {
        setEditedVariables(editedVariables.filter((_, i) => i !== index));
    };

    const handleSaveVariables = async () => {
        if (!selectedEnvId) return;
        try {
            const validVariables = editedVariables.filter(v => v.key.trim() !== '');
            await updateEnvironmentAction(selectedEnvId, { variables: validVariables });
            updateEnvironment(selectedEnvId, { variables: validVariables });
            setEditedVariables(validVariables);
            toast.success('Variables saved successfully');
        } catch (error) {
            toast.error('Failed to save variables');
        }
    };

    const selectedEnv = environments.find(e => e.id === selectedEnvId);

    // Filter variables for display
    const filteredVariables = editedVariables.map((v, i) => ({ ...v, originalIndex: i }))
        .filter(v =>
            v.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
            v.value.toLowerCase().includes(searchTerm.toLowerCase())
        );

    const filteredEnvironments = environments.filter(env =>
        env.name.toLowerCase().includes(envSearchTerm.toLowerCase())
    );

    return (
        <div className="flex h-full w-full bg-background rounded-xl overflow-hidden shadow-sm border border-border/40">
            {/* Sidebar list */}
            <div className="w-[280px] border-r border-border/40 bg-muted/5 flex flex-col">
                <div className="p-4 border-b border-border/40 bg-background/95 backdrop-blur-sm sticky top-0 z-10">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold tracking-wide flex items-center gap-2">
                            Env Manager
                            <Badge variant="secondary" className="text-[10px] h-5 px-1.5">{environments.length}</Badge>
                        </span>
                        <Button
                            variant="default"
                            size="icon"
                            className="h-7 w-7 bg-foreground text-background hover:bg-foreground/90 rounded-lg shadow-sm"
                            onClick={() => setIsCreateDialogOpen(true)}
                        >
                            <Plus className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                        <Input
                            className="h-8 pl-8 text-xs bg-background border-border/60 focus-visible:ring-1 focus-visible:ring-ring"
                            placeholder="Find environment..."
                            value={envSearchTerm}
                            onChange={(e) => setEnvSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <ScrollArea className="flex-1 px-3 py-3">
                    <div className="space-y-1">
                        {filteredEnvironments.map(env => {
                            const isActive = activeEnvironmentId === env.id;
                            const isSelected = selectedEnvId === env.id;

                            return (
                                <div
                                    key={env.id}
                                    className={cn(
                                        "group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm cursor-pointer transition-all duration-200 border relative overflow-hidden",
                                        isSelected
                                            ? "bg-background border-border shadow-sm"
                                            : "bg-transparent border-transparent hover:bg-muted/50 hover:border-border/30 text-muted-foreground hover:text-foreground",
                                    )}
                                    onClick={() => setSelectedEnvId(env.id)}
                                >
                                    {isSelected && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-l-xl" />
                                    )}
                                    <div className={cn("flex items-center gap-3 min-w-0 transition-transform duration-200", isSelected ? "translate-x-1.5" : "")}>
                                        <div className={cn(
                                            "size-8 rounded-lg flex items-center justify-center shrink-0 transition-colors border",
                                            isActive
                                                ? "bg-emerald-500 text-white border-emerald-600 shadow-sm shadow-emerald-500/20"
                                                : "bg-muted border-transparent group-hover:bg-background group-hover:border-border/50 text-muted-foreground"
                                        )}>
                                            <Zap className={cn("size-3.5", isActive && "fill-current")} />
                                        </div>
                                        <div className="flex flex-col min-w-0 gap-0.5">
                                            <span className={cn(
                                                "truncate font-medium leading-none",
                                                isSelected ? "text-foreground" : ""
                                            )}>{env.name}</span>
                                            <span className="text-[10px] text-muted-foreground truncate">
                                                {(env.variables || []).length} variables
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity translate-x-1 group-hover:translate-x-0">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:bg-muted">
                                                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48">
                                                {!isActive && (
                                                    <DropdownMenuItem onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveEnvironment(env.id);
                                                        toast.success(`Active: ${env.name}`);
                                                    }}>
                                                        <Check className="mr-2 h-4 w-4" /> Set as Active
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuItem onClick={(e) => {
                                                    e.stopPropagation();
                                                    copyToClipboard(JSON.stringify(env.variables, null, 2));
                                                }}>
                                                    <Copy className="mr-2 h-4 w-4" /> Copy Variables
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={(e) => handleDelete(env.id, e as any)}
                                                    className="text-destructive focus:text-destructive"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </ScrollArea>
                <div className="p-3 border-t border-border/40 bg-muted/10 text-[10px] text-muted-foreground text-center">
                    Environment variables are stored locally
                </div>
            </div>

            {/* Main Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-background/50 h-full overflow-hidden">
                {selectedEnv ? (
                    <>
                        <div className="px-8 py-6 border-b border-border/40 flex flex-col gap-6 sticky top-0 bg-background/95 backdrop-blur z-20 shrink-0">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="size-12 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 flex items-center justify-center shadow-sm">
                                        <Globe className="size-6 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <h2 className="text-xl font-bold tracking-tight text-foreground">{selectedEnv.name}</h2>
                                            {activeEnvironmentId === selectedEnv.id && (
                                                <Badge variant="outline" className="bg-emerald-500/5 text-emerald-600 border-emerald-200 dark:border-emerald-800 h-5">
                                                    Active Context
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground">Manage and configure your environment variables</p>
                                    </div>
                                </div>

                                <Button onClick={handleSaveVariables} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow transition-all font-medium rounded-lg px-6">
                                    Save Changes
                                </Button>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="relative flex-1 group">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-emerald-500 transition-colors" />
                                    <Input
                                        className="h-10 pl-9 text-sm bg-muted/30 border-transparent hover:border-border/60 hover:bg-muted/50 focus-visible:bg-background focus-visible:border-emerald-500/50 focus-visible:ring-2 focus-visible:ring-emerald-500/20 transition-all rounded-xl"
                                        placeholder="Filter keys or values..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <Tabs value={viewMode} onValueChange={(v: any) => setViewMode(v)} className="w-[120px]">
                                    <TabsList className="grid w-full grid-cols-2 h-10 rounded-xl bg-muted/40 p-1">
                                        <TabsTrigger value="list" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"><List className="size-4" /></TabsTrigger>
                                        <TabsTrigger value="grid" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"><LayoutGrid className="size-4" /></TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col min-h-0 bg-muted/5 h-full overflow-hidden">
                            {/* Header Row */}
                            <div className="grid grid-cols-[32px_1fr_1fr_100px_32px] gap-4 px-6 py-2 border-b border-border/40 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest bg-background/50 shrink-0">
                                <div className="flex items-center justify-center">On</div>
                                <div>Variable Key</div>
                                <div>Value</div>
                                <div>Type</div>
                                <div className="text-center">Del</div>
                            </div>

                            <ScrollArea className="flex-1 h-full">
                                <div className={cn("p-4 pb-20", viewMode === 'grid' ? "grid grid-cols-2 gap-4" : "space-y-px")}>
                                    {filteredVariables.map(({ originalIndex: index, ...variable }) => {
                                        const isSecret = variable.type === 'secret';
                                        const isRevealed = revealedRows.has(index);

                                        if (viewMode === 'grid') {
                                            return (
                                                <div
                                                    key={index}
                                                    className={cn(
                                                        "group relative p-4 rounded-xl border bg-background transition-all duration-200 hover:shadow-md hover:-translate-y-0.5",
                                                        !variable.enabled ? "opacity-60 border-dashed" : "border-border/60 hover:border-emerald-500/30"
                                                    )}
                                                >
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="flex items-center gap-2">
                                                            <Checkbox
                                                                checked={variable.enabled}
                                                                onCheckedChange={(checked) => handleVariableChange(index, 'enabled', Boolean(checked))}
                                                                className="size-4 rounded-md data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                                                            />
                                                            <Badge variant="outline" className={cn(
                                                                "h-5 text-[10px] px-1.5 font-normal",
                                                                isSecret ? "border-amber-200/50 text-amber-600 bg-amber-500/10 dark:border-amber-800/50 dark:text-amber-400" : "border-border text-muted-foreground bg-muted/50"
                                                            )}>
                                                                {isSecret ? <Lock className="size-2.5 mr-1" /> : <Unlock className="size-2.5 mr-1" />}
                                                                {isSecret ? "Secret" : "Plain"}
                                                            </Badge>
                                                        </div>
                                                        <button
                                                            onClick={() => handleRemoveVariable(index)}
                                                            className="text-muted-foreground/30 hover:text-rose-500 transition-colors"
                                                        >
                                                            <Trash2 className="size-4" />
                                                        </button>
                                                    </div>
                                                    <div className="space-y-3">
                                                        <div>
                                                            <label className="text-[10px] uppercase font-bold text-muted-foreground/50 mb-1 block">Key</label>
                                                            <Input
                                                                value={variable.key}
                                                                onChange={(e) => handleVariableChange(index, 'key', e.target.value)}
                                                                placeholder="VARIABLE_KEY"
                                                                className="h-8 font-mono text-xs border-transparent bg-muted/30 focus-visible:bg-background focus-visible:border-emerald-500/50 px-2 rounded-lg"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="text-[10px] uppercase font-bold text-muted-foreground/50 mb-1 block">Value</label>
                                                            <div className="relative">
                                                                <Input
                                                                    type={!isSecret || isRevealed ? 'text' : 'password'}
                                                                    value={variable.value}
                                                                    onChange={(e) => handleVariableChange(index, 'value', e.target.value)}
                                                                    placeholder="Value"
                                                                    className={cn(
                                                                        "h-8 font-mono text-xs border-transparent bg-muted/30 focus-visible:bg-background focus-visible:border-emerald-500/50 px-2 pr-8 rounded-lg",
                                                                        isSecret && "text-emerald-600 font-medium"
                                                                    )}
                                                                />
                                                                {isSecret && (
                                                                    <button
                                                                        onClick={() => toggleRowVisibility(index)}
                                                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors"
                                                                    >
                                                                        {isRevealed ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        }

                                        return (
                                            <div
                                                key={index}
                                                className={cn(
                                                    "group grid grid-cols-[32px_1fr_1fr_100px_32px] gap-4 px-6 py-1.5 rounded-lg border border-transparent transition-all duration-200 items-center hover:bg-white dark:hover:bg-accent/50",
                                                )}
                                            >
                                                {/* Checkbox */}
                                                <div className="flex items-center justify-center">
                                                    <Checkbox
                                                        checked={variable.enabled}
                                                        onCheckedChange={(checked) => handleVariableChange(index, 'enabled', Boolean(checked))}
                                                        className="size-4 rounded-md data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 shadow-sm"
                                                    />
                                                </div>

                                                {/* Key */}
                                                <div className="relative">
                                                    <Input
                                                        value={variable.key}
                                                        onChange={(e) => handleVariableChange(index, 'key', e.target.value)}
                                                        placeholder="VARIABLE_KEY"
                                                        className="h-8 font-mono text-xs border-transparent bg-transparent hover:bg-muted/40 focus-visible:bg-background focus-visible:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-500/10 px-2.5 rounded-md transition-all"
                                                    />
                                                </div>

                                                {/* Value */}
                                                <div className="relative group/value">
                                                    <Input
                                                        type={!isSecret || isRevealed ? 'text' : 'password'}
                                                        value={variable.value}
                                                        onChange={(e) => handleVariableChange(index, 'value', e.target.value)}
                                                        placeholder="Value"
                                                        className={cn(
                                                            "h-8 font-mono text-xs border-transparent bg-transparent hover:bg-muted/40 focus-visible:bg-background focus-visible:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-500/10 px-2.5 pr-8 rounded-md transition-all",
                                                            isSecret && "text-emerald-600 dark:text-emerald-400 font-medium tracking-wide"
                                                        )}
                                                    />
                                                    {isSecret && (
                                                        <button
                                                            onClick={() => toggleRowVisibility(index)}
                                                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-muted-foreground/40 hover:text-emerald-600 hover:bg-emerald-50 transition-all opacity-0 group-hover/value:opacity-100"
                                                        >
                                                            {isRevealed ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                                                        </button>
                                                    )}
                                                </div>

                                                {/* Type Toggle */}
                                                <div className="flex items-center">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleVariableChange(index, 'type', isSecret ? 'default' : 'secret')}
                                                        className={cn(
                                                            "h-7 px-2 rounded-md text-[10px] font-medium w-full justify-start gap-1.5 hover:bg-transparent border",
                                                            isSecret
                                                                ? "text-amber-600 bg-amber-500/10 border-amber-200/50 dark:border-amber-800/50 dark:text-amber-400"
                                                                : "text-muted-foreground bg-muted/50 border-border"
                                                        )}
                                                    >
                                                        {isSecret ? <Lock className="size-2.5" /> : <Unlock className="size-2.5" />}
                                                        {isSecret ? "Secret" : "Plain"}
                                                    </Button>
                                                </div>

                                                {/* Delete */}
                                                <div className="flex justify-center">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleRemoveVariable(index)}
                                                        className="h-7 w-7 rounded-md text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 transition-all"
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    <div className="pt-2 pb-8">
                                        <button
                                            onClick={handleAddVariable}
                                            className="w-full h-10 flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground/60 hover:text-emerald-600 border-2 border-dashed border-border/40 hover:border-emerald-500/30 hover:bg-emerald-50/10 rounded-lg transition-all group"
                                        >
                                            <div className="size-5 rounded-full bg-muted group-hover:bg-emerald-500/10 flex items-center justify-center transition-colors">
                                                <Plus className="size-3" />
                                            </div>
                                            Add New Variable
                                        </button>
                                    </div>
                                </div>
                            </ScrollArea>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 bg-muted/5">
                        <div className="size-20 rounded-3xl bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border border-emerald-500/10 flex items-center justify-center mb-6 shadow-sm">
                            <Zap className="size-8 text-emerald-500/30" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">No Environment Selected</h3>
                        <p className="text-sm max-w-[280px] text-center mb-6">
                            Select an environment from the sidebar to manage its variables or create a new one.
                        </p>
                        <Button onClick={() => setIsCreateDialogOpen(true)} variant="outline" className="gap-2">
                            <Plus className="size-4" />
                            Create Environment
                        </Button>
                    </div>
                )}
            </div>

            {/* Create Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="max-w-md gap-0 p-0 overflow-hidden border-none shadow-2xl">
                    <div className="bg-gradient-to-br from-emerald-500/5 via-background to-background p-6">
                        <DialogHeader className="mb-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="size-12 rounded-2xl bg-white shadow-sm border border-emerald-100 flex items-center justify-center">
                                    <Globe className="size-6 text-emerald-500" />
                                </div>
                                <div>
                                    <DialogTitle className="text-xl">New Environment</DialogTitle>
                                    <DialogDescription className="text-emerald-950/60">
                                        Configure a new isolated environment for your project.
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold uppercase text-muted-foreground/70 mb-1.5 block">Environment Name</label>
                                <Input
                                    placeholder="e.g. Production, Staging, Local..."
                                    value={newEnvName}
                                    onChange={(e) => setNewEnvName(e.target.value)}
                                    className="h-11 bg-white/50 border-border/60 focus-visible:ring-emerald-500/20 text-lg"
                                    autoFocus
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="p-4 bg-muted/20 border-t border-border/40 gap-3">
                        <Button variant="ghost" onClick={() => setIsCreateDialogOpen(false)} className="hover:bg-transparent hover:text-foreground">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCreate}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[120px] shadow-lg shadow-emerald-500/20"
                        >
                            Create Environment
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default EnvironmentSwitcher;
