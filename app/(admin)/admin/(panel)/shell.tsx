"use client";

import { Refine } from "@refinedev/core";
import routerProvider from "@refinedev/nextjs-router";

import { Menu } from "lucide-react";
import { Suspense, useEffect, useState } from "react";

import { AdminSidebar } from "@/admin/components/layout/AdminSidebar";
import { adminDataProvider } from "@/admin/provider";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

function MobileHeader({ onToggle }: { onToggle: () => void }) {
  return (
    <header className="flex h-14 items-center gap-3 border-b border-foreground/8 bg-background px-4 md:hidden">
      <Button
        variant="ghost"
        size="icon"
        className="size-8"
        onClick={onToggle}
        aria-label="Open menu"
      >
        <Menu className="size-4" />
      </Button>
      <span className="text-sm font-semibold tracking-tight text-foreground">
        ado.fan admin
      </span>
    </header>
  );
}

export function PanelShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsedState] = useState(
    () =>
      typeof window !== "undefined" &&
      localStorage.getItem("admin-sidebar-collapsed") === "true",
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  function setCollapsed(updater: boolean | ((prev: boolean) => boolean)) {
    setCollapsedState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      try {
        localStorage.setItem("admin-sidebar-collapsed", String(next));
      } catch {}
      return next;
    });
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "b") {
        e.preventDefault();
        setCollapsed((c) => !c);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <Suspense>
      <Refine
        routerProvider={routerProvider}
        dataProvider={adminDataProvider}
        resources={[
          {
            name: "songs",
            list: "/admin/songs",
            create: "/admin/songs/create",
            edit: "/admin/songs/:id/edit",
          },
          {
            name: "albums",
            list: "/admin/albums",
            create: "/admin/albums/create",
            edit: "/admin/albums/:id/edit",
          },
          {
            name: "roles",
            list: "/admin/roles",
          },
        ]}
        options={{
          syncWithLocation: true,
          disableTelemetry: true,
          reactQuery: {
            clientConfig: {
              defaultOptions: {
                queries: {
                  staleTime: 5 * 60 * 1000,
                  gcTime: 10 * 60 * 1000,
                  refetchOnWindowFocus: false,
                },
              },
            },
          },
        }}
      >
        <div className="flex h-screen overflow-hidden bg-background text-foreground">
          <div className="hidden md:flex">
            <AdminSidebar
              collapsed={collapsed}
              onToggle={() => {
                setCollapsed((c) => !c);
              }}
            />
          </div>

          <div
            role="presentation"
            className={cn(
              "fixed inset-0 z-40 bg-black/50 transition-opacity duration-200 md:hidden",
              mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
            )}
            onClick={() => {
              setMobileOpen(false);
            }}
          />
          <div
            className={cn(
              "fixed inset-y-0 left-0 z-50 transition-transform duration-200 md:hidden",
              mobileOpen ? "translate-x-0" : "-translate-x-full",
            )}
          >
            <AdminSidebar
              collapsed={false}
              onToggle={() => {
                setMobileOpen(false);
              }}
              onNavigate={() => {
                setMobileOpen(false);
              }}
            />
          </div>

          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            <MobileHeader
              onToggle={() => {
                setMobileOpen((o) => !o);
              }}
            />
            <main className="flex-1 overflow-auto px-6 py-8 lg:px-10">
              {children}
            </main>
          </div>
        </div>
        <Toaster position="bottom-center" />
      </Refine>
    </Suspense>
  );
}
