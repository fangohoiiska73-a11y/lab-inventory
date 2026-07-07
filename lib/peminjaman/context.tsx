"use client";
// ============================================================================
// PEMINJAMAN CONTEXT — VERSI SUPABASE
// ----------------------------------------------------------------------------
// Sama seperti versi lama: wadah data bersama supaya Sidebar (badge notif),
// halaman Peminjaman, portal siswa, dan Dashboard baca & ubah data yang SAMA.
// Bedanya: sekarang semua data & aksi baca/tulis ke Supabase lewat fungsi-
// fungsi di lib/queries.ts, bukan cuma useState lokal.
// ============================================================================
import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { Alat, Peminjam, Peminjaman } from "@/lib/data"; // <-- sesuaikan path
import {
  fetchAlatList,
  fetchAllPeminjaman,
  fetchAllPeminjam,
  setujuiPeminjaman,
  tolakPeminjaman,
  tandaiSelesai,
  ajukanKembaliPeminjaman,
  tolakKembalikanPeminjaman,
  hapusPeminjaman,
  tambahPeminjamanManual,
  updateAlatTersedia,
} from "@/lib/queries"; // <-- sesuaikan path

interface PeminjamanContextType {
  alatList: Alat[];
  peminjamList: Peminjam[];
  peminjamanList: Peminjaman[];
  loading: boolean;
  error: string | null;

  menungguVerifikasi: number;
  menungguKonfirmasiKembali: number;
  perluDiproses: number;

  setujui: (item: Peminjaman) => Promise<void>;
  tolak: (id: string, alasan: string) => Promise<void>;
  ajukanKembali: (id: string, fotoBukti?: string) => Promise<void>;
  konfirmasiKembali: (item: Peminjaman) => Promise<void>;
  tolakKembalikan: (id: string) => Promise<void>;
  hapus: (id: string) => Promise<void>;
  tambah: (data: Omit<Peminjaman, "id" | "status">) => Promise<void>;

  refresh: () => Promise<void>;
}

const PeminjamanContext = createContext<PeminjamanContextType | null>(null);

export function PeminjamanProvider({ children }: { children: ReactNode }) {
  const [alatList, setAlatList] = useState<Alat[]>([]);
  const [peminjamList, setPeminjamList] = useState<Peminjam[]>([]);
  const [peminjamanList, setPeminjamanList] = useState<Peminjaman[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    try {
      setLoading(true);
      setError(null);
      const [alat, peminjaman, peminjam] = await Promise.all([
        fetchAlatList(),
        fetchAllPeminjaman(),
        fetchAllPeminjam(),
      ]);
      setAlatList(alat);
      setPeminjamanList(peminjaman);
      setPeminjamList(peminjam);
    } catch (err: any) {
      console.error("Gagal memuat data peminjaman:", err);
      setError(err.message ?? "Gagal memuat data dari database.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const menungguVerifikasi = useMemo(
    () => peminjamanList.filter((p) => p.status === "Menunggu Verifikasi").length,
    [peminjamanList]
  );

  const menungguKonfirmasiKembali = useMemo(
    () => peminjamanList.filter((p) => p.status === "Menunggu Konfirmasi Kembali").length,
    [peminjamanList]
  );

  const perluDiproses = menungguVerifikasi + menungguKonfirmasiKembali;

  // Admin menyetujui pengajuan -> status Aktif, stok alat berkurang.
  async function setujui(item: Peminjaman) {
    await setujuiPeminjaman(item.id);
    await updateAlatTersedia(item.alatId, -item.jumlah);
    setPeminjamanList((prev) => prev.map((p) => (p.id === item.id ? { ...p, status: "Aktif" } : p)));
    setAlatList((prev) =>
      prev.map((a) => (a.id === item.alatId ? { ...a, tersedia: Math.max(0, a.tersedia - item.jumlah) } : a))
    );
  }

  // Admin menolak pengajuan.
  async function tolak(id: string, alasan: string) {
    await tolakPeminjaman(id, alasan);
    setPeminjamanList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "Ditolak", alasanTolak: alasan } : p))
    );
  }

  // Siswa lapor sudah mengembalikan alat -> status Menunggu Konfirmasi Kembali.
  // Stok belum ditambah dulu, menunggu admin cek fisik & konfirmasi.
  async function ajukanKembali(id: string, fotoBukti?: string) {
    await ajukanKembaliPeminjaman(id, fotoBukti);
    setPeminjamanList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "Menunggu Konfirmasi Kembali", fotoBukti } : p))
    );
  }

  // Admin konfirmasi alat memang sudah kembali -> Selesai, stok bertambah.
  async function konfirmasiKembali(item: Peminjaman) {
    await tandaiSelesai(item.id);
    await updateAlatTersedia(item.alatId, item.jumlah);
    setPeminjamanList((prev) => prev.map((p) => (p.id === item.id ? { ...p, status: "Selesai" } : p)));
    setAlatList((prev) =>
      prev.map((a) => (a.id === item.alatId ? { ...a, tersedia: a.tersedia + item.jumlah } : a))
    );
  }

  // Admin tolak laporan pengembalian -> balik ke Aktif.
  async function tolakKembalikan(id: string) {
    await tolakKembalikanPeminjaman(id);
    setPeminjamanList((prev) => prev.map((p) => (p.id === id ? { ...p, status: "Aktif" } : p)));
  }

  async function hapus(id: string) {
    await hapusPeminjaman(id);
    setPeminjamanList((prev) => prev.filter((p) => p.id !== id));
  }

  // Admin catat peminjaman manual -> langsung Aktif, stok langsung berkurang.
  async function tambah(data: Omit<Peminjaman, "id" | "status">) {
    const id = await tambahPeminjamanManual({
      peminjamId: data.peminjamId,
      alatId: data.alatId,
      jumlah: data.jumlah,
      tanggalPinjam: data.tanggalPinjam,
      tanggalKembali: data.tanggalKembali,
    });
    await updateAlatTersedia(data.alatId, -data.jumlah);

    const baru: Peminjaman = { ...data, id, status: "Aktif" };
    setPeminjamanList((prev) => [baru, ...prev]);
    setAlatList((prev) =>
      prev.map((a) => (a.id === data.alatId ? { ...a, tersedia: Math.max(0, a.tersedia - data.jumlah) } : a))
    );
  }

  return (
    <PeminjamanContext.Provider
      value={{
        alatList,
        peminjamList,
        peminjamanList,
        loading,
        error,
        menungguVerifikasi,
        menungguKonfirmasiKembali,
        perluDiproses,
        setujui,
        tolak,
        ajukanKembali,
        konfirmasiKembali,
        tolakKembalikan,
        hapus,
        tambah,
        refresh,
      }}
    >
      {children}
    </PeminjamanContext.Provider>
  );
}

export function usePeminjaman() {
  const ctx = useContext(PeminjamanContext);
  if (!ctx) {
    throw new Error("usePeminjaman harus dipakai di dalam <PeminjamanProvider>");
  }
  return ctx;
}