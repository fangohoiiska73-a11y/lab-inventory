"use client";
import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/home/Navbar";
import Sidebar from "@/components/dashboard/Sidebar";
import { Peminjaman } from "@/lib/data";
import { fetchAlatList, fetchAllPeminjaman } from "@/lib/queries";

const STATUS_STYLE: Record<string, string> = {
  "Menunggu Verifikasi": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Aktif: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  Selesai: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Terlambat: "bg-red-500/10 text-red-400 border-red-500/20",
  Ditolak: "bg-rose-500/10 text-rose-400 border-rose-500/20",
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

const TABS = ["Semua", "Aktif", "Selesai"] as const;
type Tab = (typeof TABS)[number];

function filterByTab(data: Peminjaman[], tab: Tab) {
  if (tab === "Aktif") {
    return data.filter(
      (r) => r.status === "Menunggu Verifikasi" || r.status === "Aktif" || r.status === "Terlambat"
    );
  }
  if (tab === "Selesai") {
    return data.filter((r) => r.status === "Selesai" || r.status === "Ditolak");
  }
  return data;
}

function formatTanggal(iso: string) {
  if (!iso) return "-";
  const [y, m, d] = iso.split("-");
  const bulan = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  return `${d} ${bulan[Number(m) - 1]} ${y}`;
}

export default function RiwayatPeminjamanPage() {
  const [tab, setTab] = useState<Tab>("Semua");
  const [peminjaman, setPeminjaman] = useState<Peminjaman[]>([]);
  const [alatNamaMap, setAlatNamaMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    Promise.all([fetchAllPeminjaman(), fetchAlatList()])
      .then(([peminjamanList, alatList]) => {
        setPeminjaman(peminjamanList);
        const map: Record<string, string> = {};
        alatList.forEach((a) => {
          map[a.id] = a.nama;
        });
        setAlatNamaMap(map);
      })
      .catch(() => setLoadError("Gagal memuat data riwayat peminjaman. Coba muat ulang halaman."))
      .finally(() => setLoading(false));
  }, []);

  const data = useMemo(() => filterByTab(peminjaman, tab), [peminjaman, tab]);

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
              Daftar seluruh pengajuan peminjaman alat laboratorium yang tercatat.
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

          {loadError && (
            <p className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3.5 py-2.5">
              {loadError}
            </p>
          )}

          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
              <p className="text-sm text-slate-400">Memuat data...</p>
            </div>
          ) : data.length === 0 ? (
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
                      <td className="px-5 py-4 font-medium">{alatNamaMap[r.alatId] || "-"}</td>
                      <td className="px-5 py-4 text-slate-300">{r.jumlah}</td>
                      <td className="px-5 py-4 text-slate-300">{formatTanggal(r.tanggalPinjam)}</td>
                      <td className="px-5 py-4 text-slate-300">{formatTanggal(r.tanggalKembali)}</td>
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
                      <p className="font-medium text-sm">{alatNamaMap[r.alatId] || "-"}</p>
                      <StatusBadge status={r.status} />
                    </div>
                    <p className="text-xs text-slate-500">{r.id}</p>
                    <div className="mt-2 flex justify-between text-xs text-slate-400">
                      <span>Pinjam: {formatTanggal(r.tanggalPinjam)}</span>
                      <span>Kembali: {formatTanggal(r.tanggalKembali)}</span>
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