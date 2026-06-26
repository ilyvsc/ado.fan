import { SiDiscord, SiGithub } from "@icons-pack/react-simple-icons";
import { Mail } from "lucide-react";

import { cn } from "@/lib/utils";

type Provider = "github" | "discord" | "email";

const providers: Record<
  Provider,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  github: { label: "GitHub", icon: SiGithub },
  discord: { label: "Discord", icon: SiDiscord },
  email: { label: "Email", icon: Mail },
};

export function ProviderBadgeCell({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const provider = providers[value.toLowerCase() as Provider];
  const Icon = provider.icon;

  return (
    <span
      className={cn(
        "border-border bg-muted inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium text-foreground",
        className,
      )}
    >
      <Icon className="size-3.5 shrink-0" />
      <span>{provider.label}</span>
    </span>
  );
}
