"use client";

import { Table } from "@tanstack/react-table";
import { Check, Columns3, Eye, EyeOff, GripVertical, RotateCcw } from "lucide-react";

import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface Props<T> {
  table: Table<T>;
  lockedColumnIds?: string[];
  onResetAction: () => void;
  onReorderAction: (newOrder: string[]) => void;
}

interface DragState {
  id: string;
  label: string;
  startY: number;
  currentY: number;
  itemHeight: number;
  dropIndex: number;
}

export function DataTableColumnToggle<T>({
  table,
  lockedColumnIds = ["select", "actions"],
  onResetAction,
  onReorderAction,
}: Props<T>) {
  const columns = table.getAllLeafColumns();
  const toggleable = columns.filter((col) => !lockedColumnIds.includes(col.id));

  const [drag, setDrag] = useState<DragState | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const getOrder = useCallback(() => {
    return [...table.getState().columnOrder];
  }, [table]);

  const getDropIndex = useCallback(
    (y: number): number => {
      const entries = toggleable.flatMap((col) => {
        const el = itemRefs.current.get(col.id);
        if (!el) return [];
        const rect = el.getBoundingClientRect();
        return [{ id: col.id, midY: rect.top + rect.height / 2 }];
      });

      const index = entries.findIndex((entry) => y < entry.midY);
      return index === -1 ? entries.length : index;
    },
    [toggleable],
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent, id: string, label: string) => {
      e.preventDefault();
      const el = itemRefs.current.get(id);
      const itemHeight = el?.getBoundingClientRect().height ?? 32;
      setDrag({
        id,
        label,
        startY: e.clientY,
        currentY: e.clientY,
        itemHeight,
        dropIndex: getDropIndex(e.clientY),
      });
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [getDropIndex],
  );

  useEffect(() => {
    if (!drag) return;

    function onPointerMove(e: PointerEvent) {
      setDrag((prev) =>
        prev
          ? { ...prev, currentY: e.clientY, dropIndex: getDropIndex(e.clientY) }
          : null,
      );
    }

    function onPointerUp(e: PointerEvent) {
      setDrag((prev) => {
        if (!prev) return null;

        const dropIndex = getDropIndex(e.clientY);
        const order = getOrder();
        const toggleableIds = toggleable.map((c) => c.id);

        const toggleableOrder = order.filter((id) => toggleableIds.includes(id));
        const fromIdx = toggleableOrder.indexOf(prev.id);
        if (fromIdx === -1) return null;

        const toIdx = Math.max(0, Math.min(dropIndex, toggleableOrder.length - 1));
        if (fromIdx !== toIdx) {
          const reordered = [...toggleableOrder];
          reordered.splice(fromIdx, 1);
          reordered.splice(toIdx, 0, prev.id);

          const next = order.map((id) =>
            toggleableIds.includes(id) ? (reordered.shift() ?? id) : id,
          );
          onReorderAction(next);
        }

        return null;
      });
    }

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [drag, getDropIndex, getOrder, onReorderAction, toggleable]);

  const dragOffsetY = drag ? drag.currentY - drag.startY : 0;
  const dropIndex = drag ? drag.dropIndex : -1;

  const orderedToggleable = (() => {
    const order = getOrder();
    if (!order.length) return toggleable;
    return [...toggleable].sort((a, b) => {
      const ai = order.indexOf(a.id);
      const bi = order.indexOf(b.id);
      if (ai === -1 && bi === -1) return 0;
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
  })();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto h-8 gap-1.5 rounded-md border border-foreground/12 bg-background px-3 text-xs font-medium text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
        >
          <Columns3 className="size-3.5" />
          Columns
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-64 rounded-lg border border-foreground/10 bg-background p-1"
        onOpenAutoFocus={(e) => {
          e.preventDefault();
        }}
      >
        <div className="flex items-center justify-between px-2 py-1.5">
          <span className="text-xs font-medium text-muted-foreground">Columns</span>
          <button
            onClick={onResetAction}
            className="group flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <RotateCcw className="size-3 transition-transform duration-300 group-active:-rotate-180" />
            Reset
          </button>
        </div>

        <Separator className="my-1 bg-foreground/8" />

        <div ref={listRef} className="relative flex flex-col">
          {orderedToggleable.map((column, i) => {
            const isVisible = column.getIsVisible();
            const isDragging = drag?.id === column.id;
            const label =
              typeof column.columnDef.header === "string"
                ? column.columnDef.header
                : column.id;

            const showDropIndicator = drag && !isDragging && dropIndex === i;
            const showDropIndicatorAfter =
              drag &&
              !isDragging &&
              dropIndex === orderedToggleable.length &&
              i === orderedToggleable.length - 1;

            return (
              <div key={column.id} className="contents">
                {showDropIndicator && (
                  <div className="mx-2 h-0.5 rounded-full bg-ado-primary/60" />
                )}

                <div
                  ref={(el) => {
                    if (el) itemRefs.current.set(column.id, el);
                    else itemRefs.current.delete(column.id);
                  }}
                  className={cn(
                    "flex w-full items-center gap-1.5 rounded-md px-1.5 py-1.5 transition-colors",
                    isDragging ? "opacity-30" : "hover:bg-foreground/4",
                  )}
                  style={
                    isDragging
                      ? {
                          transform: `translateY(${dragOffsetY}px)`,
                          position: "relative",
                          zIndex: 10,
                        }
                      : undefined
                  }
                >
                  <div
                    className="flex cursor-grab items-center active:cursor-grabbing"
                    onPointerDown={(e) => {
                      onPointerDown(e, column.id, label);
                    }}
                  >
                    <GripVertical className="size-3.5 shrink-0 text-muted-foreground/30" />
                  </div>

                  <button
                    onClick={() => {
                      column.toggleVisibility();
                    }}
                    className="flex flex-1 items-center gap-2 overflow-hidden"
                  >
                    <div
                      className={cn(
                        "flex size-4 shrink-0 items-center justify-center rounded border",
                        isVisible
                          ? "border-ado-primary bg-ado-primary text-ado-primary-foreground"
                          : "border-foreground/20 bg-background",
                      )}
                    >
                      {isVisible && <Check className="size-2.5" />}
                    </div>

                    <span
                      className={cn(
                        "flex-1 truncate text-left text-sm",
                        isVisible ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {label}
                    </span>

                    {isVisible ? (
                      <Eye className="size-3.5 shrink-0 text-muted-foreground/50" />
                    ) : (
                      <EyeOff className="size-3.5 shrink-0 text-muted-foreground/30" />
                    )}
                  </button>
                </div>

                {showDropIndicatorAfter && (
                  <div className="mx-2 h-0.5 rounded-full bg-ado-primary/60" />
                )}

                {i < orderedToggleable.length - 1 && !isDragging && (
                  <Separator className="pointer-events-none my-0.5 bg-foreground/5" />
                )}
              </div>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
