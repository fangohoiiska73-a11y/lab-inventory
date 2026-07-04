"use client";
import { useMemo, useState } from "react";
import { Icon } from "@/lib/icons";
import { Peminjaman, findAlat, findPeminjam, genId, initialAlat, initialPeminjam, initialPeminjaman, todayISO } from "@/lib/data";
import { Badge, ConfirmDialog, EmptyState, IconButton, Modal, PrimaryButton, SearchInput, Toolbar, inputClass, labelClass } from "@/components/ui";

const STATUS_FILTERS = ["Semua", "Aktif", "Selesai", "Terlambat"] as const;

export default function PeminjamanPage() {
  const [peminjaman, setPeminjaman] = useState<Peminjaman[]>(initialPeminjaman);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<typeof STATUS_FILTERS[number]>("Semua");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Peminjaman | null>(null);

  const [form, setForm] = useState({
    peminjamId: initialPeminjam[0]?.id || "",
    alatId: initialAlat[0]?.id || "",
    jumlah: 1,
    tanggalPinjam: todayISO(),
    tanggalKembali: todayISO(),
  });

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return peminjaman.filter((p) => {
      const namaPeminjam = findPeminjam(initialPeminjam, p.peminjamId)?.nama.toLowerCase() || "";
      const namaAlat = findAlat(initialAlat, p.alatId)?.nama.toLowerCase() || "";
      const matchQuery = namaPeminjam.includes(q) || namaAlat.includes(q);
      const matchStatus = statusFilter === "Semua" || p.status === statusFilter;
      return matchQuery && matchStatus;
    });
  }, [peminjaman, query, statusFilter]);

  function openAdd() {
    setForm({ peminjamId: initialPeminjam[0]?.id || "", alatId: initialAlat[0]?.id || "", jumlah: 1, tanggalPinjam: todayISO(), tanggalKembali: todayISO() });
    setModalOpen(true);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setPeminjaman((prev) => [...prev, { id: genId("PJ"), ...form, status: "Aktif" }]);
    setModalOpen(false);
  }

  function markSelesai(id: string) {
    setPeminjaman((prev) => prev.map((p) => (p.id === id ? { ...p, status: "Selesai" } : p)));
  }

  function handleDelete() {
    if (!deleteTarget) return;
    setPeminjaman((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  return (
    <>
      <Toolbar
        subtitle={`${filtered.length} dari ${peminjaman.length} transaksi`}
        action={
          <div className="flex flex-wrap items-center gap-3">
            <SearchInput value={query} onChange={setQuery} placeholder="Cari peminjam atau alat..." />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            >
              {STATUS_FILTERS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <PrimaryButton onClick={openAdd}>
              <Icon name="plus" className="w-4 h-4" />
              Catat Peminjaman
            </PrimaryButton>
          </div>
        }
      />

      <div className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-slate-500 text-xs uppercase tracking-wide">
                <th className="px-5 py-3 font-medium">Peminjam</th>
                <th className="px-5 py-3 font-medium">Alat</th>
                <th className="px-5 py-3 font-medium">Jumlah</th>
                <th className="px-5 py-3 font-medium">Tgl Pinjam</th>
                <th className="px-5 py-3 font-medium">Tgl Kembali</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.03] transition">
                  <td className="px-5 py-3.5 text-white font-medium">{findPeminjam(initialPeminjam, p.peminjamId)?.nama || "-"}</td>
                  <td className="px-5 py-3.5 text-slate-300">{findAlat(initialAlat, p.alatId)?.nama || "-"}</td>
                  <td className="px-5 py-3.5 text-slate-400">{p.jumlah}</td>
                  <td className="px-5 py-3.5 text-slate-400">{p.tanggalPinjam}</td>
                  <td className="px-5 py-3.5 text-slate-400">{p.tanggalKembali}</td>
                  <td className="px-5 py-3.5">
                    <Badge text={p.status} />
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end items-center gap-1">
                      {p.status !== "Selesai" && (
                        <button
                          onClick={() => markSelesai(p.id)}
                          className="text-xs font-medium text-emerald-400 hover:bg-emerald-500/10 rounded-lg px-2.5 py-1.5 transition"
                        >
                          Tandai Selesai
                        </button>
                      )}
                      <IconButton label="trash" variant="danger" onClick={() => setDeleteTarget(p)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <EmptyState text="Tidak ada transaksi peminjaman yang cocok." />}
        </div>
      </div>

      {modalOpen && (
        <Modal title="Catat Peminjaman Baru" onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className={labelClass}>Peminjam</label>
              <select className={inputClass} value={form.peminjamId} onChange={(e) => setForm({ ...form, peminjamId: e.target.value })}>
                {initialPeminjam.map((p) => (
                  <option key={p.id} value={p.id}>{p.nama} — {p.kelas}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Alat</label>
              <select className={inputClass} value={form.alatId} onChange={(e) => setForm({ ...form, alatId: e.target.value })}>
                {initialAlat.map((a) => (
                  <option key={a.id} value={a.id}>{a.nama} (tersedia: {a.tersedia})</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Jumlah</label>
                <input type="number" min={1} className={inputClass} value={form.jumlah} onChange={(e) => setForm({ ...form, jumlah: Number(e.target.value) })} />
              </div>
              <div>
                <label className={labelClass}>Tanggal Pinjam</label>
                <input type="date" className={inputClass} value={form.tanggalPinjam} onChange={(e) => setForm({ ...form, tanggalPinjam: e.target.value })} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Tanggal Rencana Kembali</label>
              <input type="date" className={inputClass} value={form.tanggalKembali} onChange={(e) => setForm({ ...form, tanggalKembali: e.target.value })} />
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
        <ConfirmDialog
          title="Hapus Data Peminjaman"
          message="Yakin ingin menghapus catatan peminjaman ini?"
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
}
