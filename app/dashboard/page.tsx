"use client";
import Link from "next/link";
import Navbar from "@/components/home/Navbar";
import Sidebar from "@/components/dashboard/Sidebar";
import { initialAlat } from "@/lib/data";

/* ------------------------------- Icon set -------------------------------- */

function IconBox(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="m3.5 8 8.5-4 8.5 4-8.5 4-8.5-4Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.5 8v8l8.5 4 8.5-4V8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 12v8" strokeLinecap="round" />
    </svg>
  );
}
function IconClock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconCheck(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.5 2.3 2.3 4.7-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconAlert(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M12 3 2 20h20L12 3Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 10v4" strokeLinecap="round" />
      <path d="M12 17h.01" strokeLinecap="round" />
    </svg>
  );
}

/* ------------------------------ Dummy data -------------------------------- */
// TODO: ganti dengan data asli dari Supabase (tabel peminjaman) setelah backend disambungkan.

const AKTIVITAS_TERBARU = [
  {
    id: "1",
    alat: "Router Mikrotik RB941",
    tanggal: "04 Jul 2026",
    status: "Menunggu Verifikasi" as const,
  },
  {
    id: "2",
    alat: "Switch TP-Link 8 Port",
    tanggal: "01 Jul 2026",
    status: "Disetujui" as const,
  },
  {
    id: "3",
    alat: "Tang Crimping",
    tanggal: "28 Jun 2026",
    status: "Dikembalikan" as const,
  },
];

const STATUS_STYLE: Record<string, string> = {
  "Menunggu Verifikasi": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Disetujui: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  Dikembalikan: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Terlambat: "bg-red-500/10 text-red-400 border-red-500/20",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${
        STATUS_STYLE[status] || "bg-white/5 text-slate-300 border-white/10"
      }`}
    >
      {status}
    </span>
  );
}

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${accent}`}>{icon}</div>
      <p className="mt-4 text-2xl font-bold">{value}</p>
      <p className="mt-1 text-sm text-slate-400">{label}</p>
    </div>
  );
}

export default function DashboardPage() {
  const totalTersedia = initialAlat.reduce((sum, a) => sum + a.tersedia, 0);
  const peminjamanAktif = AKTIVITAS_TERBARU.filter(
    (p) => p.status === "Menunggu Verifikasi" || p.status === "Disetujui"
  ).length;
  const menungguVerifikasi = AKTIVITAS_TERBARU.filter((p) => p.status === "Menunggu Verifikasi").length;

  return (
    <main className="min-h-screen bg-[#05070f] text-white">
      <Navbar />
      <div className="mx-auto flex max-w-7xl">
        <Sidebar />

        <section className="flex-1 min-w-0 px-4 py-8 sm:px-8 sm:py-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Halo, <span className="text-emerald-400">selamat datang</span> 👋
              </h1>
              <p className="mt-1.5 text-sm text-slate-400">
                Ini ringkasan aktivitas peminjaman alat laboratorium TJKT kamu.
              </p>
            </div>
            <Link
              href="/peminjaman"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 transition px-5 py-2.5 text-sm font-semibold shadow-lg shadow-emerald-500/15 whitespace-nowrap"
            >
              + Ajukan Peminjaman Baru
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <StatCard
              icon={<IconBox className="h-5 w-5" />}
              label="Total Alat Tersedia"
              value={totalTersedia}
              accent="bg-emerald-500/15 text-emerald-400"
            />
            <StatCard
              icon={<IconClock className="h-5 w-5" />}
              label="Peminjaman Aktif"
              value={peminjamanAktif}
              accent="bg-sky-500/15 text-sky-400"
            />
            <StatCard
              icon={<IconAlert className="h-5 w-5" />}
              label="Menunggu Verifikasi"
              value={menungguVerifikasi}
              accent="bg-amber-500/15 text-amber-400"
            />
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-7">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wide">
                Aktivitas Terbaru
              </h2>
              <Link href="/riwayat-peminjaman" className="text-xs text-slate-400 hover:text-emerald-400 transition">
                Lihat semua →
              </Link>
            </div>

            <div className="space-y-3">
              {AKTIVITAS_TERBARU.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3.5"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{item.alat}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.tanggal}</p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}