// ============================================================================
// SHARED MOCK DATA
// ----------------------------------------------------------------------------
// Ini data contoh (dummy) supaya semua halaman admin bisa langsung berfungsi
// tanpa backend. Kalau nanti sudah ada API/database, tinggal ganti bagian
// array di bawah ini dengan fetch ke API kamu — bentuk data (interface) bisa
// dipakai sebagai acuan struktur tabel di database.
// ============================================================================

export interface Alat {
  id: string;
  kode: string;
  nama: string;
  kategori: string;
  jumlah: number;
  tersedia: number;
  kondisi: "Baik" | "Rusak Ringan" | "Rusak Berat";
  lokasi: string;
  gambar?: string; // data URL (base64) hasil upload, atau path/URL gambar
}

export interface Peminjam {
  id: string;
  nama: string;
  noInduk: string;
  kelas: string;
  noHp: string;
}

export interface Peminjaman {
  id: string;
  peminjamId: string;
  alatId: string;
  jumlah: number;
  tanggalPinjam: string;
  tanggalKembali: string;
  status: "Aktif" | "Selesai" | "Terlambat";
}

export interface AlatMasuk {
  id: string;
  alatId: string;
  jumlah: number;
  tanggal: string;
  sumber: string;
  keterangan: string;
}

export interface AlatKeluar {
  id: string;
  alatId: string;
  jumlah: number;
  tanggal: string;
  tujuan: string;
  keterangan: string;
}

export const KATEGORI_ALAT = ["Jaringan", "Elektronik", "Perkakas", "Komputer", "Kabel & Konektor", "Lainnya"];

export const initialAlat: Alat[] = [
  { id: "A001", kode: "JRK-001", nama: "Router Mikrotik RB941", kategori: "Jaringan", jumlah: 10, tersedia: 7, kondisi: "Baik", lokasi: "Rak A1", gambar: "https://picsum.photos/seed/router-mikrotik/200" },
  { id: "A002", kode: "JRK-002", nama: "Switch TP-Link 8 Port", kategori: "Jaringan", jumlah: 8, tersedia: 6, kondisi: "Baik", lokasi: "Rak A2", gambar: "https://picsum.photos/seed/switch-tplink/200" },
  { id: "A003", kode: "ELK-001", nama: "Multimeter Digital", kategori: "Elektronik", jumlah: 6, tersedia: 5, kondisi: "Baik", lokasi: "Rak B1", gambar: "https://picsum.photos/seed/multimeter/200" },
  { id: "A004", kode: "PRK-001", nama: "Obeng Set", kategori: "Perkakas", jumlah: 12, tersedia: 10, kondisi: "Baik", lokasi: "Rak C1", gambar: "https://picsum.photos/seed/obeng-set/200" },
  { id: "A005", kode: "KMP-001", nama: "Laptop Lenovo ThinkPad", kategori: "Komputer", jumlah: 5, tersedia: 3, kondisi: "Rusak Ringan", lokasi: "Rak D1", gambar: "https://picsum.photos/seed/laptop-thinkpad/200" },
  { id: "A006", kode: "KBL-001", nama: "Kabel UTP Cat 6 (roll)", kategori: "Kabel & Konektor", jumlah: 7, tersedia: 7, kondisi: "Baik", lokasi: "Rak A3", gambar: "https://picsum.photos/seed/kabel-utp/200" },
];

export const initialPeminjam: Peminjam[] = [
  { id: "P001", nama: "Ahmad Fauzan", noInduk: "2024101", kelas: "XI TJKT 1", noHp: "081234567801" },
  { id: "P002", nama: "Siti Nur Aisyah", noInduk: "2024102", kelas: "XI TJKT 2", noHp: "081234567802" },
  { id: "P003", nama: "Budi Santoso", noInduk: "2023087", kelas: "XII TJKT 1", noHp: "081234567803" },
  { id: "P004", nama: "Dewi Lestari", noInduk: "2024045", kelas: "X TJKT 1", noHp: "081234567804" },
];

export const initialPeminjaman: Peminjaman[] = [
  { id: "PJ001", peminjamId: "P001", alatId: "A001", jumlah: 1, tanggalPinjam: "2026-06-28", tanggalKembali: "2026-07-05", status: "Aktif" },
  { id: "PJ002", peminjamId: "P002", alatId: "A005", jumlah: 1, tanggalPinjam: "2026-06-20", tanggalKembali: "2026-06-27", status: "Terlambat" },
  { id: "PJ003", peminjamId: "P003", alatId: "A004", jumlah: 2, tanggalPinjam: "2026-06-15", tanggalKembali: "2026-06-22", status: "Selesai" },
  { id: "PJ004", peminjamId: "P004", alatId: "A002", jumlah: 1, tanggalPinjam: "2026-07-01", tanggalKembali: "2026-07-08", status: "Aktif" },
];

export const initialAlatMasuk: AlatMasuk[] = [
  { id: "M001", alatId: "A006", jumlah: 5, tanggal: "2026-06-10", sumber: "Pembelian Toko Jaya", keterangan: "Stok tambahan kabel UTP" },
  { id: "M002", alatId: "A003", jumlah: 2, tanggal: "2026-06-18", sumber: "Sumbangan Alumni", keterangan: "Multimeter baru" },
];

export const initialAlatKeluar: AlatKeluar[] = [
  { id: "K001", alatId: "A005", jumlah: 1, tanggal: "2026-05-30", tujuan: "Perbaikan", keterangan: "Laptop rusak layar, dikirim servis" },
];

export function findAlat(list: Alat[], id: string) {
  return list.find((a) => a.id === id);
}

export function findPeminjam(list: Peminjam[], id: string) {
  return list.find((p) => p.id === id);
}

export function genId(prefix: string) {
  return `${prefix}${Math.floor(1000 + Math.random() * 9000)}`;
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}