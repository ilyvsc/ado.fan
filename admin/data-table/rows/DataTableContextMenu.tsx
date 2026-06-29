"use client";

import { useDelete } from "@refinedev/core";
import {
  CheckSquare,
  Copy,
  CopyPlus,
  ExternalLink,
  Pencil,
  Square,
  Trash2,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";
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

const baseItemClass =
  "flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-foreground/6 focus:bg-foreground/6";

const destructiveItemClass =
  "text-destructive hover:bg-destructive/8 focus:bg-destructive/8 focus:text-destructive";

interface DataTableContextMenuProps<TData extends { id: string }> {
  row: TData;
  resource: string;
  basePath: string;
  singular?: string;
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
  singular,
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

  const label = getRowLabel(row);
  const editPath = `${basePath}/${row.id}/edit`;

  function handleConfirmDelete() {
    deleteOne(
      { resource, id: row.id },
      {
        onSuccess: () => {
          toast.success(`"${label}" deleted`);
          router.refresh();
        },
        onError: () => toast.error(`Failed to delete "${label}"`),
      },
    );
  }

  function handleCopyId() {
    void navigator.clipboard.writeText(row.id);
    toast.success("Copied to clipboard!");
  }

  function handleDuplicate() {
    if (!onDuplicate) return;
    toast.promise(onDuplicate(row.id), {
      loading: `Duplicating ${label}...`,
      success: (data) => {
        router.push(`${basePath}/${data.id}/edit`);
        return `"${label}" duplicated`;
      },
      error: `Failed to duplicate "${label}"`,
    });
  }

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
        <ContextMenuContent className="w-48 overflow-hidden rounded-lg border border-foreground/10 bg-background p-1">
          {onSelectToggle && (
            <ContextMenuItem onClick={onSelectToggle} className={baseItemClass}>
              {isSelected ? (
                <CheckSquare className="size-3.5" />
              ) : (
                <Square className="size-3.5" />
              )}
              <span className="flex-1">{isSelected ? "Deselect" : "Select"}</span>
            </ContextMenuItem>
          )}

          <ContextMenuItem onClick={handleCopyId} className={baseItemClass}>
            <Copy className="size-3.5" />
            <span className="flex-1">Copy ID</span>
          </ContextMenuItem>

          {onDuplicate && (
            <ContextMenuItem onClick={handleDuplicate} className={baseItemClass}>
              <CopyPlus className="size-3.5" />
              <span className="flex-1">Duplicate</span>
            </ContextMenuItem>
          )}

          <ContextMenuSeparator className="my-1 h-px bg-foreground/8" />

          <ContextMenuItem
            onClick={() => {
              router.push(editPath);
            }}
            className={baseItemClass}
          >
            <Pencil className="size-3.5" />
            <span className="flex-1">Edit</span>
          </ContextMenuItem>

          <ContextMenuItem asChild className={baseItemClass}>
            <a href={editPath} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="size-3.5" />
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
                  baseItemClass,
                  action.destructive && destructiveItemClass,
                )}
              >
                <span
                  className={
                    action.destructive ? "text-destructive" : "text-muted-foreground"
                  }
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
            className={cn(baseItemClass, destructiveItemClass)}
          >
            <Trash2 className="size-3.5" />
            <span className="flex-1">Delete</span>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <DeleteConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={handleConfirmDelete}
        title={`Delete ${singular ?? resource}?`}
        description={`This will permanently delete "${label}". ${deleteWarning ?? "You have 5 seconds to undo."}`}
      />
    </>
  );
}
