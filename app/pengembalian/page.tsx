"use client";
import { ChangeEvent, FormEvent, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/home/Navbar";
import { Alat, Peminjaman, findAlat } from "@/lib/data";
import { fetchAlatList, fetchPeminjamanByNoInduk, ajukanKembaliPeminjaman } from "@/lib/queries";

type Kondisi = "Baik" | "Rusak Ringan" | "Rusak Berat";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

const inputClass =
  "w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30";
const labelClass = "block text-sm text-slate-200 mb-1.5";

function IconUpload(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M12 16V4M12 4 7 9M12 4l5 5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconTrash(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* --------------------------- Upload Foto Bukti --------------------------- */

function UploadFotoBukti({
  value,
  onChange,
  onClear,
}: {
  value: string;
  onChange: (dataUrl: string) => void;
  onClear: () => void;
}) {
  const [errorFile, setErrorFile] = useState("");

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    setErrorFile("");
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorFile("File harus berupa gambar (jpg, png, dll).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorFile("Ukuran foto maksimal 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  }

  if (value) {
    return (
      <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <img src={value} alt="Foto bukti" className="h-20 w-20 rounded-lg object-cover border border-white/10" />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-slate-300">Foto berhasil diunggah.</p>
          <button
            type="button"
            onClick={onClear}
            className="mt-2 inline-flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition"
          >
            <IconTrash className="h-3.5 w-3.5" />
            Hapus & ganti foto
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <label
        htmlFor="foto-bukti-pengembalian-input"
        className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-4 py-8 text-center transition hover:border-sky-400/40 hover:bg-white/[0.03]"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500/15 text-sky-400">
          <IconUpload className="h-5 w-5" />
        </span>
        <span className="text-sm text-slate-300">
          Klik untuk unggah foto <span className="text-sky-400">atau tarik file ke sini</span>
        </span>
        <span className="text-xs text-slate-500">JPG, PNG, maks. 5MB</span>
      </label>
      <input
        id="foto-bukti-pengembalian-input"
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />
      {errorFile && <p className="mt-2 text-xs text-red-400">{errorFile}</p>}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-slate-500">{label}</span>
      <span className="text-white font-medium text-right">{value}</span>
    </div>
  );
}

export default function FormPengembalianPage() {
  // ---- Tahap 1: cari peminjaman aktif berdasarkan No Induk ----
  const [noInduk, setNoInduk] = useState("");
  const [mencari, setMencari] = useState(false);
  const [errorCari, setErrorCari] = useState("");
  const [daftarAktif, setDaftarAktif] = useState<Peminjaman[] | null>(null);
  const [alatList, setAlatList] = useState<Alat[]>([]);

  // ---- Tahap 2: pilih peminjaman + isi detail pengembalian ----
  const [selectedId, setSelectedId] = useState<string>("");
  const [kondisiKembali, setKondisiKembali] = useState<Kondisi>("Baik");
  const [catatan, setCatatan] = useState("");
  const [fotoBukti, setFotoBukti] = useState("");
  const [errorSubmit, setErrorSubmit] = useState("");
  const [mengirim, setMengirim] = useState(false);

  const [sukses, setSukses] = useState<{
    alatNama: string;
    kondisi: Kondisi;
    catatan: string;
    fotoBukti: string;
  } | null>(null);

  async function handleCari(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorCari("");
    setDaftarAktif(null);
    setSelectedId("");

    if (!noInduk.trim()) {
      setErrorCari("No Induk wajib diisi.");
      return;
    }

    setMencari(true);
    try {
      const [semua, alat] = await Promise.all([fetchPeminjamanByNoInduk(noInduk.trim()), fetchAlatList()]);
      setAlatList(alat);

      const aktif = semua.filter((p) => p.status === "Aktif" || p.status === "Terlambat");
      if (aktif.length === 0) {
        setErrorCari("Tidak ada peminjaman aktif ditemukan untuk No Induk ini. Pastikan No Induk sudah benar.");
      }
      setDaftarAktif(aktif);
    } catch (err: any) {
      setErrorCari(err.message ?? "Gagal mengambil data peminjaman.");
    } finally {
      setMencari(false);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorSubmit("");

    if (!selectedId) {
      setErrorSubmit("Pilih dulu alat mana yang mau dikembalikan.");
      return;
    }
    if (!fotoBukti) {
      setErrorSubmit("Foto bukti wajib diunggah sebelum form bisa dikirim.");
      return;
    }
    if (kondisiKembali !== "Baik" && !catatan.trim()) {
      setErrorSubmit("Karena kondisi alat tidak baik, mohon isi catatan/keterangan kerusakannya.");
      return;
    }

    const item = daftarAktif?.find((p) => p.id === selectedId);
    const alat = item ? findAlat(alatList, item.alatId) : undefined;

    setMengirim(true);
    try {
      await ajukanKembaliPeminjaman(selectedId, fotoBukti);
      setSukses({
        alatNama: alat?.nama ?? "-",
        kondisi: kondisiKembali,
        catatan,
        fotoBukti,
      });
    } catch (err: any) {
      setErrorSubmit(err.message ?? "Gagal mengirim laporan pengembalian. Coba lagi.");
    } finally {
      setMengirim(false);
    }
  }

  function handleReset() {
    setSukses(null);
    setNoInduk("");
    setDaftarAktif(null);
    setSelectedId("");
    setKondisiKembali("Baik");
    setCatatan("");
    setFotoBukti("");
    setErrorCari("");
    setErrorSubmit("");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070f] text-white">
      <div className="absolute -left-40 top-24 h-[360px] w-[360px] rounded-full bg-sky-500/10 blur-[150px]" />
      <div className="absolute -right-40 bottom-0 h-[320px] w-[320px] rounded-full bg-emerald-400/5 blur-[150px]" />

      <div className="relative z-10">
        <Navbar />
      </div>

      <section className="relative z-10 mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-8 text-center">
          <p className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-300 tracking-widest text-xs uppercase font-semibold">
            TJKT System
          </p>
          <h1 className="mt-3 text-3xl sm:text-4xl font-bold">
            Form <span className="text-sky-400">Pengembalian Alat</span>
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Isi form ini saat mengembalikan alat yang sudah dipinjam.
          </p>
        </div>

        {sukses ? (
          <div className="rounded-2xl border border-sky-400/20 bg-sky-500/[0.06] p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sky-500/15 text-sky-400">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
                <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="mt-4 text-xl font-semibold">Pengembalian Berhasil Dikirim</h2>
            <p className="mt-1 text-sm text-slate-400">
              Admin akan memverifikasi kondisi alat berdasarkan foto & catatan ini.
            </p>

            {sukses.fotoBukti && (
              <img
                src={sukses.fotoBukti}
                alt="Foto bukti pengembalian"
                className="mt-5 w-28 h-28 object-cover rounded-xl border border-sky-400/30 mx-auto"
              />
            )}

            <div className="mt-6 space-y-2.5 rounded-xl border border-white/10 bg-white/[0.03] p-5 text-left text-sm">
              <Row label="Alat Dikembalikan" value={sukses.alatNama} />
              <Row label="Kondisi" value={sukses.kondisi} />
              <Row label="Tanggal Kembali" value={todayISO()} />
              {sukses.catatan && <Row label="Catatan" value={sukses.catatan} />}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={handleReset}
                className="rounded-lg bg-sky-500 hover:bg-sky-600 transition px-5 py-2.5 text-sm font-semibold text-[#05070f]"
              >
                Isi Pengembalian Lain
              </button>
              <Link
                href="/"
                className="rounded-lg border border-white/10 hover:bg-white/5 transition px-5 py-2.5 text-sm font-medium text-slate-300"
              >
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {/* ---------------- Tahap 1: cari No Induk ---------------- */}
            <form
              onSubmit={handleCari}
              className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 backdrop-blur-md"
            >
              <h2 className="text-sm font-semibold text-sky-400 uppercase tracking-wide">
                Cari Peminjaman Kamu
              </h2>
              <div>
                <label className={labelClass}>No Induk / NIM</label>
                <input
                  className={inputClass}
                  value={noInduk}
                  onChange={(e) => setNoInduk(e.target.value)}
                  placeholder="2024101"
                  required
                />
              </div>
              {errorCari && (
                <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3.5 py-2.5">
                  {errorCari}
                </p>
              )}
              <button
                type="submit"
                disabled={mencari}
                className="w-full rounded-lg bg-sky-500 hover:bg-sky-600 transition py-3 text-sm font-semibold text-[#05070f] shadow-lg shadow-sky-500/15 disabled:opacity-50"
              >
                {mencari ? "Mencari..." : "Cari Peminjaman Aktif"}
              </button>
            </form>

            {/* ---------------- Tahap 2: pilih alat + isi detail ---------------- */}
            {daftarAktif && daftarAktif.length > 0 && (
              <form
                onSubmit={handleSubmit}
                className="space-y-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 backdrop-blur-md"
              >
                <div>
                  <h2 className="text-sm font-semibold text-sky-400 uppercase tracking-wide mb-4">
                    Pilih Alat yang Dikembalikan
                  </h2>
                  <div className="space-y-2">
                    {daftarAktif.map((item) => {
                      const alat = findAlat(alatList, item.alatId);
                      const active = selectedId === item.id;
                      return (
                        <label
                          key={item.id}
                          className={`flex items-center justify-between gap-3 rounded-lg border px-4 py-3 cursor-pointer transition ${
                            active
                              ? "border-sky-400 bg-sky-500/10"
                              : "border-white/10 bg-white/[0.02] hover:border-white/20"
                          }`}
                        >
                          <div>
                            <p className="text-sm text-white font-medium">{alat?.nama ?? "-"}</p>
                            <p className="text-xs text-slate-500">
                              Jumlah {item.jumlah} · Pinjam {item.tanggalPinjam} · Rencana kembali{" "}
                              {item.tanggalKembali}
                            </p>
                          </div>
                          <input
                            type="radio"
                            name="pilih-peminjaman"
                            checked={active}
                            onChange={() => setSelectedId(item.id)}
                            className="h-4 w-4 accent-sky-500"
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="border-t border-white/10 pt-5 space-y-4">
                  <div>
                    <label className={labelClass}>Kondisi Alat Saat Dikembalikan</label>
                    <select
                      className={inputClass}
                      value={kondisiKembali}
                      onChange={(e) => setKondisiKembali(e.target.value as Kondisi)}
                    >
                      <option value="Baik">Baik</option>
                      <option value="Rusak Ringan">Rusak Ringan</option>
                      <option value="Rusak Berat">Rusak Berat</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>
                      Catatan {kondisiKembali !== "Baik" && <span className="text-red-400">*wajib diisi</span>}
                    </label>
                    <textarea
                      className={inputClass}
                      rows={3}
                      value={catatan}
                      onChange={(e) => setCatatan(e.target.value)}
                      placeholder="Contoh: layar retak sedikit di pojok kanan atas"
                    />
                  </div>
                </div>

                <div className="border-t border-white/10 pt-5">
                  <h2 className="text-sm font-semibold text-sky-400 uppercase tracking-wide mb-1">
                    Foto Bukti Pengembalian
                  </h2>
                  <p className="text-xs text-slate-500 mb-4">
                    Unggah foto sebagai bukti pengembalian alat (misalnya foto kondisi alat saat dikembalikan).
                  </p>
                  <UploadFotoBukti
                    value={fotoBukti}
                    onChange={setFotoBukti}
                    onClear={() => setFotoBukti("")}
                  />
                </div>

                {errorSubmit && (
                  <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3.5 py-2.5">
                    {errorSubmit}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={mengirim}
                  className="w-full rounded-lg bg-sky-500 hover:bg-sky-600 transition py-3 text-sm font-semibold text-[#05070f] shadow-lg shadow-sky-500/15 disabled:opacity-50"
                >
                  {mengirim ? "Mengirim..." : "Kirim Pengembalian →"}
                </button>
              </form>
            )}
          </div>
        )}
      </section>
    </main>
  );
}