"use client";
import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/home/Navbar";
import CameraCapture from "@/components/CameraCapture";
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
      setError("Foto bukti wajib diambil (wajah terlihat jelas sambil memegang alat) sebelum pengajuan bisa dikirim.");
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
    <main className="relative min-h-screen overflow-hidden bg-[#05070f] text-white">
      <div className="absolute -left-40 top-24 h-[360px] w-[360px] rounded-full bg-emerald-500/10 blur-[150px]" />
      <div className="absolute -right-40 bottom-0 h-[320px] w-[320px] rounded-full bg-emerald-400/5 blur-[150px]" />

      <div className="relative z-10">
        <Navbar />
      </div>

      <section className="relative z-10 mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-8 text-center">
          <p className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300 tracking-widest text-xs uppercase font-semibold">
            TJKT System
          </p>
          <h1 className="mt-3 text-3xl sm:text-4xl font-bold">
            Ajukan <span className="text-emerald-400">Peminjaman Alat</span>
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Isi form di bawah untuk mengajukan peminjaman alat laboratorium TJKT.
          </p>
        </div>

        {sukses ? (
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/[0.06] p-8 text-center">
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
                className="mt-5 w-28 h-28 object-cover rounded-xl border border-emerald-400/30 mx-auto -scale-x-100"
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
          <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 backdrop-blur-md"
          >
            <div>
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
                <div className="grid grid-cols-2 gap-4">
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

            <div className="border-t border-white/10 pt-5">
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
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                    <p className="mt-1 text-xs text-slate-500">
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
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-5">
              <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wide mb-1">
                Foto Bukti Peminjaman
              </h2>
              <p className="text-xs text-slate-500 mb-4">
                Wajib: foto wajah kamu dengan jelas sambil memegang alat yang dipinjam. Foto harus diambil langsung dari kamera saat ini (tidak bisa unggah dari galeri).
              </p>
              <CameraCapture
                value={form.fotoBukti}
                onCapture={(dataUrl) => setForm({ ...form, fotoBukti: dataUrl })}
                onClear={() => setForm({ ...form, fotoBukti: "" })}
                label="Foto sambil memegang alat"
              />
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3.5 py-2.5">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-lg bg-emerald-500 hover:bg-emerald-600 transition py-3 text-sm font-semibold shadow-lg shadow-emerald-500/15"
            >
              Kirim Pengajuan →
            </button>
          </form>
        )}
      </section>
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