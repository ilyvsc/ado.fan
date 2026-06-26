import { toast } from "sonner";

export const UNDO_DURATION = 5000;
export const UNDO_DELAY = 4000;

export function confirmToast(message: string, onConfirm: () => void) {
  toast(message, {
    action: { label: "Confirm", onClick: onConfirm },
    duration: 8000,
  });
}

export function undoToast({
  title,
  pendingLabel = "In progress",
  onCommit,
}: {
  title: string;
  pendingLabel?: string;
  onCommit: () => void;
}) {
  let cancelled = false;

  const id = toast(title, {
    description: `${pendingLabel}…`,
    duration: UNDO_DELAY,
    action: {
      label: "Undo",
      onClick: () => {
        cancelled = true;
        toast.dismiss(id);
        toast.success("Action cancelled.");
      },
    },
  });

  setTimeout(() => {
    if (!cancelled) onCommit();
  }, UNDO_DELAY);
}
