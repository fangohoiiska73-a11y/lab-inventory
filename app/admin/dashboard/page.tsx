"use client";
import Link from "next/link";
import { Icon } from "@/lib/icons";

const STATS = [
  { label: "Total Alat", value: "48", color: "from-emerald-500 to-emerald-600", icon: "box", href: "/admin/data-alat" },
  { label: "Total Peminjam", value: "132", color: "from-amber-500 to-amber-600", icon: "users", href: "/admin/data-peminjam" },
  { label: "Alat Dipinjam", value: "9", color: "from-rose-500 to-rose-600", icon: "swap", href: "/admin/peminjaman" },
  { label: "Total Kategori", value: "6", color: "from-teal-500 to-teal-600", icon: "grid", href: "/admin/data-alat" },
  { label: "Alat Tersedia", value: "39", color: "from-sky-500 to-sky-600", icon: "check", href: "/admin/data-alat" },
  { label: "Peminjaman Aktif", value: "7", color: "from-violet-500 to-violet-600", icon: "clock", href: "/admin/peminjaman" },
  { label: "Peminjaman Selesai", value: "58", color: "from-orange-500 to-orange-600", icon: "check", href: "/admin/peminjaman" },
  { label: "Peminjaman Terlambat", value: "2", color: "from-red-500 to-red-600", icon: "alert", href: "/admin/peminjaman" },
];

export default function DashboardPage() {
  return (
    <>
      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {STATS.map((s) => (
          <div key={s.label} className={`rounded-xl p-5 text-white bg-gradient-to-br ${s.color} shadow-lg shadow-black/20`}>
            <div className="flex items-start justify-between">
              <p className="text-3xl font-bold">{s.value}</p>
              <Icon name={s.icon} className="w-7 h-7 opacity-80" />
            </div>
            <p className="mt-2 text-sm font-medium">{s.label}</p>
            <Link
              href={s.href}
              className="mt-4 inline-block text-xs font-medium bg-black/15 hover:bg-black/25 transition rounded-md px-3 py-1.5"
            >
              Info Selengkapnya →
            </Link>
          </div>
        ))}
      </div>

      {/* DETAIL LOGIN */}
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="font-semibold text-white mb-4">Detail Login</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-slate-500 text-xs mb-1">Nama</p>
            <p className="text-white font-medium">Administrator</p>
          </div>
          <div>
            <p className="text-slate-500 text-xs mb-1">Username</p>
            <p className="text-white font-medium">admin</p>
          </div>
          <div>
            <p className="text-slate-500 text-xs mb-1">Level Hak Akses</p>
            <span className="inline-block bg-emerald-500/15 text-emerald-400 text-xs font-semibold px-2.5 py-1 rounded-md">ADMIN</span>
          </div>
        </div>
      </div>
    </>
  );
}