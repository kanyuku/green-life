"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { listQueuedReports, onQueueUpdated } from "@/lib/field-demo";

const workspaces = [
  { href: "/promoter", label: "Promoter" },
  { href: "/stockist", label: "Stockist" },
  { href: "/dashboard", label: "Executive" },
];

export function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const [online, setOnline] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [storageError, setStorageError] = useState("");

  const refreshQueueCount = useCallback(() => {
    listQueuedReports()
      .then((reports) => {
        setPendingCount(reports.length);
        setStorageError("");
      })
      .catch((error: unknown) => {
        setStorageError(error instanceof Error ? error.message : "Offline storage could not be read.");
      });
  }, []);

  useEffect(() => {
    const updateNetwork = () => setOnline(navigator.onLine);
    updateNetwork();
    window.addEventListener("online", updateNetwork);
    window.addEventListener("offline", updateNetwork);
    const unsubscribe = onQueueUpdated(refreshQueueCount);
    refreshQueueCount();

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch((error: unknown) => {
        console.error("Could not register the offline app shell.", error);
      });
    }

    return () => {
      window.removeEventListener("online", updateNetwork);
      window.removeEventListener("offline", updateNetwork);
      unsubscribe();
    };
  }, [refreshQueueCount]);

  useEffect(() => {
    const startSync = () => setSyncing(true);
    const finishSync = () => setSyncing(false);
    window.addEventListener("field-demo-sync-start", startSync);
    window.addEventListener("field-demo-sync-end", finishSync);
    return () => {
      window.removeEventListener("field-demo-sync-start", startSync);
      window.removeEventListener("field-demo-sync-end", finishSync);
    };
  }, []);

  const statusLabel = !online ? "Offline" : syncing ? "Syncing" : "Online";
  const statusColor = !online
    ? "bg-rose-500"
    : syncing
      ? "bg-amber-400"
      : "bg-emerald-500";

  return (
    <div className="min-h-screen bg-[#f6f7f2] text-slate-950">
      <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="flex min-h-11 items-center justify-between gap-3 bg-[#10271f] px-4 text-xs font-semibold text-white sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className={`h-2.5 w-2.5 rounded-full ${statusColor}`} />
            <span>{statusLabel}</span>
            <span className="hidden text-white/60 sm:inline">·</span>
            <span className="hidden text-white/75 sm:inline">
              {pendingCount ? `${pendingCount} report${pendingCount === 1 ? "" : "s"} pending` : "Field data protected on this device"}
            </span>
          </div>
          <span className="text-white/70">FIELDDEMO PULSE</span>
        </div>
        <header className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/" className="flex min-w-0 items-center gap-2.5" aria-label="FieldDemo Pulse home">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-700 text-sm font-black text-white">F</span>
            <span className="leading-tight">
              <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-800">GreenLife</span>
              <span className="block text-sm font-extrabold">FieldDemo Pulse</span>
            </span>
          </Link>
          <nav aria-label="Workspaces" className="hidden items-center gap-1 sm:flex">
            {workspaces.map((workspace) => (
              <Link
                key={workspace.href}
                href={workspace.href}
                aria-current={pathname === workspace.href ? "page" : undefined}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  pathname === workspace.href
                    ? "bg-emerald-50 text-emerald-800"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                {workspace.label}
              </Link>
            ))}
          </nav>
          <span className="hidden rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 lg:inline">
            Kenya pilot · Demo data
          </span>
        </header>
        {storageError && (
          <p role="status" className="border-t border-amber-200 bg-amber-50 px-4 py-2 text-xs font-medium text-amber-900 sm:px-6">
            Offline queue warning: {storageError}
          </p>
        )}
      </div>
      {children}
      <nav aria-label="Mobile workspaces" className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-3 border-t border-slate-200 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] pt-2 shadow-[0_-8px_24px_rgba(15,23,42,0.06)] backdrop-blur sm:hidden">
        {workspaces.map((workspace) => (
          <Link
            key={workspace.href}
            href={workspace.href}
            aria-current={pathname === workspace.href ? "page" : undefined}
            className={`rounded-lg px-2 py-2 text-center text-xs font-bold ${
              pathname === workspace.href ? "text-emerald-800" : "text-slate-500"
            }`}
          >
            {workspace.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
