"use client";

import { useDelete } from "@refinedev/core";
import {
  Check,
  CheckSquare,
  Copy,
  CopyPlus,
  ExternalLink,
  Loader2,
  Pencil,
  Square,
  Trash2,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { Fragment, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { DeleteConfirmDialog } from "@/admin/components/ui/DeleteConfirmDialog";
import { type ContextMenuAction } from "@/admin/types/data-table";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { cn } from "@/lib/utils";

const itemCn =
  "flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm text-foreground transition-colors hover:bg-foreground/6 focus:bg-foreground/6";

interface DataTableContextMenuProps<TData extends { id: string }> {
  row: TData;
  resource: string;
  basePath: string;
  getRowLabel: (row: TData) => string;
  extraActions?: ContextMenuAction<TData>[];
  deleteWarning?: string;
  isSelected?: boolean;
  onSelectToggle?: () => void;
  onDuplicate?: (id: string) => Promise<{ id: string }>;
  children: React.ReactNode;
}

export function DataTableContextMenu<TData extends { id: string }>({
  row,
  resource,
  basePath,
  getRowLabel,
  extraActions = [],
  deleteWarning,
  isSelected = false,
  onSelectToggle,
  onDuplicate,
  children,
}: DataTableContextMenuProps<TData>) {
  const router = useRouter();
  const { mutate: deleteOne } = useDelete();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [duplicating, setDuplicating] = useState(false);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  const label = getRowLabel(row);
  const editPath = `${basePath}/${row.id}/edit`;

  function handleConfirmDelete() {
    deleteOne(
      { resource, id: row.id },
      {
        onSuccess: () => toast.success(`"${label}" deleted`),
        onError: () => toast.error(`Failed to delete "${label}"`),
      },
    );
    setConfirmOpen(false);
  }

  function handleCopyId() {
    void navigator.clipboard.writeText(row.id);
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    setCopied(true);
    copyTimerRef.current = setTimeout(() => {
      setCopied(false);
    }, 1500);
  }

  async function handleDuplicate() {
    if (!onDuplicate || duplicating) return;
    setDuplicating(true);
    try {
      const { id } = await onDuplicate(row.id);
      router.push(`${basePath}/${id}/edit`);
    } catch {
      toast.error(`Failed to duplicate "${label}"`);
    } finally {
      setDuplicating(false);
    }
  }

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
        <ContextMenuContent className="w-48 overflow-hidden rounded-lg border border-foreground/10 bg-background p-1">
          {onSelectToggle && (
            <ContextMenuItem onClick={onSelectToggle} className={itemCn}>
              <span className="text-muted-foreground">
                {isSelected ? (
                  <CheckSquare className="size-3.5" />
                ) : (
                  <Square className="size-3.5" />
                )}
              </span>
              <span className="flex-1">{isSelected ? "Deselect" : "Select"}</span>
            </ContextMenuItem>
          )}

          <ContextMenuItem onClick={handleCopyId} className={itemCn}>
            <span className={cn("text-muted-foreground", copied && "text-green-500")}>
              {copied ? (
                <Check className="size-3.5" />
              ) : (
                <Copy className="size-3.5" />
              )}
            </span>
            <span className="flex-1">{copied ? "Copied!" : "Copy ID"}</span>
          </ContextMenuItem>

          {onDuplicate && (
            <ContextMenuItem
              onClick={() => {
                void handleDuplicate();
              }}
              disabled={duplicating}
              className={cn(
                itemCn,
                "disabled:pointer-events-none disabled:opacity-50",
              )}
            >
              <span className="text-muted-foreground">
                {duplicating ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <CopyPlus className="size-3.5" />
                )}
              </span>
              <span className="flex-1">
                {duplicating ? "Duplicating..." : "Duplicate"}
              </span>
            </ContextMenuItem>
          )}

          <ContextMenuSeparator className="my-1 h-px bg-foreground/8" />

          <ContextMenuItem
            onClick={() => {
              router.push(editPath);
            }}
            className={itemCn}
          >
            <span className="text-muted-foreground">
              <Pencil className="size-3.5" />
            </span>
            <span className="flex-1">Edit</span>
          </ContextMenuItem>

          <ContextMenuItem asChild className={itemCn}>
            <a href={editPath} target="_blank" rel="noopener noreferrer">
              <span className="text-muted-foreground">
                <ExternalLink className="size-3.5" />
              </span>
              <span className="flex-1">Open in new tab</span>
            </a>
          </ContextMenuItem>

          {extraActions.map((action) => (
            <Fragment key={action.label}>
              {action.separator === "before" && (
                <ContextMenuSeparator className="my-1 h-px bg-foreground/8" />
              )}
              <ContextMenuItem
                onClick={() => {
                  action.onClick(row);
                }}
                className={cn(
                  itemCn,
                  action.destructive &&
                    "text-red-500 hover:bg-red-500/8 focus:bg-red-500/8 focus:text-red-500",
                )}
              >
                <span
                  className={cn(
                    action.destructive ? "text-red-500/70" : "text-muted-foreground",
                  )}
                >
                  {action.icon}
                </span>
                <span className="flex-1">{action.label}</span>
              </ContextMenuItem>
            </Fragment>
          ))}

          <ContextMenuSeparator className="my-1 h-px bg-foreground/8" />

          <ContextMenuItem
            onClick={() => {
              setConfirmOpen(true);
            }}
            className={cn(
              itemCn,
              "text-red-500 hover:bg-red-500/8 focus:bg-red-500/8 focus:text-red-500",
            )}
          >
            <span className="text-red-500/70">
              <Trash2 className="size-3.5" />
            </span>
            <span className="flex-1">Delete</span>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <DeleteConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={handleConfirmDelete}
        title={`Delete ${resource.replace(/s$/, "")}?`}
        description={`This will permanently delete "${label}". ${deleteWarning ?? "This action cannot be undone."}`}
      />
    </>
  );
}
