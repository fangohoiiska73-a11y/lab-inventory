"use client";
import { FormEvent, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/home/Navbar";
import CameraCapture from "@/components/CameraCapture";

interface FormState {
  nama: string;
  noInduk: string;
  namaAlat: string;
  kondisiKembali: "Baik" | "Rusak Ringan" | "Rusak Berat";
  catatan: string;
  fotoBukti: string;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

const EMPTY_FORM: FormState = {
  nama: "",
  noInduk: "",
  namaAlat: "",
  kondisiKembali: "Baik",
  catatan: "",
  fotoBukti: "",
};

const inputClass =
  "w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30";
const labelClass = "block text-sm text-slate-200 mb-1.5";

export default function FormPengembalianPage() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [error, setError] = useState("");
  const [sukses, setSukses] = useState<FormState | null>(null);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!form.nama.trim() || !form.noInduk.trim()) {
      setError("Nama dan No Induk wajib diisi.");
      return;
    }
    if (!form.namaAlat.trim()) {
      setError("Nama alat yang dikembalikan wajib diisi.");
      return;
    }
    if (!form.fotoBukti) {
      setError("Foto bukti wajib diambil (wajah terlihat jelas sambil memegang alat yang dikembalikan) sebelum form bisa dikirim.");
      return;
    }
    if (form.kondisiKembali !== "Baik" && !form.catatan.trim()) {
      setError("Karena kondisi alat tidak baik, mohon isi catatan/keterangan kerusakannya.");
      return;
    }

    // TODO: sambungkan ke backend/API supaya data pengembalian (termasuk fotoBukti)
    // tersimpan dan tersinkron dengan status peminjaman yang bersangkutan di admin.
    setSukses(form);
  }

  function handleReset() {
    setSukses(null);
    setForm(EMPTY_FORM);
    setError("");
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
                className="mt-5 w-28 h-28 object-cover rounded-xl border border-sky-400/30 mx-auto -scale-x-100"
              />
            )}

            <div className="mt-6 space-y-2.5 rounded-xl border border-white/10 bg-white/[0.03] p-5 text-left text-sm">
              <Row label="Nama" value={sukses.nama} />
              <Row label="No Induk" value={sukses.noInduk} />
              <Row label="Alat Dikembalikan" value={sukses.namaAlat} />
              <Row label="Kondisi" value={sukses.kondisiKembali} />
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
          <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 backdrop-blur-md"
          >
            <div>
              <h2 className="text-sm font-semibold text-sky-400 uppercase tracking-wide mb-4">
                Data Peminjam
              </h2>
              <div className="grid grid-cols-2 gap-4">
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
              </div>
            </div>

            <div className="border-t border-white/10 pt-5">
              <h2 className="text-sm font-semibold text-sky-400 uppercase tracking-wide mb-4">
                Detail Alat Dikembalikan
              </h2>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Nama Alat</label>
                  <input
                    className={inputClass}
                    value={form.namaAlat}
                    onChange={(e) => setForm({ ...form, namaAlat: e.target.value })}
                    placeholder="Router Mikrotik RB941"
                    required
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Isi sesuai nama alat yang tertera pada bukti pengajuan peminjaman kamu.
                  </p>
                </div>

                <div>
                  <label className={labelClass}>Kondisi Alat Saat Dikembalikan</label>
                  <select
                    className={inputClass}
                    value={form.kondisiKembali}
                    onChange={(e) => setForm({ ...form, kondisiKembali: e.target.value as FormState["kondisiKembali"] })}
                  >
                    <option value="Baik">Baik</option>
                    <option value="Rusak Ringan">Rusak Ringan</option>
                    <option value="Rusak Berat">Rusak Berat</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>
                    Catatan {form.kondisiKembali !== "Baik" && <span className="text-red-400">*wajib diisi</span>}
                  </label>
                  <textarea
                    className={inputClass}
                    rows={3}
                    value={form.catatan}
                    onChange={(e) => setForm({ ...form, catatan: e.target.value })}
                    placeholder="Contoh: layar retak sedikit di pojok kanan atas"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-5">
              <h2 className="text-sm font-semibold text-sky-400 uppercase tracking-wide mb-1">
                Foto Bukti Pengembalian
              </h2>
              <p className="text-xs text-slate-500 mb-4">
                Wajib: foto wajah kamu dengan jelas sambil memegang alat yang dikembalikan. Foto harus diambil langsung dari kamera saat ini.
              </p>
              <CameraCapture
                value={form.fotoBukti}
                onCapture={(dataUrl) => setForm({ ...form, fotoBukti: dataUrl })}
                onClear={() => setForm({ ...form, fotoBukti: "" })}
                label="Foto sambil memegang alat yang dikembalikan"
              />
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3.5 py-2.5">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-lg bg-sky-500 hover:bg-sky-600 transition py-3 text-sm font-semibold text-[#05070f] shadow-lg shadow-sky-500/15"
            >
              Kirim Pengembalian →
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