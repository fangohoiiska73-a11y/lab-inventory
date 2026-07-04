"use client";
import { useState } from "react";
import { Icon } from "@/lib/icons";
import { PrimaryButton, inputClass, labelClass } from "@/components/ui";

export default function GantiPasswordPage() {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ lama: "", baru: "", konfirmasi: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccess(false);

    if (!form.lama || !form.baru || !form.konfirmasi) {
      setError("Semua kolom wajib diisi.");
      return;
    }
    if (form.baru.length < 6) {
      setError("Password baru minimal 6 karakter.");
      return;
    }
    if (form.baru !== form.konfirmasi) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }

    // TODO: ganti dengan panggilan API ke backend untuk update password sungguhan
    setError("");
    setSuccess(true);
    setForm({ lama: "", baru: "", konfirmasi: "" });
  }

  return (
    <div className="max-w-md">
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
            <Icon name="key" className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-semibold text-white">Ganti Password</h2>
            <p className="text-xs text-slate-500">Perbarui password akun admin kamu</p>
          </div>
        </div>

        {success && (
          <div className="mb-5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm px-4 py-3">
            Password berhasil diubah.
          </div>
        )}
        {error && (
          <div className="mb-5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm px-4 py-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Password Lama</label>
            <div className="relative">
              <input
                type={showOld ? "text" : "password"}
                className={inputClass}
                value={form.lama}
                onChange={(e) => setForm({ ...form, lama: e.target.value })}
              />
              <button type="button" onClick={() => setShowOld((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                <Icon name="eye" className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <label className={labelClass}>Password Baru</label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                className={inputClass}
                value={form.baru}
                onChange={(e) => setForm({ ...form, baru: e.target.value })}
              />
              <button type="button" onClick={() => setShowNew((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                <Icon name="eye" className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-1">Minimal 6 karakter.</p>
          </div>

          <div>
            <label className={labelClass}>Konfirmasi Password Baru</label>
            <input
              type={showNew ? "text" : "password"}
              className={inputClass}
              value={form.konfirmasi}
              onChange={(e) => setForm({ ...form, konfirmasi: e.target.value })}
            />
          </div>

          <PrimaryButton type="submit">Simpan Password</PrimaryButton>
        </form>
      </div>
    </div>
  );
}
