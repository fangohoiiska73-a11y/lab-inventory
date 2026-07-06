"use client";
// ============================================================================
// PEMINJAMAN CONTEXT
// ----------------------------------------------------------------------------
// Ini "wadah data bersama" supaya Sidebar (badge notifikasi), halaman
// Peminjaman, portal siswa, dan nanti Dashboard, semuanya baca & ubah data
// yang SAMA persis. Begitu status berubah di satu tempat, semua komponen
// lain yang pakai context ini otomatis ikut ter-update.
//
// ALUR LENGKAP:
//   Menunggu Verifikasi -> (admin setujui) -> Aktif / Terlambat
//   Aktif / Terlambat -> (SISWA ajukan pengembalian) -> Menunggu Konfirmasi Kembali
//   Menunggu Konfirmasi Kembali -> (admin konfirmasi) -> Selesai
//   Menunggu Konfirmasi Kembali -> (admin tolak, alat ternyata belum kembali) -> balik ke Aktif
//
// SISI SISWA (portal yang sudah ada) tinggal panggil:
//   const { ajukanKembali } = usePeminjaman();
//   ajukanKembali(idPeminjaman, fotoBuktiBase64);
// dari dalam <PeminjamanProvider> yang sama (pastikan portal siswa dirender
// di dalam provider yang sama dengan admin, atau state ini disatukan ke
// backend/API kalau siswa & admin jalan di proses/server terpisah).
// ============================================================================
import { createContext, useContext, useMemo, useState, ReactNode } from "react";
import {
  Alat,
  Peminjaman,
  initialAlat,
  initialPeminjaman,
  genId,
} from "@/lib/data"; // <-- sesuaikan path ke file data.ts kamu

interface PeminjamanContextType {
  alatList: Alat[];
  peminjamanList: Peminjaman[];
  menungguVerifikasi: number; // jumlah pengajuan pinjam baru yang belum diproses
  menungguKonfirmasiKembali: number; // jumlah laporan pengembalian yang belum dikonfirmasi
  perluDiproses: number; // total keduanya, dipakai untuk badge notifikasi

  setujui: (item: Peminjaman) => void;
  tolak: (id: string, alasan: string) => void;

  // Dipanggil dari SISI SISWA saat mereka lapor mengembalikan alat.
  ajukanKembali: (id: string, fotoBukti?: string) => void;
  // Dipanggil admin setelah cek fisik alatnya benar sudah kembali.
  konfirmasiKembali: (item: Peminjaman) => void;
  // Dipanggil admin kalau ternyata alat belum benar-benar dikembalikan.
  tolakKembalikan: (id: string) => void;

  hapus: (id: string) => void;
  tambah: (data: Omit<Peminjaman, "id" | "status">) => void;
}

const PeminjamanContext = createContext<PeminjamanContextType | null>(null);

export function PeminjamanProvider({ children }: { children: ReactNode }) {
  const [alatList, setAlatList] = useState<Alat[]>(initialAlat);
  const [peminjamanList, setPeminjamanList] = useState<Peminjaman[]>(initialPeminjaman);

  const menungguVerifikasi = useMemo(
    () => peminjamanList.filter((p) => p.status === "Menunggu Verifikasi").length,
    [peminjamanList]
  );

  const menungguKonfirmasiKembali = useMemo(
    () => peminjamanList.filter((p) => p.status === "Menunggu Konfirmasi Kembali").length,
    [peminjamanList]
  );

  const perluDiproses = menungguVerifikasi + menungguKonfirmasiKembali;

  function setujui(item: Peminjaman) {
    setPeminjamanList((prev) =>
      prev.map((p) => (p.id === item.id ? { ...p, status: "Aktif" } : p))
    );
    setAlatList((prev) =>
      prev.map((a) =>
        a.id === item.alatId ? { ...a, tersedia: Math.max(0, a.tersedia - item.jumlah) } : a
      )
    );
  }

  function tolak(id: string, alasan: string) {
    setPeminjamanList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "Ditolak", alasanTolak: alasan } : p))
    );
  }

  // SISWA lapor sudah mengembalikan alat -> stok BELUM ditambah dulu,
  // menunggu admin cek fisik & konfirmasi lewat konfirmasiKembali().
  function ajukanKembali(id: string, fotoBukti?: string) {
    setPeminjamanList((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: "Menunggu Konfirmasi Kembali", fotoBukti } : p
      )
    );
  }

  // Admin konfirmasi alat memang sudah kembali -> Selesai, stok bertambah.
  function konfirmasiKembali(item: Peminjaman) {
    setPeminjamanList((prev) =>
      prev.map((p) => (p.id === item.id ? { ...p, status: "Selesai" } : p))
    );
    setAlatList((prev) =>
      prev.map((a) => (a.id === item.alatId ? { ...a, tersedia: a.tersedia + item.jumlah } : a))
    );
  }

  // Admin tolak laporan pengembalian (misal alat belum benar2 diserahkan)
  // -> balik ke Aktif, siswa harus ajukan ulang setelah benar2 mengembalikan.
  function tolakKembalikan(id: string) {
    setPeminjamanList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "Aktif" } : p))
    );
  }

  function hapus(id: string) {
    setPeminjamanList((prev) => prev.filter((p) => p.id !== id));
  }

  // dipakai saat admin mencatat peminjaman manual -> langsung "Aktif"
  function tambah(data: Omit<Peminjaman, "id" | "status">) {
    const baru: Peminjaman = { ...data, id: genId("PJ"), status: "Aktif" };
    setPeminjamanList((prev) => [baru, ...prev]);
    setAlatList((prev) =>
      prev.map((a) => (a.id === data.alatId ? { ...a, tersedia: a.tersedia - data.jumlah } : a))
    );
  }

  return (
    <PeminjamanContext.Provider
      value={{
        alatList,
        peminjamanList,
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
      }}
    >
      {children}
    </PeminjamanContext.Provider>
  );
}

// Hook supaya gampang dipakai: const { peminjamanList, setujui } = usePeminjaman();
export function usePeminjaman() {
  const ctx = useContext(PeminjamanContext);
  if (!ctx) {
    throw new Error("usePeminjaman harus dipakai di dalam <PeminjamanProvider>");
  }
  return ctx;
}