"use client";
import { useEffect, useMemo, useState } from "react";
import { Icon } from "@/lib/icons";
import { Peminjam, genId } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import { ConfirmDialog, EmptyState, IconButton, Modal, PrimaryButton, SearchInput, Toolbar, inputClass, labelClass } from "@/components/ui";

const EMPTY_FORM: Omit<Peminjam, "id"> = { nama: "", noInduk: "", kelas: "", noHp: "" };

function mapRow(row: any): Peminjam {
  return {
    id: row.id,
    nama: row.nama,
    noInduk: row.no_induk,
    kelas: row.kelas,
    noHp: row.no_hp,
  };
}

export default function DataPeminjamPage() {
  const [peminjam, setPeminjam] = useState<Peminjam[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);

  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Peminjam | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState<Peminjam | null>(null);

  async function loadPeminjam() {
    setLoading(true);
    setLoadError("");
    try {
      const { data, error } = await supabase.from("peminjam").select("*").order("nama");
      if (error) throw error;
      setPeminjam((data ?? []).map(mapRow));
    } catch (err) {
      console.error(err);
      setLoadError("Gagal memuat data peminjam dari database.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPeminjam();
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return peminjam.filter(
      (p) =>
        p.nama.toLowerCase().includes(q) ||
        p.noInduk.toLowerCase().includes(q) ||
        p.kelas.toLowerCase().includes(q)
    );
  }, [peminjam, query]);

  function openAdd() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  }

  function openEdit(item: Peminjam) {
    setEditing(item);
    setForm({ nama: item.nama, noInduk: item.noInduk, kelas: item.kelas, noHp: item.noHp });
    setModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nama.trim() || !form.noInduk.trim()) return;

    setSaving(true);
    try {
      if (editing) {
        const { error } = await supabase
          .from("peminjam")
          .update({
            nama: form.nama,
            no_induk: form.noInduk,
            kelas: form.kelas,
            no_hp: form.noHp,
          })
          .eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("peminjam").insert({
          id: genId("P"),
          nama: form.nama,
          no_induk: form.noInduk,
          kelas: form.kelas,
          no_hp: form.noHp,
        });
        if (error) throw error;
      }
      setModalOpen(false);
      await loadPeminjam();
    } catch (err: any) {
      alert("Gagal menyimpan data: " + (err?.message || "terjadi kesalahan"));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      const { error } = await supabase.from("peminjam").delete().eq("id", deleteTarget.id);
      if (error) throw error;
      setDeleteTarget(null);
      await loadPeminjam();
    } catch (err: any) {
      alert("Gagal menghapus data: " + (err?.message || "terjadi kesalahan"));
    }
  }

  return (
    <>
      <Toolbar
        subtitle={loading ? "Memuat..." : `${filtered.length} dari ${peminjam.length} peminjam`}
        action={
          <div className="flex items-center gap-3">
            <SearchInput value={query} onChange={setQuery} placeholder="Cari nama, no induk, kelas..." />
            <PrimaryButton onClick={openAdd}>
              <Icon name="plus" className="w-4 h-4" />
              Tambah Peminjam
            </PrimaryButton>
          </div>
        }
      />

      {loadError && (
        <p className="mt-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3.5 py-2.5">
          {loadError}
        </p>
      )}

      <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-slate-500 text-xs uppercase tracking-wide">
                <th className="px-5 py-3 font-medium">No Induk</th>
                <th className="px-5 py-3 font-medium">Nama</th>
                <th className="px-5 py-3 font-medium">Kelas</th>
                <th className="px-5 py-3 font-medium">No HP</th>
                <th className="px-5 py-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.03] transition">
                  <td className="px-5 py-3.5 text-slate-300 font-mono text-xs">{p.noInduk}</td>
                  <td className="px-5 py-3.5 text-white font-medium">{p.nama}</td>
                  <td className="px-5 py-3.5 text-slate-400">{p.kelas}</td>
                  <td className="px-5 py-3.5 text-slate-400">{p.noHp}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-1">
                      <IconButton label="edit" onClick={() => openEdit(p)} />
                      <IconButton label="trash" variant="danger" onClick={() => setDeleteTarget(p)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && filtered.length === 0 && <EmptyState text="Tidak ada peminjam yang cocok dengan pencarian." />}
        </div>
      </div>

      {modalOpen && (
        <Modal title={editing ? "Edit Peminjam" : "Tambah Peminjam"} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSave} className="space-y-4">
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
              <label className={labelClass}>No HP</label>
              <input
                className={inputClass}
                value={form.noHp}
                onChange={(e) => setForm({ ...form, noHp: e.target.value })}
                placeholder="0812xxxxxxx"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5 transition"
              >
                Batal
              </button>
              <PrimaryButton type="submit">
                {saving ? "Menyimpan..." : editing ? "Simpan Perubahan" : "Tambah Peminjam"}
              </PrimaryButton>
            </div>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Hapus Peminjam"
          message={`Yakin ingin menghapus data "${deleteTarget.nama}"?`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
}