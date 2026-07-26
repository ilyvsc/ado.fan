"use client";

import { Refine } from "@refinedev/core";
import routerProvider from "@refinedev/nextjs-router";

import { Menu } from "lucide-react";
import { Suspense, useEffect, useState, useSyncExternalStore } from "react";

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
        ado.fan admin panel
      </span>
    </header>
  );
}

const SIDEBAR_KEY = "admin-sidebar-collapsed";

function subscribeStorage(cb: () => void) {
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener("storage", cb);
  };
}

function setCollapsed(next: boolean) {
  localStorage.setItem(SIDEBAR_KEY, String(next));
  window.dispatchEvent(new Event("storage"));
}

export function PanelShell({ children }: { children: React.ReactNode }) {
  const collapsed = useSyncExternalStore(
    subscribeStorage,
    () => localStorage.getItem(SIDEBAR_KEY) === "true",
    () => false,
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "b") {
        e.preventDefault();
        setCollapsed(!collapsed);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [collapsed]);

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
                setCollapsed(!collapsed);
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
