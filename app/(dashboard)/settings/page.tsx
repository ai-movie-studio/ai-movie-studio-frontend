"use client";
import { useAuth } from "@/app/providers/auth-provider";
import { User, Mail, Shield, LogOut } from "lucide-react";

export default function SettingsPage() {
  const { user, logout } = useAuth();

  return (
    <div className="p-8 lg:p-12 max-w-2xl mx-auto space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account</h1>
        <p className="text-base text-muted-foreground mt-1">Manage your account settings</p>
      </div>

      <div className="rounded-2xl border border-border bg-card divide-y divide-border">
        <div className="p-6 flex items-center gap-4">
          <div className="size-14 rounded-full bg-purple-500/20 flex items-center justify-center text-xl font-bold text-purple-400">
            {user?.fullName?.charAt(0)?.toUpperCase() ?? "U"}
          </div>
          <div>
            <p className="text-lg font-semibold">{user?.fullName}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        <InfoRow icon={<User className="size-5" />} label="Full Name" value={user?.fullName ?? "—"} />
        <InfoRow icon={<Mail className="size-5" />} label="Email" value={user?.email ?? "—"} />
        <InfoRow icon={<Shield className="size-5" />} label="Role" value={user?.role ?? "USER"} />
      </div>

      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-red-400">Danger Zone</h2>
        <p className="text-sm text-muted-foreground">
          Signing out will clear your session. You&apos;ll need to log in again.
        </p>
        <button onClick={logout}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors">
          <LogOut className="size-4" /> Sign out
        </button>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="p-5 flex items-center gap-4">
      <div className="text-muted-foreground">{icon}</div>
      <div className="flex-1">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
        <p className="text-base mt-0.5">{value}</p>
      </div>
    </div>
  );
}
