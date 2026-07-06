"use client";
import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/home/Navbar";
import Sidebar from "@/components/dashboard/Sidebar";
import { initialAlat } from "@/lib/data";

interface FormState {
  nama: string;
  noInduk: string;
  kelas: string;
  noHp: string;
  alatId: string;
  jumlah: number;
  tanggalPinjam: string;
  tanggalKembali: string;
  keperluan: string;
  fotoBukti: string;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

const EMPTY_FORM: FormState = {
  nama: "",
  noInduk: "",
  kelas: "",
  noHp: "",
  alatId: initialAlat[0]?.id || "",
  jumlah: 1,
  tanggalPinjam: todayISO(),
  tanggalKembali: "",
  keperluan: "",
  fotoBukti: "",
};

const inputClass =
  "w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30";
const labelClass = "block text-sm text-slate-200 mb-1.5";
const hintClass = "mt-1.5 text-xs text-slate-500";

function IconBack(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M19 12H5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m11 6-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
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
        htmlFor="foto-bukti-input"
        className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-4 py-8 text-center transition hover:border-emerald-400/40 hover:bg-white/[0.03]"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
          <IconUpload className="h-5 w-5" />
        </span>
        <span className="text-sm text-slate-300">
          Klik untuk unggah foto <span className="text-emerald-400">atau tarik file ke sini</span>
        </span>
        <span className="text-xs text-slate-500">JPG, PNG, maks. 5MB</span>
      </label>
      <input
        id="foto-bukti-input"
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />
      {errorFile && <p className="mt-2 text-xs text-red-400">{errorFile}</p>}
    </div>
  );
}

/* ------------------------------- Page --------------------------------- */

export default function AjukanPeminjamanPage() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [error, setError] = useState("");
  const [sukses, setSukses] = useState<FormState | null>(null);

  const alatTerpilih = useMemo(
    () => initialAlat.find((a) => a.id === form.alatId),
    [form.alatId]
  );

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!form.nama.trim() || !form.noInduk.trim()) {
      setError("Nama dan No Induk wajib diisi.");
      return;
    }
    if (!alatTerpilih) {
      setError("Alat yang dipilih tidak valid.");
      return;
    }
    if (alatTerpilih.tersedia <= 0) {
      setError("Alat yang dipilih sedang tidak tersedia.");
      return;
    }
    if (form.jumlah < 1 || form.jumlah > alatTerpilih.tersedia) {
      setError(`Jumlah harus antara 1 - ${alatTerpilih.tersedia} (stok tersedia).`);
      return;
    }
    if (!form.tanggalKembali) {
      setError("Tanggal rencana kembali wajib diisi.");
      return;
    }
    if (form.tanggalKembali < form.tanggalPinjam) {
      setError("Tanggal kembali tidak boleh sebelum tanggal pinjam.");
      return;
    }
    if (!form.fotoBukti) {
      setError("Foto bukti wajib diunggah sebelum pengajuan bisa dikirim.");
      return;
    }

    // TODO: sambungkan ke backend/API supaya pengajuan (termasuk fotoBukti)
    // benar-benar tersimpan dan muncul di halaman admin > Peminjaman untuk diverifikasi.
    setSukses(form);
  }

  function handleAjukanLagi() {
    setSukses(null);
    setForm(EMPTY_FORM);
    setError("");
  }

  return (
    <main className="min-h-screen bg-[#05070f] text-white">
      <Navbar />

      <div className="mx-auto flex max-w-7xl">
        <Sidebar />

        <section className="flex-1 min-w-0 px-4 py-8 sm:px-8 sm:py-10">
          {sukses ? (
            <div className="mx-auto max-w-2xl rounded-2xl border border-emerald-400/20 bg-emerald-500/[0.06] p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
                  <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 className="mt-4 text-xl font-semibold">Pengajuan Berhasil Dikirim</h2>
              <p className="mt-1 text-sm text-slate-400">
                Pengajuan kamu akan diverifikasi oleh admin (termasuk foto bukti). Simpan ringkasan ini sebagai bukti.
              </p>

              {sukses.fotoBukti && (
                <img
                  src={sukses.fotoBukti}
                  alt="Foto bukti"
                  className="mt-5 w-28 h-28 object-cover rounded-xl border border-emerald-400/30 mx-auto"
                />
              )}

              <div className="mt-6 space-y-2.5 rounded-xl border border-white/10 bg-white/[0.03] p-5 text-left text-sm">
                <Row label="Nama" value={sukses.nama} />
                <Row label="No Induk" value={sukses.noInduk} />
                <Row label="Kelas" value={sukses.kelas || "-"} />
                <Row label="Alat" value={alatTerpilih?.nama || "-"} />
                <Row label="Jumlah" value={String(sukses.jumlah)} />
                <Row label="Tanggal Pinjam" value={sukses.tanggalPinjam} />
                <Row label="Rencana Kembali" value={sukses.tanggalKembali} />
                {sukses.keperluan && <Row label="Keperluan" value={sukses.keperluan} />}
              </div>

              <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
                <button
                  onClick={handleAjukanLagi}
                  className="rounded-lg bg-emerald-500 hover:bg-emerald-600 transition px-5 py-2.5 text-sm font-semibold"
                >
                  Ajukan Peminjaman Lain
                </button>
                <Link
                  href="/pengembalian"
                  className="rounded-lg border border-white/10 hover:bg-white/5 transition px-5 py-2.5 text-sm font-medium text-slate-300"
                >
                  Isi Form Pengembalian
                </Link>
              </div>
            </div>
          ) : (
            <>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-emerald-400 transition"
              >
                <IconBack className="h-4 w-4" />
                Kembali
              </Link>

              <div className="mt-4 mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  DETAIL <span className="text-emerald-400">PEMINJAMAN</span>
                </h1>
                <p className="mt-1.5 text-sm text-slate-400">
                  Lengkapi detail peminjaman alat laboratorium TJKT dengan benar.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-7">
                  <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wide mb-4">
                    Data Peminjam
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className={labelClass}>Nama Lengkap</label>
                      <input
                        className={inputClass}
                        value={form.nama}
                        onChange={(e) => setForm({ ...form, nama: e.target.value })}
                        placeholder="Ahmad Fauzan"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>No Induk / NIM</label>
                        <input
                          className={inputClass}
                          value={form.noInduk}
                          onChange={(e) => setForm({ ...form, noInduk: e.target.value })}
                          placeholder="2024101"
                          required
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Kelas / Jurusan</label>
                        <input
                          className={inputClass}
                          value={form.kelas}
                          onChange={(e) => setForm({ ...form, kelas: e.target.value })}
                          placeholder="XI TJKT 1"
                        />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>No HP / WhatsApp</label>
                      <input
                        className={inputClass}
                        value={form.noHp}
                        onChange={(e) => setForm({ ...form, noHp: e.target.value })}
                        placeholder="0812xxxxxxx"
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-7">
                  <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wide mb-4">
                    Detail Peminjaman
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className={labelClass}>Pilih Alat</label>
                      <select
                        className={inputClass}
                        value={form.alatId}
                        onChange={(e) => setForm({ ...form, alatId: e.target.value, jumlah: 1 })}
                      >
                        {initialAlat.map((a) => (
                          <option key={a.id} value={a.id} disabled={a.tersedia <= 0}>
                            {a.nama} — {a.kategori} (tersedia: {a.tersedia}
                            {a.tersedia <= 0 ? ", habis" : ""})
                          </option>
                        ))}
                      </select>
                      <p className={hintClass}>Pilih alat yang ingin dipinjam dan daftar tersedia.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Jumlah</label>
                        <input
                          type="number"
                          min={1}
                          max={alatTerpilih?.tersedia || 1}
                          className={inputClass}
                          value={form.jumlah}
                          onChange={(e) => setForm({ ...form, jumlah: Number(e.target.value) })}
                        />
                        <p className="mt-1.5 text-xs text-emerald-400/80">
                          Stok tersedia: {alatTerpilih?.tersedia ?? 0}
                        </p>
                      </div>
                      <div>
                        <label className={labelClass}>Tanggal Pinjam</label>
                        <input
                          type="date"
                          min={todayISO()}
                          className={inputClass}
                          value={form.tanggalPinjam}
                          onChange={(e) => setForm({ ...form, tanggalPinjam: e.target.value })}
                        />
                        <p className={hintClass}>Pilih tanggal peminjaman alat.</p>
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>Rencana Tanggal Kembali</label>
                      <input
                        type="date"
                        min={form.tanggalPinjam}
                        className={inputClass}
                        value={form.tanggalKembali}
                        onChange={(e) => setForm({ ...form, tanggalKembali: e.target.value })}
                        required
                      />
                      <p className={hintClass}>Pilih tanggal rencana pengembalian alat.</p>
                    </div>

                    <div>
                      <label className={labelClass}>Keperluan (opsional)</label>
                      <textarea
                        className={inputClass}
                        rows={3}
                        value={form.keperluan}
                        onChange={(e) => setForm({ ...form, keperluan: e.target.value })}
                        placeholder="Contoh: praktik konfigurasi jaringan kelas XI TJKT 1"
                      />
                      <p className={hintClass}>Jelaskan keperluan peminjaman alat (opsional).</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-7">
                  <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wide mb-1">
                    Foto Bukti Peminjaman
                  </h2>
                  <p className="text-xs text-slate-500 mb-4">
                    Unggah foto sebagai bukti pengambilan alat (misalnya foto alat atau foto kamu bersama alat).
                  </p>
                  <UploadFotoBukti
                    value={form.fotoBukti}
                    onChange={(dataUrl) => setForm({ ...form, fotoBukti: dataUrl })}
                    onClear={() => setForm({ ...form, fotoBukti: "" })}
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3.5 py-2.5">
                    {error}
                  </p>
                )}

                <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setForm(EMPTY_FORM)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/10 hover:bg-white/5 transition px-5 py-2.5 text-sm font-medium text-slate-300"
                  >
                    <span aria-hidden>✕</span> Batal
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 transition px-5 py-2.5 text-sm font-semibold shadow-lg shadow-emerald-500/15"
                  >
                    <span aria-hidden>➤</span> Simpan &amp; Lanjutkan
                  </button>
                </div>
              </form>
            </>
          )}
        </section>
      </div>
    </main>
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