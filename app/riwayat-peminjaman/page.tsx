"use client";
import { useState } from "react";
import Navbar from "@/components/home/Navbar";
import Sidebar from "@/components/dashboard/sidebar";

/* ------------------------------ Dummy data -------------------------------- */
// TODO: ganti dengan data asli dari Supabase (tabel peminjaman, difilter berdasarkan user login).

type Status = "Menunggu Verifikasi" | "Disetujui" | "Dikembalikan" | "Terlambat";

interface Riwayat {
  id: string;
  alat: string;
  jumlah: number;
  tanggalPinjam: string;
  tanggalKembali: string;
  status: Status;
}

const DATA_RIWAYAT: Riwayat[] = [
  {
    id: "PJM-0005",
    alat: "Router Mikrotik RB941",
    jumlah: 1,
    tanggalPinjam: "04 Jul 2026",
    tanggalKembali: "11 Jul 2026",
    status: "Menunggu Verifikasi",
  },
  {
    id: "PJM-0004",
    alat: "Switch TP-Link 8 Port",
    jumlah: 2,
    tanggalPinjam: "01 Jul 2026",
    tanggalKembali: "05 Jul 2026",
    status: "Disetujui",
  },
  {
    id: "PJM-0003",
    alat: "Tang Crimping",
    jumlah: 1,
    tanggalPinjam: "20 Jun 2026",
    tanggalKembali: "22 Jun 2026",
    status: "Dikembalikan",
  },
  {
    id: "PJM-0002",
    alat: "Kabel LAN Cat6 (roll)",
    jumlah: 1,
    tanggalPinjam: "10 Jun 2026",
    tanggalKembali: "12 Jun 2026",
    status: "Terlambat",
  },
  {
    id: "PJM-0001",
    alat: "Laptop Praktikum",
    jumlah: 1,
    tanggalPinjam: "02 Jun 2026",
    tanggalKembali: "04 Jun 2026",
    status: "Dikembalikan",
  },
];

const STATUS_STYLE: Record<Status, string> = {
  "Menunggu Verifikasi": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Disetujui: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  Dikembalikan: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Terlambat: "bg-red-500/10 text-red-400 border-red-500/20",
};

function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${STATUS_STYLE[status]}`}>
      {status}
    </span>
  );
}

const TABS = ["Semua", "Aktif", "Selesai"] as const;
type Tab = (typeof TABS)[number];

function filterByTab(data: Riwayat[], tab: Tab) {
  if (tab === "Aktif") {
    return data.filter((r) => r.status === "Menunggu Verifikasi" || r.status === "Disetujui" || r.status === "Terlambat");
  }
  if (tab === "Selesai") {
    return data.filter((r) => r.status === "Dikembalikan");
  }
  return data;
}

export default function RiwayatPeminjamanPage() {
  const [tab, setTab] = useState<Tab>("Semua");
  const data = filterByTab(DATA_RIWAYAT, tab);

  return (
    <main className="min-h-screen bg-[#05070f] text-white">
      <Navbar />
      <div className="mx-auto flex max-w-7xl">
        <Sidebar />

        <section className="flex-1 min-w-0 px-4 py-8 sm:px-8 sm:py-10">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              RIWAYAT <span className="text-emerald-400">PEMINJAMAN</span>
            </h1>
            <p className="mt-1.5 text-sm text-slate-400">
              Daftar seluruh pengajuan peminjaman alat laboratorium yang pernah kamu buat.
            </p>
          </div>

          <div className="flex gap-2 mb-5">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  tab === t
                    ? "bg-emerald-500 text-white"
                    : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {data.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
              <p className="text-sm text-slate-400">Belum ada riwayat peminjaman pada kategori ini.</p>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
              {/* Desktop table */}
              <table className="hidden md:table w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-5 py-3.5 font-medium">ID</th>
                    <th className="px-5 py-3.5 font-medium">Alat</th>
                    <th className="px-5 py-3.5 font-medium">Jumlah</th>
                    <th className="px-5 py-3.5 font-medium">Tanggal Pinjam</th>
                    <th className="px-5 py-3.5 font-medium">Rencana Kembali</th>
                    <th className="px-5 py-3.5 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((r) => (
                    <tr key={r.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition">
                      <td className="px-5 py-4 text-slate-500">{r.id}</td>
                      <td className="px-5 py-4 font-medium">{r.alat}</td>
                      <td className="px-5 py-4 text-slate-300">{r.jumlah}</td>
                      <td className="px-5 py-4 text-slate-300">{r.tanggalPinjam}</td>
                      <td className="px-5 py-4 text-slate-300">{r.tanggalKembali}</td>
                      <td className="px-5 py-4">
                        <StatusBadge status={r.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile cards */}
              <div className="md:hidden divide-y divide-white/5">
                {data.map((r) => (
                  <div key={r.id} className="p-4">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <p className="font-medium text-sm">{r.alat}</p>
                      <StatusBadge status={r.status} />
                    </div>
                    <p className="text-xs text-slate-500">{r.id}</p>
                    <div className="mt-2 flex justify-between text-xs text-slate-400">
                      <span>Pinjam: {r.tanggalPinjam}</span>
                      <span>Kembali: {r.tanggalKembali}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}