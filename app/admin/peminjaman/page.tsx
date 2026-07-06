"use client";
// ============================================================================
// HALAMAN ADMIN: PEMINJAMAN
// ----------------------------------------------------------------------------
// Data & aksi (setujui/tolak/selesai/hapus/tambah) datang dari
// usePeminjaman() -- Context bersama di lib/peminjaman/context.tsx.
//
// ALUR PENGEMBALIAN:
//   Aktif / Terlambat
//     -> (siswa ajukan pengembalian + upload foto bukti via ajukanKembali())
//     -> Menunggu Konfirmasi Kembali  (badge notif di sidebar ikut nambah)
//     -> admin cek foto bukti, lalu klik "Selesai"  -> status jadi Selesai,
//        stok alat otomatis bertambah lagi
//     -> kalau ternyata belum benar dikembalikan, admin klik "Belum Kembali"
//        -> status balik ke Aktif
//
// TAMPILAN:
//   - Layar >= md (desktop/tablet): tabel biasa, semua kolom kelihatan.
//   - Layar < md (HP): daftar card, satu transaksi = satu card, supaya
//     tidak perlu scroll horizontal dan status/foto bukti selalu kelihatan.
// ============================================================================
import { useMemo, useState } from "react";
import { Peminjaman, initialPeminjam, findAlat, findPeminjam } from "@/lib/data";
import { usePeminjaman } from "@/lib/peminjaman/context";
import {
  Badge,
  Toolbar,
  IconButton,
  SearchInput,
  EmptyState,
  Modal,
  ConfirmDialog,
  inputClass,
  labelClass,
} from "@/components/ui"; // <-- sesuaikan path

const STATUS_FILTERS = [
  "Semua",
  "Menunggu Verifikasi",
  "Aktif",
  "Terlambat",
  "Menunggu Konfirmasi Kembali",
  "Selesai",
  "Ditolak",
] as const;

export default function PeminjamanPage() {
  const { alatList, peminjamanList, setujui, tolak, konfirmasiKembali, tolakKembalikan, hapus } =
    usePeminjaman();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_FILTERS)[number]>("Semua");

  const [tolakTarget, setTolakTarget] = useState<string | null>(null);
  const [alasanTolak, setAlasanTolak] = useState("");
  const [hapusTarget, setHapusTarget] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return peminjamanList.filter((p: Peminjaman) => {
      const peminjam = findPeminjam(initialPeminjam, p.peminjamId);
      const alat = findAlat(alatList, p.alatId);
      const cocokCari =
        !search ||
        peminjam?.nama.toLowerCase().includes(search.toLowerCase()) ||
        alat?.nama.toLowerCase().includes(search.toLowerCase());
      const cocokStatus = statusFilter === "Semua" || p.status === statusFilter;
      return cocokCari && cocokStatus;
    });
  }, [peminjamanList, alatList, search, statusFilter]);

  function submitTolak() {
    if (!tolakTarget || !alasanTolak.trim()) return;
    tolak(tolakTarget, alasanTolak);
    setTolakTarget(null);
    setAlasanTolak("");
  }

  function submitHapus() {
    if (!hapusTarget) return;
    hapus(hapusTarget);
    setHapusTarget(null);
  }

  // Kumpulan tombol aksi untuk satu transaksi. Dipakai di tabel (desktop)
  // maupun card (mobile) supaya logikanya cuma ditulis sekali.
  function AksiButtons({ item }: { item: Peminjaman }) {
    if (item.status === "Menunggu Verifikasi") {
      return (
        <>
          <button
            onClick={() => setujui(item)}
            className="text-emerald-400 hover:underline text-sm font-medium"
          >
            Setujui
          </button>
          <button
            onClick={() => setTolakTarget(item.id)}
            className="text-rose-400 hover:underline text-sm font-medium"
          >
            Tolak
          </button>
        </>
      );
    }
    if (item.status === "Menunggu Konfirmasi Kembali") {
      return (
        <>
          <button
            onClick={() => konfirmasiKembali(item)}
            className="text-emerald-400 hover:underline text-sm font-medium"
          >
            Selesai
          </button>
          <button
            onClick={() => tolakKembalikan(item.id)}
            className="text-rose-400 hover:underline text-sm font-medium"
          >
            Belum Kembali
          </button>
        </>
      );
    }
    if (item.status === "Aktif" || item.status === "Terlambat") {
      return <span className="text-slate-500 text-xs italic">Menunggu siswa lapor kembali</span>;
    }
    return <span className="text-slate-600 text-sm">—</span>;
  }

  function StatusInfo({ item }: { item: Peminjaman }) {
    return (
      <>
        <Badge text={item.status} />
        {item.status === "Ditolak" && item.alasanTolak && (
          <p className="text-xs text-slate-500 mt-1">{item.alasanTolak}</p>
        )}
        {item.status === "Menunggu Konfirmasi Kembali" && item.fotoBukti && (
          <a
            href={item.fotoBukti}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-xs text-violet-400 hover:underline mt-1"
          >
            Lihat foto bukti
          </a>
        )}
      </>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Peminjaman</h1>
        <p className="text-sm text-slate-500">Beranda / Peminjaman</p>
      </div>

      <Toolbar
        subtitle={`${filtered.length} dari ${peminjamanList.length} transaksi`}
        action={
          <div className="flex flex-wrap items-center gap-3">
            <SearchInput value={search} onChange={setSearch} placeholder="Cari peminjam atau alat..." />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            >
              {STATUS_FILTERS.map((s) => (
                <option key={s} value={s} className="bg-[#0b0f1c]">
                  {s}
                </option>
              ))}
            </select>
          </div>
        }
      />

      {/* ================= TABEL: tampil di layar md ke atas ================= */}
      <div className="hidden md:block rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-500 border-b border-white/10">
              <th className="px-6 py-3 font-medium">PEMINJAM</th>
              <th className="px-6 py-3 font-medium">ALAT</th>
              <th className="px-6 py-3 font-medium">JUMLAH</th>
              <th className="px-6 py-3 font-medium">TGL PINJAM</th>
              <th className="px-6 py-3 font-medium">TGL KEMBALI</th>
              <th className="px-6 py-3 font-medium">STATUS</th>
              <th className="px-6 py-3 font-medium text-right">AKSI</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item: Peminjaman) => {
              const peminjam = findPeminjam(initialPeminjam, item.peminjamId);
              const alat = findAlat(alatList, item.alatId);
              return (
                <tr key={item.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                  <td className="px-6 py-4 text-white font-medium">{peminjam?.nama ?? "-"}</td>
                  <td className="px-6 py-4 text-slate-300">{alat?.nama ?? "-"}</td>
                  <td className="px-6 py-4 text-slate-300">{item.jumlah}</td>
                  <td className="px-6 py-4 text-slate-400">{item.tanggalPinjam}</td>
                  <td className="px-6 py-4 text-slate-400">{item.tanggalKembali}</td>
                  <td className="px-6 py-4 max-w-[180px]">
                    <StatusInfo item={item} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-3">
                      <AksiButtons item={item} />
                      <IconButton label="trash" variant="danger" onClick={() => setHapusTarget(item.id)} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <EmptyState text="Tidak ada transaksi yang cocok." />}
      </div>

      {/* ================= CARD: tampil di layar di bawah md (HP) ================= */}
      <div className="md:hidden space-y-3">
        {filtered.map((item: Peminjaman) => {
          const peminjam = findPeminjam(initialPeminjam, item.peminjamId);
          const alat = findAlat(alatList, item.alatId);
          return (
            <div key={item.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-white font-medium">{peminjam?.nama ?? "-"}</p>
                  <p className="text-sm text-slate-400">{alat?.nama ?? "-"}</p>
                </div>
                <IconButton label="trash" variant="danger" onClick={() => setHapusTarget(item.id)} />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                <div>
                  <p className="text-slate-500">Jumlah</p>
                  <p className="text-slate-300">{item.jumlah}</p>
                </div>
                <div>
                  <p className="text-slate-500">Tgl Pinjam</p>
                  <p className="text-slate-300">{item.tanggalPinjam}</p>
                </div>
                <div>
                  <p className="text-slate-500">Tgl Kembali</p>
                  <p className="text-slate-300">{item.tanggalKembali}</p>
                </div>
                <div>
                  <p className="text-slate-500">Status</p>
                  <StatusInfo item={item} />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                <AksiButtons item={item} />
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && <EmptyState text="Tidak ada transaksi yang cocok." />}
      </div>

      {/* MODAL: Alasan tolak (wajib diisi) */}
      {tolakTarget && (
        <Modal
          title="Tolak Pengajuan"
          onClose={() => {
            setTolakTarget(null);
            setAlasanTolak("");
          }}
        >
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Alasan Penolakan</label>
              <textarea
                value={alasanTolak}
                onChange={(e) => setAlasanTolak(e.target.value)}
                rows={3}
                placeholder="Contoh: alat sedang dalam perbaikan"
                className={inputClass}
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setTolakTarget(null);
                  setAlasanTolak("");
                }}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5 transition"
              >
                Batal
              </button>
              <button
                onClick={submitTolak}
                disabled={!alasanTolak.trim()}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-rose-500 hover:bg-rose-400 disabled:opacity-40 disabled:cursor-not-allowed text-white transition"
              >
                Tolak Pengajuan
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* KONFIRMASI HAPUS */}
      {hapusTarget && (
        <ConfirmDialog
          title="Hapus Transaksi"
          message="Riwayat peminjaman ini akan dihapus permanen. Lanjutkan?"
          onCancel={() => setHapusTarget(null)}
          onConfirm={submitHapus}
        />
      )}
    </div>
  );
}