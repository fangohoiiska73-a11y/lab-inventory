"use client";
import { ReactNode } from "react";
import { Icon } from "@/lib/icons";

// Badge warna sesuai status/kondisi
const BADGE_STYLES: Record<string, string> = {
  Baik: "bg-emerald-500/15 text-emerald-400",
  "Rusak Ringan": "bg-amber-500/15 text-amber-400",
  "Rusak Berat": "bg-red-500/15 text-red-400",
  Aktif: "bg-sky-500/15 text-sky-400",
  Selesai: "bg-emerald-500/15 text-emerald-400",
  Terlambat: "bg-red-500/15 text-red-400",
  "Menunggu Verifikasi": "bg-amber-500/15 text-amber-400",
  "Menunggu Konfirmasi Kembali": "bg-violet-500/15 text-violet-400",
  Ditolak: "bg-rose-500/15 text-rose-400",
  default: "bg-slate-500/15 text-slate-300",
};

export function Badge({ text }: { text: string }) {
  return (
    <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-md whitespace-nowrap ${BADGE_STYLES[text] || BADGE_STYLES.default}`}>
      {text}
    </span>
  );
}

export function Toolbar({ subtitle, action }: { subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      {subtitle ? <p className="text-sm text-slate-400">{subtitle}</p> : <span />}
      {action}
    </div>
  );
}

export function PrimaryButton({ onClick, children, type = "button" }: { onClick?: () => void; children: ReactNode; type?: "button" | "submit" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 transition text-[#05070f] font-semibold text-sm px-4 py-2.5"
    >
      {children}
    </button>
  );
}

export function IconButton({ onClick, label, variant = "default" }: { onClick: () => void; label: "edit" | "trash"; variant?: "default" | "danger" }) {
  const styles =
    variant === "danger"
      ? "text-rose-400 hover:bg-rose-500/15"
      : "text-slate-300 hover:bg-white/10";
  return (
    <button onClick={onClick} className={`p-2 rounded-lg transition ${styles}`} aria-label={label}>
      <Icon name={label} className="w-4 h-4" />
    </button>
  );
}

export function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="relative w-full sm:w-72">
      <Icon name="search" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Cari..."}
        className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
      />
    </div>
  );
}

export function EmptyState({ text }: { text: string }) {
  return (
    <div className="py-14 text-center text-slate-500 text-sm">
      {text}
    </div>
  );
}

export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={onClose}>
      <div
        className="w-full max-w-lg bg-[#0b0f1c] border border-white/10 rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 sticky top-0 bg-[#0b0f1c]">
          <h3 className="font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition">
            <Icon name="x" className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export function ConfirmDialog({
  title,
  message,
  onCancel,
  onConfirm,
}: {
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={onCancel}>
      <div className="w-full max-w-sm bg-[#0b0f1c] border border-white/10 rounded-xl shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
        <div className="w-10 h-10 rounded-full bg-rose-500/15 text-rose-400 flex items-center justify-center mb-4">
          <Icon name="alert" className="w-5 h-5" />
        </div>
        <h3 className="font-semibold text-white mb-1">{title}</h3>
        <p className="text-sm text-slate-400 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5 transition">
            Batal
          </button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-lg text-sm font-medium bg-rose-500 hover:bg-rose-400 text-white transition">
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

export const inputClass =
  "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50";

export const labelClass = "block text-xs font-medium text-slate-400 mb-1.5";