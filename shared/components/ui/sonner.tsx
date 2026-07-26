"use client";

import {
  CircleCheck,
  Info,
  LoaderCircle,
  OctagonX,
  TriangleAlert,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      gap={6}
      offset={24}
      icons={{
        success: <CircleCheck className="size-4 text-green-500" />,
        info: <Info className="size-4 text-blue-500" />,
        warning: <TriangleAlert className="size-4 text-amber-500" />,
        error: <OctagonX className="size-4 text-red-500" />,
        loading: (
          <LoaderCircle className="size-4 animate-spin text-muted-foreground" />
        ),
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "flex w-full max-w-md flex-wrap items-start gap-x-3 gap-y-2 rounded-xl border border-foreground/10 bg-background p-4",
          content: "min-w-0 flex-1",
          title: "text-sm font-medium text-foreground wrap-break-word",
          description:
            "mt-0.5 text-sm leading-relaxed text-muted-foreground wrap-break-word",
          icon: "mt-0.5 shrink-0",
          error: "border-red-500/15",
          warning: "border-amber-500/15",
          info: "border-blue-500/15",
          success: "border-green-500/15",
          actionButton:
            "shrink-0 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background",
          cancelButton:
            "shrink-0 rounded-lg bg-foreground/8 px-4 py-2 text-sm font-medium text-muted-foreground",
          closeButton:
            "rounded-md border border-foreground/10 bg-background text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
