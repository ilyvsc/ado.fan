"use client";

import { Trash2, Undo2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { UNDO_DURATION } from "@/admin/lib/toast";
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

interface UndoToastProps {
  title: string;
  toastId: string | number;
  onUndo: () => void;
}

function UndoToast({ title, toastId, onUndo }: UndoToastProps) {
  const [seconds, setSeconds] = useState(Math.ceil(UNDO_DURATION / 1000));

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((s) => Math.max(0, s - 1));
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  function handleUndo() {
    onUndo();
    toast.dismiss(toastId);
  }

  return (
    <div className="relative isolate mx-auto w-full max-w-72 overflow-hidden rounded-xl border border-red-500/20 bg-background sm:max-w-96">
      <div
        className="absolute bottom-0 left-0 h-px w-full bg-red-500/60"
        style={{ transition: `width ${UNDO_DURATION}ms linear` }}
        ref={(el) => {
          if (el) requestAnimationFrame(() => (el.style.width = "0%"));
        }}
      />

      <div className="flex items-center gap-4 px-4 py-2.5">
        <div className="hidden size-7 shrink-0 items-center justify-center rounded-lg bg-red-500/10 md:flex">
          <Trash2 className="size-3.5 text-red-400" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium wrap-break-word text-foreground sm:truncate">
            {title}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Deleting in <span className="text-red-400 tabular-nums">{seconds}s</span>
          </p>
        </div>

        <button
          onClick={handleUndo}
          className="flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-red-400 ring-1 ring-red-500/20 transition-all hover:bg-red-500/8 hover:ring-red-500/30"
        >
          <Undo2 className="size-3" />
          Undo
        </button>
      </div>
    </div>
  );
}

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
}

function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
}: DeleteConfirmDialogProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelledRef = useRef(false);

  function handleConfirm() {
    onOpenChange(false);
    cancelledRef.current = false;

    const id = toast.custom(
      (toastId) => (
        <UndoToast
          title={title}
          toastId={toastId}
          onUndo={() => {
            cancelledRef.current = true;
            if (timerRef.current) clearTimeout(timerRef.current);
          }}
        />
      ),
      {
        duration: UNDO_DURATION,
        unstyled: true,
        classNames: { toast: "bg-transparent p-0 border-0 shadow-none" },
      },
    );

    timerRef.current = setTimeout(() => {
      if (!cancelledRef.current) {
        onConfirm();
        toast.dismiss(id);
      }
    }, UNDO_DURATION);
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-xs overflow-hidden rounded-2xl border border-foreground/8 bg-background p-0 shadow-2xl shadow-black/30 sm:max-w-sm">
        <div className="absolute inset-x-0 bottom-0 h-16 bg-red-500/4" />

        <div className="relative px-6 pt-6 pb-5">
          <div className="mx-auto mb-4 flex size-10 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/8 sm:mx-0">
            <Trash2 className="size-4.5 text-red-400" />
          </div>

          <AlertDialogHeader className="gap-1.5 space-y-0">
            <AlertDialogTitle className="text-base font-semibold tracking-tight text-foreground">
              {title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm leading-relaxed text-muted-foreground">
              {description}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-5 flex-row items-center gap-2 space-x-0">
            <AlertDialogCancel className="h-8 flex-1 rounded-lg border border-foreground/10 bg-transparent px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              className="h-8 flex-1 rounded-lg border-0 bg-red-500 px-3 text-sm font-semibold text-white shadow-sm shadow-red-500/30 transition-all hover:bg-red-600 active:scale-95"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export { DeleteConfirmDialog };
