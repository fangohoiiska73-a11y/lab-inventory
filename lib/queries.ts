import { supabase } from "./supabase";
import { Alat, AlatKeluar, AlatMasuk, Peminjam, Peminjaman, genId } from "./data";

/* ============================================================================
 * ALAT
 * (Tabel `alat` di Supabase sudah pakai nama kolom yang sama persis dengan
 * field di interface Alat, jadi tidak perlu mapping snake_case <-> camelCase.)
 * ========================================================================= */

export async function fetchAlatList(): Promise<Alat[]> {
  const { data, error } = await supabase.from("alat").select("*").order("nama");
  if (error) throw error;
  return data as Alat[];
}

export async function fetchAlatById(id: string): Promise<Alat | null> {
  const { data, error } = await supabase.from("alat").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data as Alat | null;
}

/* ============================================================================
 * PEMINJAM
 * (Tabel `peminjam` pakai snake_case: no_induk, no_hp -> perlu mapping.)
 * ========================================================================= */

function mapPeminjamRow(row: any): Peminjam {
  return {
    id: row.id,
    nama: row.nama,
    noInduk: row.no_induk,
    kelas: row.kelas,
    noHp: row.no_hp,
  };
}

export async function findPeminjamByNoInduk(noInduk: string): Promise<Peminjam | null> {
  const { data, error } = await supabase
    .from("peminjam")
    .select("*")
    .eq("no_induk", noInduk)
    .maybeSingle();
  if (error) throw error;
  return data ? mapPeminjamRow(data) : null;
}

/** Cari peminjam berdasarkan no induk; kalau belum ada, buat baru. Return id peminjam. */
export async function findOrCreatePeminjam(input: {
  nama: string;
  noInduk: string;
  kelas: string;
  noHp: string;
}): Promise<string> {
  const existing = await findPeminjamByNoInduk(input.noInduk);
  if (existing) return existing.id;

  const id = genId("P");
  const { error } = await supabase.from("peminjam").insert({
    id,
    nama: input.nama,
    no_induk: input.noInduk,
    kelas: input.kelas,
    no_hp: input.noHp,
  });
  if (error) throw error;
  return id;
}

/* ============================================================================
 * PEMINJAMAN
 * (Tabel `peminjaman` pakai snake_case -> perlu mapping.)
 * ========================================================================= */

function mapPeminjamanRow(row: any): Peminjaman {
  return {
    id: row.id,
    peminjamId: row.peminjam_id,
    alatId: row.alat_id,
    jumlah: row.jumlah,
    tanggalPinjam: row.tanggal_pinjam,
    tanggalKembali: row.tanggal_kembali,
    status: row.status,
    alasanTolak: row.alasan_tolak ?? undefined,
    fotoBukti: row.foto_bukti ?? undefined,
  };
}

export async function fetchAllPeminjaman(): Promise<Peminjaman[]> {
  const { data, error } = await supabase
    .from("peminjaman")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapPeminjamanRow);
}

/** Ambil semua riwayat peminjaman milik satu peminjam (berdasarkan no induk). */
export async function fetchPeminjamanByNoInduk(noInduk: string): Promise<Peminjaman[]> {
  const peminjam = await findPeminjamByNoInduk(noInduk);
  if (!peminjam) return [];

  const { data, error } = await supabase
    .from("peminjaman")
    .select("*")
    .eq("peminjam_id", peminjam.id)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapPeminjamanRow);
}

export interface CreatePeminjamanInput {
  nama: string;
  noInduk: string;
  kelas: string;
  noHp: string;
  alatId: string;
  jumlah: number;
  tanggalPinjam: string;
  tanggalKembali: string;
  fotoBukti: string;
}

/** Buat pengajuan peminjaman baru. Otomatis buat/pakai data peminjam berdasarkan no induk. */
export async function createPeminjaman(input: CreatePeminjamanInput): Promise<string> {
  const peminjamId = await findOrCreatePeminjam({
    nama: input.nama,
    noInduk: input.noInduk,
    kelas: input.kelas,
    noHp: input.noHp,
  });

  const id = genId("PJ");
  const { error } = await supabase.from("peminjaman").insert({
    id,
    peminjam_id: peminjamId,
    alat_id: input.alatId,
    jumlah: input.jumlah,
    tanggal_pinjam: input.tanggalPinjam,
    tanggal_kembali: input.tanggalKembali,
    status: "Menunggu Verifikasi",
    foto_bukti: input.fotoBukti,
  });
  if (error) throw error;
  return id;
}

/** Admin menyetujui pengajuan peminjaman. */
export async function setujuiPeminjaman(id: string): Promise<void> {
  const { error } = await supabase.from("peminjaman").update({ status: "Aktif" }).eq("id", id);
  if (error) throw error;
}

/** Admin menolak pengajuan peminjaman, dengan alasan opsional. */
export async function tolakPeminjaman(id: string, alasan?: string): Promise<void> {
  const { error } = await supabase
    .from("peminjaman")
    .update({ status: "Ditolak", alasan_tolak: alasan ?? null })
    .eq("id", id);
  if (error) throw error;
}

/** Tandai peminjaman sebagai selesai (alat sudah dikembalikan). */
export async function tandaiSelesai(id: string): Promise<void> {
  const { error } = await supabase.from("peminjaman").update({ status: "Selesai" }).eq("id", id);
  if (error) throw error;
}

/** Siswa lapor sudah mengembalikan alat -> status jadi "Menunggu Konfirmasi Kembali". */
export async function ajukanKembaliPeminjaman(id: string, fotoBukti?: string): Promise<void> {
  const { error } = await supabase
    .from("peminjaman")
    .update({
      status: "Menunggu Konfirmasi Kembali",
      ...(fotoBukti ? { foto_bukti: fotoBukti } : {}),
    })
    .eq("id", id);
  if (error) throw error;
}

/** Admin menolak laporan pengembalian (misal alat ternyata belum dikembalikan) -> balik ke "Aktif". */
export async function tolakKembalikanPeminjaman(id: string): Promise<void> {
  const { error } = await supabase.from("peminjaman").update({ status: "Aktif" }).eq("id", id);
  if (error) throw error;
}

/** Hapus satu transaksi peminjaman secara permanen. */
export async function hapusPeminjaman(id: string): Promise<void> {
  const { error } = await supabase.from("peminjaman").delete().eq("id", id);
  if (error) throw error;
}

/** Admin mencatat peminjaman manual (langsung berstatus Aktif, tanpa lewat pengajuan siswa). */
export async function tambahPeminjamanManual(input: {
  peminjamId: string;
  alatId: string;
  jumlah: number;
  tanggalPinjam: string;
  tanggalKembali: string;
}): Promise<string> {
  const id = genId("PJ");
  const { error } = await supabase.from("peminjaman").insert({
    id,
    peminjam_id: input.peminjamId,
    alat_id: input.alatId,
    jumlah: input.jumlah,
    tanggal_pinjam: input.tanggalPinjam,
    tanggal_kembali: input.tanggalKembali,
    status: "Aktif",
  });
  if (error) throw error;
  return id;
}

/**
 * Ubah stok TERSEDIA suatu alat sebesar `delta` (boleh negatif untuk mengurangi).
 * Dipakai saat peminjaman disetujui (tersedia berkurang) atau saat alat
 * dikonfirmasi kembali (tersedia bertambah). Tidak mengubah `jumlah` total.
 */
export async function updateAlatTersedia(alatId: string, delta: number): Promise<void> {
  const alat = await fetchAlatById(alatId);
  if (!alat) throw new Error("Alat tidak ditemukan.");

  const tersediaBaru = Math.max(0, alat.tersedia + delta);
  const { error } = await supabase.from("alat").update({ tersedia: tersediaBaru }).eq("id", alatId);
  if (error) throw error;
}

/* ============================================================================
 * PEMINJAM (semua data, dipakai untuk laporan / admin)
 * ========================================================================= */

export async function fetchAllPeminjam(): Promise<Peminjam[]> {
  const { data, error } = await supabase.from("peminjam").select("*").order("nama");
  if (error) throw error;
  return (data ?? []).map(mapPeminjamRow);
}

/* ============================================================================
 * ALAT MASUK
 * (Tabel `alat_masuk` pakai snake_case: alat_id -> perlu mapping.)
 * ========================================================================= */

function mapAlatMasukRow(row: any): AlatMasuk {
  return {
    id: row.id,
    alatId: row.alat_id,
    jumlah: row.jumlah,
    tanggal: row.tanggal,
    sumber: row.sumber,
    keterangan: row.keterangan,
  };
}

export async function fetchAllAlatMasuk(): Promise<AlatMasuk[]> {
  const { data, error } = await supabase
    .from("alat_masuk")
    .select("*")
    .order("tanggal", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapAlatMasukRow);
}

/**
 * Catat alat masuk baru, DAN otomatis menambah stok (jumlah & tersedia)
 * alat yang bersangkutan di tabel `alat`.
 */
export async function tambahAlatMasuk(input: {
  alatId: string;
  jumlah: number;
  tanggal: string;
  sumber: string;
  keterangan: string;
}): Promise<string> {
  const alat = await fetchAlatById(input.alatId);
  if (!alat) throw new Error("Alat tidak ditemukan.");

  const id = genId("M");
  const { error: insertError } = await supabase.from("alat_masuk").insert({
    id,
    alat_id: input.alatId,
    jumlah: input.jumlah,
    tanggal: input.tanggal,
    sumber: input.sumber,
    keterangan: input.keterangan,
  });
  if (insertError) throw insertError;

  const { error: updateError } = await supabase
    .from("alat")
    .update({
      jumlah: alat.jumlah + input.jumlah,
      tersedia: alat.tersedia + input.jumlah,
    })
    .eq("id", input.alatId);
  if (updateError) throw updateError;

  return id;
}

export async function hapusAlatMasuk(id: string): Promise<void> {
  const { error } = await supabase.from("alat_masuk").delete().eq("id", id);
  if (error) throw error;
}

/* ============================================================================
 * ALAT KELUAR
 * (Tabel `alat_keluar` pakai snake_case: alat_id -> perlu mapping.)
 * ========================================================================= */

function mapAlatKeluarRow(row: any): AlatKeluar {
  return {
    id: row.id,
    alatId: row.alat_id,
    jumlah: row.jumlah,
    tanggal: row.tanggal,
    tujuan: row.tujuan,
    keterangan: row.keterangan,
  };
}

export async function fetchAllAlatKeluar(): Promise<AlatKeluar[]> {
  const { data, error } = await supabase
    .from("alat_keluar")
    .select("*")
    .order("tanggal", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapAlatKeluarRow);
}

/**
 * Catat alat keluar baru, DAN otomatis mengurangi stok tersedia
 * alat yang bersangkutan di tabel `alat`.
 */
export async function tambahAlatKeluar(input: {
  alatId: string;
  jumlah: number;
  tanggal: string;
  tujuan: string;
  keterangan: string;
}): Promise<string> {
  const alat = await fetchAlatById(input.alatId);
  if (!alat) throw new Error("Alat tidak ditemukan.");

  const id = genId("K");
  const { error: insertError } = await supabase.from("alat_keluar").insert({
    id,
    alat_id: input.alatId,
    jumlah: input.jumlah,
    tanggal: input.tanggal,
    tujuan: input.tujuan,
    keterangan: input.keterangan,
  });
  if (insertError) throw insertError;

  const { error: updateError } = await supabase
    .from("alat")
    .update({
      tersedia: Math.max(0, alat.tersedia - input.jumlah),
    })
    .eq("id", input.alatId);
  if (updateError) throw updateError;

  return id;
}

export async function hapusAlatKeluar(id: string): Promise<void> {
  const { error } = await supabase.from("alat_keluar").delete().eq("id", id);
  if (error) throw error;
}