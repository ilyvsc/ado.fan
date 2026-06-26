"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

interface ObfuscatedCellProps {
  value: string | null | undefined;
  variant?: "secret" | "email" | "ipaddress";
  className?: string;
}

function maskEmail(email: string) {
  const [local = "", domain = ""] = email.split("@");
  const [host = "", tld = ""] = domain.split(".");

  const maskedLocal = "*".repeat(Math.min(local.length, 8));
  const maskedHost = "*".repeat(Math.min(host.length, 6));
  const maskedTld = "*".repeat(Math.min(tld.length, 3));

  return `${maskedLocal}@${maskedHost}.${maskedTld}`;
}

function maskIpAddress(ip: string) {
  return ip
    .split(".")
    .map((octet) => "*".repeat(Math.min(octet.length, 18)))
    .join(".");
}

const maskers = {
  secret: (value: string) => "*".repeat(Math.min(value.length, 15)),
  email: maskEmail,
  ipaddress: maskIpAddress,
} satisfies Record<
  NonNullable<ObfuscatedCellProps["variant"]>,
  (value: string) => string
>;

export function ObfuscatedCell({
  value,
  variant = "secret",
  className,
}: ObfuscatedCellProps) {
  const [visible, setVisible] = useState(false);

  if (!value) return <span className="text-xs text-muted-foreground/40">-</span>;

  return (
    <button
      type="button"
      onClick={() => {
        setVisible((v) => !v);
      }}
      className="group/obfuscated flex items-center gap-1.5"
      title={visible ? "Hide" : "Reveal"}
    >
      <span className={cn("truncate text-xs text-muted-foreground", className)}>
        {visible ? value : maskers[variant](value)}
      </span>

      {visible ? (
        <EyeOff className="size-3 shrink-0 text-muted-foreground/40 group-hover/obfuscated:text-muted-foreground" />
      ) : (
        <Eye className="size-3 shrink-0 text-muted-foreground/40 group-hover/obfuscated:text-muted-foreground" />
      )}
    </button>
  );
}
