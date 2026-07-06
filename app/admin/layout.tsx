"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@/lib/icons";
import { PeminjamanProvider, usePeminjaman } from "@/lib/peminjaman/context";

const MENU = [
  { label: "Dashboard", icon: "grid", href: "/admin/dashboard" },
  { label: "Data Alat", icon: "box", href: "/admin/data-alat" },
  { label: "Data Peminjam", icon: "users", href: "/admin/data-peminjam" },
  { label: "Peminjaman", icon: "swap", href: "/admin/peminjaman" },
  { label: "Alat Masuk", icon: "in", href: "/admin/alat-masuk" },
  { label: "Alat Keluar", icon: "out", href: "/admin/alat-keluar" },
  { label: "Laporan", icon: "report", href: "/admin/laporan" },
  { label: "Ganti Password", icon: "key", href: "/admin/ganti-password" },
];

// Provider dipasang di sini (paling luar), supaya SEMUA halaman di dalam
// /admin/* (Sidebar, Dashboard, Peminjaman, dll) berbagi data yang sama.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <PeminjamanProvider>
      <AdminShell>{children}</AdminShell>
    </PeminjamanProvider>
  );
}

function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Ini sekarang baca dari Context -> otomatis update kalau status
  // pengajuan pinjam ATAU laporan pengembalian berubah, tidak akan "nyangkut" lagi.
  const { perluDiproses } = usePeminjaman();

  const activeItem = MENU.find((item) => pathname?.startsWith(item.href));

  function handleLogout() {
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-[#0b0f1c] text-white flex">
      {/* SIDEBAR */}
      <aside
        className={`fixed z-40 inset-y-0 left-0 w-64 bg-[#05070f] border-r border-white/10 flex flex-col transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-20 flex items-center gap-3 px-6 border-b border-white/10">
          <img src="/logo-tjkt.png" alt="Logo TJKT" className="w-9 h-9 object-contain" />
          <div className="leading-tight">
            <p className="font-bold text-sm">TJKT System</p>
            <p className="text-emerald-400 text-[11px]">Panel Admin</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          {MENU.map((item) => {
            const isActive = activeItem?.href === item.href;
            const badgeCount = item.label === "Peminjaman" ? perluDiproses : 0;

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition border-l-2 ${
                  isActive
                    ? "border-emerald-400 bg-emerald-500/10 text-white"
                    : "border-transparent text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon name={item.icon} className="w-5 h-5" />
                <span className="flex-1">{item.label}</span>
                {badgeCount > 0 && (
                  <span className="min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full bg-rose-500 text-white text-[11px] font-semibold">
                    {badgeCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition py-2.5 text-sm font-medium"
          >
            <Icon name="logout" className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* OVERLAY MOBILE */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* MAIN CONTENT */}
      <div className="flex-1 md:ml-64 min-h-screen flex flex-col">
        <header className="h-20 flex items-center justify-between px-6 border-b border-white/10 bg-[#0b0f1c]/95 backdrop-blur sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-slate-300" onClick={() => setSidebarOpen(true)} aria-label="Buka menu">
              <Icon name="menu" className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-lg md:text-xl font-bold">{activeItem?.label || "Dashboard"}</h1>
              <p className="text-xs text-slate-500">Beranda / {activeItem?.label || "Dashboard"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-semibold text-sm">
              A
            </div>
            <div className="hidden sm:block leading-tight">
              <p className="text-sm font-medium">Admin</p>
              <p className="text-[11px] text-emerald-400">Online</p>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-6">{children}</main>
      </div>
    </div>
  );
}