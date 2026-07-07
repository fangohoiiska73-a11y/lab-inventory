"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@/lib/icons";
import { Alat, KATEGORI_ALAT, genId } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import { fetchAlatList } from "@/lib/queries";
import { Badge, ConfirmDialog, EmptyState, IconButton, Modal, PrimaryButton, SearchInput, Toolbar, inputClass, labelClass } from "@/components/ui";

const EMPTY_FORM: Omit<Alat, "id"> = {
  kode: "",
  nama: "",
  kategori: KATEGORI_ALAT[0],
  jumlah: 0,
  tersedia: 0,
  kondisi: "Baik",
  lokasi: "",
  gambar: "",
};

// Ukuran maksimum file gambar yang boleh diupload (2MB)
const MAX_FILE_SIZE = 2 * 1024 * 1024;

export default function DataAlatPage() {
  const [alat, setAlat] = useState<Alat[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);

  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Alat | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState<Alat | null>(null);
  const [imgError, setImgError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function loadAlat() {
    setLoading(true);
    setLoadError("");
    try {
      const list = await fetchAlatList();
      setAlat(list);
    } catch (err) {
      console.error(err);
      setLoadError("Gagal memuat data alat dari database.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAlat();
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return alat.filter(
      (a) =>
        a.nama.toLowerCase().includes(q) ||
        a.kode.toLowerCase().includes(q) ||
        a.kategori.toLowerCase().includes(q)
    );
  }, [alat, query]);

  function openAdd() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setImgError("");
    setModalOpen(true);
  }

  function openEdit(item: Alat) {
    setEditing(item);
    setForm({
      kode: item.kode,
      nama: item.nama,
      kategori: item.kategori,
      jumlah: item.jumlah,
      tersedia: item.tersedia,
      kondisi: item.kondisi,
      lokasi: item.lokasi,
      gambar: item.gambar || "",
    });
    setImgError("");
    setModalOpen(true);
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImgError("File harus berupa gambar (JPG, PNG, WEBP, dll).");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setImgError("Ukuran gambar maksimal 2MB.");
      return;
    }

    setImgError("");
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, gambar: reader.result as string }));
    };
    reader.readAsDataURL(file);
  }

  function handleRemoveImage() {
    setForm((prev) => ({ ...prev, gambar: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nama.trim() || !form.kode.trim()) return;

    setSaving(true);
    try {
      if (editing) {
        const { error } = await supabase
          .from("alat")
          .update({
            kode: form.kode,
            nama: form.nama,
            kategori: form.kategori,
            jumlah: form.jumlah,
            tersedia: form.tersedia,
            kondisi: form.kondisi,
            lokasi: form.lokasi,
            gambar: form.gambar,
          })
          .eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("alat").insert({
          id: genId("A"),
          ...form,
        });
        if (error) throw error;
      }
      setModalOpen(false);
      await loadAlat();
    } catch (err: any) {
      alert("Gagal menyimpan data: " + (err?.message || "terjadi kesalahan"));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      const { error } = await supabase.from("alat").delete().eq("id", deleteTarget.id);
      if (error) throw error;
      setDeleteTarget(null);
      await loadAlat();
    } catch (err: any) {
      alert("Gagal menghapus data: " + (err?.message || "terjadi kesalahan"));
    }
  }

  return (
    <>
      <Toolbar
        subtitle={loading ? "Memuat..." : `${filtered.length} dari ${alat.length} alat`}
        action={
          <div className="flex items-center gap-3">
            <SearchInput value={query} onChange={setQuery} placeholder="Cari nama, kode, kategori..." />
            <PrimaryButton onClick={openAdd}>
              <Icon name="plus" className="w-4 h-4" />
              Tambah Alat
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
                <th className="px-5 py-3 font-medium">Gambar</th>
                <th className="px-5 py-3 font-medium">Kode</th>
                <th className="px-5 py-3 font-medium">Nama Alat</th>
                <th className="px-5 py-3 font-medium">Kategori</th>
                <th className="px-5 py-3 font-medium">Jumlah</th>
                <th className="px-5 py-3 font-medium">Tersedia</th>
                <th className="px-5 py-3 font-medium">Kondisi</th>
                <th className="px-5 py-3 font-medium">Lokasi</th>
                <th className="px-5 py-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} className="border-b border-white/5 hover:bg-white/[0.03] transition">
                  <td className="px-5 py-3.5">
                    {a.gambar ? (
                      <img
                        src={a.gambar}
                        alt={a.nama}
                        className="w-11 h-11 rounded-lg object-cover border border-white/10"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-600">
                        <Icon name="box" className="w-5 h-5" />
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-slate-300 font-mono text-xs">{a.kode}</td>
                  <td className="px-5 py-3.5 text-white font-medium">{a.nama}</td>
                  <td className="px-5 py-3.5 text-slate-400">{a.kategori}</td>
                  <td className="px-5 py-3.5 text-slate-300">{a.jumlah}</td>
                  <td className="px-5 py-3.5 text-slate-300">{a.tersedia}</td>
                  <td className="px-5 py-3.5">
                    <Badge text={a.kondisi} />
                  </td>
                  <td className="px-5 py-3.5 text-slate-400">{a.lokasi}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-1">
                      <IconButton label="edit" onClick={() => openEdit(a)} />
                      <IconButton label="trash" variant="danger" onClick={() => setDeleteTarget(a)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && filtered.length === 0 && <EmptyState text="Tidak ada alat yang cocok dengan pencarian." />}
        </div>
      </div>

      {modalOpen && (
        <Modal title={editing ? "Edit Alat" : "Tambah Alat"} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSave} className="space-y-4">
            {/* UPLOAD GAMBAR */}
            <div>
              <label className={labelClass}>Gambar Alat</label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                  {form.gambar ? (
                    <img src={form.gambar} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Icon name="box" className="w-7 h-7 text-slate-600" />
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex gap-2">
                    <label className="cursor-pointer inline-flex items-center gap-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition text-sm font-medium px-3.5 py-2">
                      <Icon name="in" className="w-4 h-4" />
                      Pilih Gambar
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>

                    {form.gambar && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="inline-flex items-center gap-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition text-sm font-medium px-3.5 py-2"
                      >
                        <Icon name="trash" className="w-4 h-4" />
                        Hapus
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">JPG, PNG, atau WEBP. Maks 2MB.</p>
                  {imgError && <p className="text-xs text-rose-400">{imgError}</p>}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Kode Alat</label>
                <input
                  className={inputClass}
                  value={form.kode}
                  onChange={(e) => setForm({ ...form, kode: e.target.value })}
                  placeholder="JRK-001"
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Kategori</label>
                <select
                  className={inputClass}
                  value={form.kategori}
                  onChange={(e) => setForm({ ...form, kategori: e.target.value })}
                >
                  {KATEGORI_ALAT.map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className={labelClass}>Nama Alat</label>
              <input
                className={inputClass}
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                placeholder="Router Mikrotik RB941"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Jumlah Total</label>
                <input
                  type="number"
                  min={0}
                  className={inputClass}
                  value={form.jumlah}
                  onChange={(e) => setForm({ ...form, jumlah: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className={labelClass}>Jumlah Tersedia</label>
                <input
                  type="number"
                  min={0}
                  className={inputClass}
                  value={form.tersedia}
                  onChange={(e) => setForm({ ...form, tersedia: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Kondisi</label>
                <select
                  className={inputClass}
                  value={form.kondisi}
                  onChange={(e) => setForm({ ...form, kondisi: e.target.value as Alat["kondisi"] })}
                >
                  <option>Baik</option>
                  <option>Rusak Ringan</option>
                  <option>Rusak Berat</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Lokasi</label>
                <input
                  className={inputClass}
                  value={form.lokasi}
                  onChange={(e) => setForm({ ...form, lokasi: e.target.value })}
                  placeholder="Rak A1"
                />
              </div>
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
                {saving ? "Menyimpan..." : editing ? "Simpan Perubahan" : "Tambah Alat"}
              </PrimaryButton>
            </div>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Hapus Alat"
          message={`Yakin ingin menghapus "${deleteTarget.nama}"? Tindakan ini tidak bisa dibatalkan.`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
}