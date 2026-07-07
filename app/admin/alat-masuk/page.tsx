"use client";
import { useEffect, useMemo, useState } from "react";
import { Icon } from "@/lib/icons";
import { Alat, AlatMasuk, findAlat, todayISO } from "@/lib/data";
import { fetchAlatList, fetchAllAlatMasuk, tambahAlatMasuk, hapusAlatMasuk } from "@/lib/queries";
import { ConfirmDialog, EmptyState, IconButton, Modal, PrimaryButton, SearchInput, Toolbar, inputClass, labelClass } from "@/components/ui";

export default function AlatMasukPage() {
  const [alatList, setAlatList] = useState<Alat[]>([]);
  const [data, setData] = useState<AlatMasuk[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AlatMasuk | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ alatId: "", jumlah: 1, tanggal: todayISO(), sumber: "", keterangan: "" });

  async function loadData() {
    setLoading(true);
    setLoadError("");
    try {
      const [alat, masuk] = await Promise.all([fetchAlatList(), fetchAllAlatMasuk()]);
      setAlatList(alat);
      setData(masuk);
      setForm((f) => ({ ...f, alatId: f.alatId || alat[0]?.id || "" }));
    } catch (err: any) {
      setLoadError(err.message ?? "Gagal memuat data alat masuk.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return data.filter(
      (d) =>
        (findAlat(alatList, d.alatId)?.nama.toLowerCase() || "").includes(q) ||
        d.sumber.toLowerCase().includes(q)
    );
  }, [data, alatList, query]);

  function openAdd() {
    setForm({ alatId: alatList[0]?.id || "", jumlah: 1, tanggal: todayISO(), sumber: "", keterangan: "" });
    setModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (saving) return;
    if (!form.alatId) return;
    setSaving(true);
    try {
      await tambahAlatMasuk(form);
      setModalOpen(false);
      // Reload dari database supaya data & stok alat selalu sinkron dengan yang tersimpan.
      await loadData();
    } catch (err: any) {
      alert(err.message ?? "Gagal menyimpan data alat masuk.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setSaving(true);
    try {
      await hapusAlatMasuk(deleteTarget.id);
      setDeleteTarget(null);
      await loadData();
    } catch (err: any) {
      alert(err.message ?? "Gagal menghapus catatan.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-slate-400 text-sm">Memuat data...</p>;
  }

  return (
    <>
      {loadError && (
        <p className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3.5 py-2.5">
          {loadError}
        </p>
      )}

      <Toolbar
        subtitle={`${filtered.length} catatan alat masuk`}
        action={
          <div className="flex items-center gap-3">
            <SearchInput value={query} onChange={setQuery} placeholder="Cari alat atau sumber..." />
            <PrimaryButton onClick={openAdd}>
              <Icon name="plus" className="w-4 h-4" />
              Catat Alat Masuk
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
                <th className="px-5 py-3 font-medium">Sumber</th>
                <th className="px-5 py-3 font-medium">Keterangan</th>
                <th className="px-5 py-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d.id} className="border-b border-white/5 hover:bg-white/[0.03] transition">
                  <td className="px-5 py-3.5 text-slate-400">{d.tanggal}</td>
                  <td className="px-5 py-3.5 text-white font-medium">{findAlat(alatList, d.alatId)?.nama || "-"}</td>
                  <td className="px-5 py-3.5 text-emerald-400 font-semibold">+{d.jumlah}</td>
                  <td className="px-5 py-3.5 text-slate-300">{d.sumber}</td>
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
          {filtered.length === 0 && <EmptyState text="Belum ada catatan alat masuk." />}
        </div>
      </div>

      {modalOpen && (
        <Modal title="Catat Alat Masuk" onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className={labelClass}>Alat</label>
              <select className={inputClass} value={form.alatId} onChange={(e) => setForm({ ...form, alatId: e.target.value })}>
                {alatList.map((a) => (
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
              <label className={labelClass}>Sumber</label>
              <input className={inputClass} value={form.sumber} onChange={(e) => setForm({ ...form, sumber: e.target.value })} placeholder="Pembelian Toko Jaya" />
            </div>
            <div>
              <label className={labelClass}>Keterangan</label>
              <textarea className={inputClass} rows={2} value={form.keterangan} onChange={(e) => setForm({ ...form, keterangan: e.target.value })} />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5 transition">
                Batal
              </button>
              <PrimaryButton type="submit">{saving ? "Menyimpan..." : "Simpan"}</PrimaryButton>
            </div>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Hapus Catatan"
          message="Yakin ingin menghapus catatan alat masuk ini?"
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
}