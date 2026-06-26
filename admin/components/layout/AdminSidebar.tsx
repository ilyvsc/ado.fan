"use client";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Disc3,
  Home,
  KeyRound,
  LayoutGrid,
  LogOut,
  type LucideIcon,
  Mail,
  Music,
  Palette,
  ShieldCheck,
  Smartphone,
  Trash2,
  UserCheck,
  Users,
} from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { deleteMyAccount, getMyResourceLevels } from "@/admin/actions/roles";
import { authClient } from "@/admin/auth/client";
import {
  PermissionLevel,
  Role,
  type Level,
  type Resource,
} from "@/admin/lib/permissions";

import { confirmToast } from "@/admin/lib/toast";
import { ThemeSelectorDialog } from "@/components/themes/ThemeSelector";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const SIDEBAR_TOOLTIP =
  "border-foreground/10 bg-foreground text-background text-xs font-medium shadow-lg";

const ROLE_LABEL: Record<string, string> = {
  superadmin: "Super Admin",
  admin: "Admin",
  contributor: "Contributor",
};

function roleLabel(role?: string | null) {
  if (!role) return "Member";
  return ROLE_LABEL[role] ?? role;
}

function initials(name?: string | null) {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
  disabled?: boolean;
  resource?: Resource;
  superadminOnly?: boolean;
}

const navGroups: { label: string; icon: LucideIcon; items: NavItem[] }[] = [
  {
    label: "Content",
    icon: LayoutGrid,
    items: [
      { label: "Dashboard", href: "/admin", icon: Home, exact: true },
      { label: "Songs", href: "/admin/songs", icon: Music, resource: "songs" },
      { label: "Albums", href: "/admin/albums", icon: Disc3, resource: "albums" },
    ],
  },
  {
    label: "Access",
    icon: Users,
    items: [
      {
        label: "Roles",
        href: "/admin/roles",
        icon: ShieldCheck,
        resource: "roles",
        superadminOnly: true,
      },
      {
        label: "Invites",
        href: "/admin/invites",
        icon: Mail,
        resource: "roles",
        superadminOnly: true,
      },
    ],
  },
  {
    label: "Auth",
    icon: KeyRound,
    items: [
      {
        label: "Sessions",
        href: "/admin/sessions",
        icon: Smartphone,
        resource: "roles",
        superadminOnly: true,
      },
      {
        label: "Accounts",
        href: "/admin/accounts",
        icon: UserCheck,
        resource: "roles",
        superadminOnly: true,
      },
    ],
  },
];

export function AdminSidebar({
  collapsed,
  onToggle,
  onNavigate,
}: {
  collapsed: boolean;
  onToggle: () => void;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [levels, setLevels] = useState<Record<Resource, Level> | null>(null);
  const [themeOpen, setThemeOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(navGroups.map((g) => [g.label, true])),
  );

  useEffect(() => {
    getMyResourceLevels()
      .then(setLevels)
      .catch(() => {
        setLevels(null);
      });
  }, []);

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  function signOut() {
    void authClient.signOut().then(() => {
      router.push("/admin/sign-in");
      router.refresh();
    });
  }

  return (
    <aside
      className={cn(
        "relative flex h-full shrink-0 flex-col border-r border-foreground/10 bg-background transition-all duration-200",
        collapsed ? "w-16" : "w-60",
      )}
    >
      <TooltipProvider delayDuration={0}>
        <div
          className={cn(
            "flex h-14 items-center gap-2.5 border-b border-foreground/10 px-3",
            collapsed && "h-auto flex-col justify-center gap-3 px-0 py-4",
          )}
        >
          <Image
            src="/favicon/favicon-32x32.png"
            alt="ado.fan"
            width={28}
            height={28}
            className="size-7 shrink-0 rounded-md"
          />
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm leading-none font-semibold text-foreground">
                ado.fan
              </span>
              <span className="text-xs text-muted-foreground">Admin</span>
            </div>
          )}

          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onToggle}
                  className="size-7 text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                >
                  <ChevronRight className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className={SIDEBAR_TOOLTIP}>
                Expand sidebar
              </TooltipContent>
            </Tooltip>
          ) : (
            <button
              onClick={onToggle}
              className="ml-auto flex items-center gap-1.5 rounded-md px-2 py-1.5 text-muted-foreground transition-colors duration-150 hover:bg-foreground/5 hover:text-foreground"
            >
              <ChevronLeft className="size-3.5" />
              <kbd className="rounded border border-foreground/10 bg-foreground/5 px-1 py-0.5 text-xs leading-none text-muted-foreground/50">
                ⌘B
              </kbd>
            </button>
          )}
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
          {navGroups
            .map((group) => ({
              ...group,
              items: group.items.filter((item) => {
                if (!item.resource) return true;
                if (levels === null) return false;
                if (item.superadminOnly && user?.role !== Role.superadmin)
                  return false;
                return levels[item.resource] !== PermissionLevel.none;
              }),
            }))
            .filter((group) => group.items.length > 0)
            .map((group) => {
              const isOpen = openGroups[group.label] ?? true;

              const GroupIcon = group.icon;
              return (
                <div key={group.label} className="flex flex-col gap-0.5">
                  {!collapsed && (
                    <button
                      onClick={() => {
                        setOpenGroups((prev) => ({
                          ...prev,
                          [group.label]: !isOpen,
                        }));
                      }}
                      className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
                    >
                      <GroupIcon className="size-3.5 shrink-0" />
                      <span className="flex-1 text-left">{group.label}</span>
                      <ChevronDown
                        className={cn(
                          "size-3 shrink-0 transition-transform duration-200",
                          !isOpen && "-rotate-90",
                        )}
                      />
                    </button>
                  )}

                  <div
                    className={cn(
                      "grid transition-[grid-template-rows] duration-200 ease-in-out",
                      collapsed
                        ? "grid-rows-[1fr]"
                        : isOpen
                          ? "grid-rows-[1fr]"
                          : "grid-rows-[0fr]",
                    )}
                  >
                    <div className="overflow-hidden">
                      <div
                        className={cn(
                          "flex flex-col gap-0.5 pt-0.5",
                          !collapsed && "pl-1",
                        )}
                      >
                        {group.items.map((item) => {
                          const active = isActive(item.href, item.exact);
                          const Icon = item.icon;
                          const linkContent = (
                            <span
                              className={cn(
                                "relative flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors duration-150",
                                collapsed && "justify-center px-0",
                                active
                                  ? "bg-foreground/8 font-medium text-foreground before:absolute before:top-1/2 before:left-0 before:h-3.5 before:w-0.5 before:-translate-y-1/2 before:rounded-full before:bg-foreground"
                                  : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
                                item.disabled && "pointer-events-none opacity-40",
                              )}
                            >
                              <Icon className="size-3.5 shrink-0" />
                              {!collapsed && <span>{item.label}</span>}
                              {!collapsed && item.disabled && (
                                <span className="ml-auto text-xs text-muted-foreground/40">
                                  Soon
                                </span>
                              )}
                            </span>
                          );

                          if (item.disabled) {
                            if (collapsed) {
                              return (
                                <Tooltip key={item.href}>
                                  <TooltipTrigger asChild>
                                    <div>{linkContent}</div>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    side="right"
                                    className={SIDEBAR_TOOLTIP}
                                  >
                                    {item.label} (Soon)
                                  </TooltipContent>
                                </Tooltip>
                              );
                            }
                            return <div key={item.href}>{linkContent}</div>;
                          }

                          if (collapsed) {
                            return (
                              <Tooltip key={item.href}>
                                <TooltipTrigger asChild>
                                  <Link href={item.href} onClick={onNavigate}>
                                    {linkContent}
                                  </Link>
                                </TooltipTrigger>
                                <TooltipContent
                                  side="right"
                                  className={SIDEBAR_TOOLTIP}
                                >
                                  {item.label}
                                </TooltipContent>
                              </Tooltip>
                            );
                          }

                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={onNavigate}
                            >
                              {linkContent}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </nav>

        <div className="border-t border-foreground/10 p-3">
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-md p-1 text-left transition-colors duration-150 hover:bg-foreground/5",
                  collapsed && "justify-center",
                )}
              >
                <Avatar className="size-9 border border-foreground/10">
                  {user?.image && <AvatarImage src={user.image} alt={user.name} />}
                  <AvatarFallback className="bg-foreground/5 text-xs font-medium text-foreground">
                    {initials(user?.name)}
                  </AvatarFallback>
                </Avatar>
                {!collapsed && (
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-sm font-medium text-foreground">
                      {user?.name ?? "Account"}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {roleLabel(user?.role)}
                    </span>
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side={collapsed ? "right" : "top"}
              align="end"
              className="w-56 p-1"
            >
              <div className="flex flex-col px-2 py-1.5">
                <span className="truncate text-sm font-medium text-foreground">
                  {user?.name ?? "Account"}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {roleLabel(user?.role)}
                </span>
              </div>
              <Separator className="my-1" />
              <DropdownMenuItem
                onSelect={() => {
                  setThemeOpen(true);
                }}
              >
                <Palette className="size-4" />
                Theme
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={signOut}>
                <LogOut className="size-4" />
                Sign out
              </DropdownMenuItem>
              {user?.role !== "superadmin" && (
                <DropdownMenuItem
                  onSelect={() => {
                    confirmToast(
                      "Delete your account? This is permanent and cannot be undone.",
                      () => {
                        void deleteMyAccount().then(() => {
                          void authClient.signOut().then(() => {
                            router.push("/admin/sign-in");
                          });
                        });
                      },
                    );
                  }}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="size-4" />
                  Delete account
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TooltipProvider>

      <ThemeSelectorDialog open={themeOpen} onOpenChange={setThemeOpen} />
    </aside>
  );
}
