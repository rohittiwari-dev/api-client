import React, { useState, useMemo } from "react";
import {
  IconTrash,
  IconPlayerPlay,
  IconEdit,
  IconCheck,
  IconX,
  IconBraces,
  IconFileText,
  IconBinary,
  IconPlus,
  IconSearch,
  IconDeviceFloppy,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { type ArgFormat, type SocketIOArg } from "./SocketIOMessageComposer";

export interface SavedSocketIOArgs {
  id: string;
  name: string;
  eventName: string;
  args: SocketIOArg[];
  ack: boolean;
  createdAt: number;
}

interface SocketIOSavedArgsProps {
  savedArgs: SavedSocketIOArgs[];
  onSavedArgsChange: (args: SavedSocketIOArgs[]) => void;
  onSelect: (savedArgs: SavedSocketIOArgs) => void;
  className?: string;
}

const formatIcons: Record<ArgFormat, React.ReactNode> = {
  text: <IconFileText className="size-3" />,
  json: <IconBraces className="size-3" />,
  binary: <IconBinary className="size-3" />,
};

const SocketIOSavedArgs: React.FC<SocketIOSavedArgsProps> = ({
  savedArgs,
  onSavedArgsChange,
  onSelect,
  className,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [detailsItem, setDetailsItem] = useState<SavedSocketIOArgs | null>(
    null
  );

  // Filter saved args by search
  const filteredArgs = useMemo(() => {
    if (!searchQuery) return savedArgs;
    const query = searchQuery.toLowerCase();
    return savedArgs.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.eventName.toLowerCase().includes(query)
    );
  }, [savedArgs, searchQuery]);

  // Start editing name
  const handleStartEdit = (item: SavedSocketIOArgs) => {
    setEditingId(item.id);
    setEditingName(item.name);
  };

  // Save edited name
  const handleSaveEdit = () => {
    if (!editingId || !editingName.trim()) return;
    onSavedArgsChange(
      savedArgs.map((item) =>
        item.id === editingId ? { ...item, name: editingName.trim() } : item
      )
    );
    setEditingId(null);
    setEditingName("");
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  // Delete saved args
  const handleDelete = () => {
    if (!deleteConfirmId) return;
    onSavedArgsChange(savedArgs.filter((item) => item.id !== deleteConfirmId));
    setDeleteConfirmId(null);
  };

  // Handle key down
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSaveEdit();
    }
    if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      <div className="flex items-center gap-2 p-3 border-b border-indigo-500/15">
        <h3 className="text-xs font-bold text-foreground">Saved Messages</h3>
        <Badge
          variant="secondary"
          className="text-[10px] px-1.5 py-0 h-4 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 font-bold"
        >
          {savedArgs.length}
        </Badge>
      </div>

      {/* Search */}
      {savedArgs.length > 3 && (
        <div className="px-3 py-2 border-b border-border/30">
          <div className="relative">
            <IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-indigo-500/50" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-7 pl-8 text-[11px] rounded-md border-border/50 bg-background/50"
            />
          </div>
        </div>
      )}

      {/* Saved Args List */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-2 space-y-1">
          {filteredArgs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground gap-2">
              {savedArgs.length === 0 ? (
                <>
                  <div className="size-12 rounded-lg bg-linear-to-br from-indigo-500/20 to-violet-500/10 border border-indigo-500/20 flex items-center justify-center">
                    <IconDeviceFloppy className="size-6 text-indigo-500/40" />
                  </div>
                  <span className="text-[11px] text-center px-4">
                    No saved args yet. Save args from the composer for quick
                    access.
                  </span>
                </>
              ) : (
                <>
                  <IconSearch className="size-6 text-muted-foreground/40" />
                  <span className="text-[11px]">No matching args found</span>
                </>
              )}
            </div>
          ) : (
            filteredArgs.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-md border border-border/40 hover:border-border bg-card/30 hover:bg-card/50 transition-all overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center gap-2 px-2.5 py-1.5 bg-muted/20">
                  {editingId === item.id ? (
                    <div className="flex items-center gap-1 flex-1">
                      <Input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="h-6 text-[11px] flex-1"
                        autoFocus
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSaveEdit}
                        className="h-5 w-5 p-0 rounded text-emerald-500 hover:bg-emerald-500/10"
                      >
                        <IconCheck className="size-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCancelEdit}
                        className="h-5 w-5 p-0 rounded text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10"
                      >
                        <IconX className="size-3" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span className="text-[11px] font-semibold text-foreground truncate flex-1">
                        {item.name}
                      </span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStartEdit(item)}
                              className="h-5 w-5 p-0 rounded text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-foreground hover:bg-accent transition-all"
                            >
                              <IconEdit className="size-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="text-[10px]">
                            Rename
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </>
                  )}
                </div>

                {/* Content Preview */}
                <div className="px-2.5 py-2 space-y-1.5">
                  {/* Event Name */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-semibold text-muted-foreground uppercase">
                      Event:
                    </span>
                    <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400">
                      {item.eventName || "message"}
                    </span>
                  </div>

                  {/* Args Preview */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[9px] font-semibold text-muted-foreground uppercase">
                      Args:
                    </span>
                    {item.args.length === 0 ? (
                      <span className="text-[10px] text-muted-foreground/60 italic">
                        None
                      </span>
                    ) : (
                      item.args.slice(0, 3).map((arg, i) => (
                        <Badge
                          key={arg.id}
                          variant="secondary"
                          className="text-[9px] px-1 py-0 h-4 gap-0.5 bg-muted/50 border-border/30"
                        >
                          {formatIcons[arg.format]}
                          {i + 1}
                        </Badge>
                      ))
                    )}
                    {item.args.length > 3 && (
                      <span className="text-[9px] text-muted-foreground">
                        +{item.args.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Ack Badge */}
                  {item.ack && (
                    <Badge
                      variant="secondary"
                      className="text-[9px] px-1.5 py-0 h-4 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                    >
                      Ack
                    </Badge>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-1 px-2.5 py-1.5 bg-muted/10 border-t border-border/20">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDetailsItem(item)}
                    className="h-6 px-2 text-[10px] text-muted-foreground hover:text-foreground"
                  >
                    View
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteConfirmId(item.id)}
                    className="h-6 w-6 p-0 rounded text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10"
                  >
                    <IconTrash className="size-3" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onSelect(item)}
                    className="h-6 px-2.5 text-[10px] font-semibold gap-1 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30"
                  >
                    <IconPlayerPlay className="size-3" />
                    Load
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteConfirmId}
        onOpenChange={(open) => !open && setDeleteConfirmId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete saved args?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              saved args configuration.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Details Dialog */}
      <Dialog
        open={!!detailsItem}
        onOpenChange={(open) => !open && setDetailsItem(null)}
      >
        <DialogContent className="sm:max-w-[500px] gap-0 p-0 overflow-hidden">
          <DialogHeader className="p-4 border-b border-border/40 bg-muted/40">
            <DialogTitle className="text-sm font-medium flex items-center gap-2">
              <span className="p-1.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <IconBraces className="size-4" />
              </span>
              {detailsItem?.name}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground ml-9">
              {detailsItem &&
                `Created ${new Date(
                  detailsItem.createdAt
                ).toLocaleDateString()}`}
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
            {/* Event Name */}
            <div className="space-y-1.5">
              <Label className="text-[11px] font-semibold text-muted-foreground">
                Event Name
              </Label>
              <div className="rounded-md border border-border/50 bg-muted/30 px-3 py-2">
                <span className="text-sm font-mono text-indigo-600 dark:text-indigo-400">
                  {detailsItem?.eventName || "message"}
                </span>
              </div>
            </div>

            {/* Ack */}
            <div className="flex items-center gap-2">
              <Label className="text-[11px] font-semibold text-muted-foreground">
                Acknowledgement:
              </Label>
              <Badge
                variant="secondary"
                className={cn(
                  "text-[10px] px-1.5 py-0 h-4",
                  detailsItem?.ack
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {detailsItem?.ack ? "Enabled" : "Disabled"}
              </Badge>
            </div>

            {/* Args */}
            <div className="space-y-2">
              <Label className="text-[11px] font-semibold text-muted-foreground">
                Arguments ({detailsItem?.args.length || 0})
              </Label>
              <div className="space-y-2">
                {detailsItem?.args.map((arg, index) => (
                  <div
                    key={arg.id}
                    className="rounded-md border border-border/50 bg-muted/30 overflow-hidden"
                  >
                    <div className="flex items-center gap-2 px-2.5 py-1 bg-muted/30 border-b border-border/30">
                      <span className="text-[10px] font-bold text-muted-foreground">
                        ARG {index + 1}
                      </span>
                      <Badge
                        variant="secondary"
                        className="text-[9px] px-1 py-0 h-4 gap-0.5"
                      >
                        {formatIcons[arg.format]}
                        {arg.format.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="p-2.5">
                      <pre className="text-[11px] font-mono whitespace-pre-wrap wrap-break-word text-foreground/80 m-0 max-h-20 overflow-y-auto">
                        {arg.content || "(empty)"}
                      </pre>
                    </div>
                  </div>
                ))}
                {detailsItem?.args.length === 0 && (
                  <div className="text-[11px] text-muted-foreground/60 italic text-center py-4">
                    No arguments
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="p-4 pt-2 gap-2 bg-muted/5 border-t border-border/30">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDetailsItem(null)}
              className="h-8 text-xs"
            >
              Close
            </Button>
            <Button
              size="sm"
              onClick={() => {
                if (detailsItem) {
                  onSelect(detailsItem);
                  setDetailsItem(null);
                }
              }}
              className="h-8 text-xs font-medium gap-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30"
            >
              <IconPlayerPlay className="size-3.5" />
              Load Args
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SocketIOSavedArgs;
