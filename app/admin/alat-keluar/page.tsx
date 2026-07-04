"use client";
import { useMemo, useState } from "react";
import { Icon } from "@/lib/icons";
import { AlatKeluar, findAlat, genId, initialAlat, initialAlatKeluar, todayISO } from "@/lib/data";
import { ConfirmDialog, EmptyState, IconButton, Modal, PrimaryButton, SearchInput, Toolbar, inputClass, labelClass } from "@/components/ui";

export default function AlatKeluarPage() {
  const [data, setData] = useState<AlatKeluar[]>(initialAlatKeluar);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AlatKeluar | null>(null);
  const [form, setForm] = useState({ alatId: initialAlat[0]?.id || "", jumlah: 1, tanggal: todayISO(), tujuan: "", keterangan: "" });

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return data.filter((d) => (findAlat(initialAlat, d.alatId)?.nama.toLowerCase() || "").includes(q) || d.tujuan.toLowerCase().includes(q));
  }, [data, query]);

  function openAdd() {
    setForm({ alatId: initialAlat[0]?.id || "", jumlah: 1, tanggal: todayISO(), tujuan: "", keterangan: "" });
    setModalOpen(true);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setData((prev) => [{ id: genId("K"), ...form }, ...prev]);
    setModalOpen(false);
  }

  function handleDelete() {
    if (!deleteTarget) return;
    setData((prev) => prev.filter((d) => d.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  return (
    <>
      <Toolbar
        subtitle={`${filtered.length} catatan alat keluar`}
        action={
          <div className="flex items-center gap-3">
            <SearchInput value={query} onChange={setQuery} placeholder="Cari alat atau tujuan..." />
            <PrimaryButton onClick={openAdd}>
              <Icon name="plus" className="w-4 h-4" />
              Catat Alat Keluar
            </PrimaryButton>
          </div>
        }
      />

      <div className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-slate-500 text-xs uppercase tracking-wide">
                <th className="px-5 py-3 font-medium">Tanggal</th>
                <th className="px-5 py-3 font-medium">Alat</th>
                <th className="px-5 py-3 font-medium">Jumlah</th>
                <th className="px-5 py-3 font-medium">Tujuan</th>
                <th className="px-5 py-3 font-medium">Keterangan</th>
                <th className="px-5 py-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d.id} className="border-b border-white/5 hover:bg-white/[0.03] transition">
                  <td className="px-5 py-3.5 text-slate-400">{d.tanggal}</td>
                  <td className="px-5 py-3.5 text-white font-medium">{findAlat(initialAlat, d.alatId)?.nama || "-"}</td>
                  <td className="px-5 py-3.5 text-rose-400 font-semibold">-{d.jumlah}</td>
                  <td className="px-5 py-3.5 text-slate-300">{d.tujuan}</td>
                  <td className="px-5 py-3.5 text-slate-500">{d.keterangan}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end">
                      <IconButton label="trash" variant="danger" onClick={() => setDeleteTarget(d)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <EmptyState text="Belum ada catatan alat keluar." />}
        </div>
      </div>

      {modalOpen && (
        <Modal title="Catat Alat Keluar" onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className={labelClass}>Alat</label>
              <select className={inputClass} value={form.alatId} onChange={(e) => setForm({ ...form, alatId: e.target.value })}>
                {initialAlat.map((a) => (
                  <option key={a.id} value={a.id}>{a.nama}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Jumlah</label>
                <input type="number" min={1} className={inputClass} value={form.jumlah} onChange={(e) => setForm({ ...form, jumlah: Number(e.target.value) })} />
              </div>
              <div>
                <label className={labelClass}>Tanggal</label>
                <input type="date" className={inputClass} value={form.tanggal} onChange={(e) => setForm({ ...form, tanggal: e.target.value })} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Tujuan</label>
              <input className={inputClass} value={form.tujuan} onChange={(e) => setForm({ ...form, tujuan: e.target.value })} placeholder="Perbaikan / Dipindahkan" />
            </div>
            <div>
              <label className={labelClass}>Keterangan</label>
              <textarea className={inputClass} rows={2} value={form.keterangan} onChange={(e) => setForm({ ...form, keterangan: e.target.value })} />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5 transition">
                Batal
              </button>
              <PrimaryButton type="submit">Simpan</PrimaryButton>
            </div>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog title="Hapus Catatan" message="Yakin ingin menghapus catatan alat keluar ini?" onCancel={() => setDeleteTarget(null)} onConfirm={handleDelete} />
      )}
    </>
  );
}
