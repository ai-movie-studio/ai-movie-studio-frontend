"use client";

import { useAuth } from "@/app/providers/auth-provider";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Film, FolderOpen, LogOut, ChevronRight, Settings } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, logout } = useAuth();
  const pathname = usePathname();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin size-8 border-2 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <aside className="w-72 border-r border-border bg-card/50 flex flex-col shrink-0">
        <div className="p-6 border-b border-border">
          <Link href="/projects" className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10">
              <Film className="size-5 text-purple-500" />
            </div>
            <div>
              <span className="font-bold text-base block">AI Movie Studio</span>
              <span className="text-xs text-muted-foreground">
                Create • Direct • Render
              </span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <NavLink
            href="/projects"
            icon={<FolderOpen className="size-5" />}
            label="My Projects"
            active={pathname.startsWith("/projects")}
          />
          <NavLink
            href="/settings"
            icon={<Settings className="size-5" />}
            label="Settings"
            active={pathname === "/settings"}
          />
        </nav>

        <div className="p-4 border-t border-border">
          <Link
            href="/settings"
            className="flex items-center gap-3 px-3 py-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
          >
            <div className="size-9 rounded-full bg-purple-500/20 flex items-center justify-center text-sm font-bold text-purple-400">
              {user?.fullName?.charAt(0)?.toUpperCase() ?? "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user?.fullName ?? "User"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email ?? ""}
              </p>
            </div>
          </Link>

          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 mt-2 text-sm rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <LogOut className="size-4" /> Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto bg-background">{children}</main>
    </div>
  );
}

function NavLink({
  href,
  icon,
  label,
  active,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
        active
          ? "bg-purple-500/10 text-purple-400"
          : "text-muted-foreground hover:text-foreground hover:bg-muted"
      }`}
    >
      {icon}
      <span className="flex-1">{label}</span>
      {active && <ChevronRight className="size-4 text-purple-500/50" />}
    </Link>
  );
}
