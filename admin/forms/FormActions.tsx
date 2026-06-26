"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

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
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  listHref: string;
}

export function FormActions({ listHref }: FormActionsProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const {
    formState: { isSubmitting },
  } = useFormContext();

  return (
    <>
      <div className="flex w-full max-w-6xl items-center justify-end gap-2 border-t border-foreground/8 pt-4">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 rounded-md px-3 text-sm text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
          onClick={() => {
            setOpen(true);
          }}
        >
          Discard
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={isSubmitting}
          className="h-8 rounded-md bg-ado-primary px-4 text-sm font-medium text-ado-primary-foreground hover:bg-ado-primary/90 disabled:opacity-50"
        >
          {isSubmitting ? "Saving…" : "Save"}
        </Button>
      </div>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="max-w-md rounded-xl border border-foreground/10 bg-background p-6">
          <AlertDialogHeader className="gap-1">
            <AlertDialogTitle className="text-base font-semibold text-foreground">
              Discard changes?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              Any unsaved changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 gap-2">
            <AlertDialogCancel className="h-8 rounded-md border border-foreground/12 bg-background px-3 text-sm font-medium text-foreground hover:bg-foreground/5">
              Keep editing
            </AlertDialogCancel>
            <AlertDialogAction
              className="h-8 rounded-md border-0 bg-foreground px-3 text-sm font-medium text-background hover:bg-foreground/90"
              onClick={() => {
                router.push(listHref);
              }}
            >
              Discard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
