"use client";
import { useEffect, useMemo, useState } from "react";
import { Icon } from "@/lib/icons";
import { Alat, AlatKeluar, AlatMasuk, KATEGORI_ALAT, Peminjam, Peminjaman, findAlat, findPeminjam } from "@/lib/data";
import { fetchAlatList, fetchAllAlatKeluar, fetchAllAlatMasuk, fetchAllPeminjam, fetchAllPeminjaman } from "@/lib/queries";
import { Badge, PrimaryButton, Toolbar } from "@/components/ui";

type Tab = "Ringkasan" | "Peminjaman" | "Alat Masuk" | "Alat Keluar";
const TABS: Tab[] = ["Ringkasan", "Peminjaman", "Alat Masuk", "Alat Keluar"];

export default function LaporanPage() {
  const [tab, setTab] = useState<Tab>("Ringkasan");

  const [alatList, setAlatList] = useState<Alat[]>([]);
  const [peminjamanList, setPeminjamanList] = useState<Peminjaman[]>([]);
  const [peminjamList, setPeminjamList] = useState<Peminjam[]>([]);
  const [alatMasukList, setAlatMasukList] = useState<AlatMasuk[]>([]);
  const [alatKeluarList, setAlatKeluarList] = useState<AlatKeluar[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    Promise.all([fetchAlatList(), fetchAllPeminjaman(), fetchAllPeminjam(), fetchAllAlatMasuk(), fetchAllAlatKeluar()])
      .then(([alat, peminjaman, peminjam, masuk, keluar]) => {
        setAlatList(alat);
        setPeminjamanList(peminjaman);
        setPeminjamList(peminjam);
        setAlatMasukList(masuk);
        setAlatKeluarList(keluar);
      })
      .catch((err) => {
        console.error(err);
        setLoadError("Gagal memuat data laporan.");
      })
      .finally(() => setLoading(false));
  }, []);

  const perKategori = useMemo(
    () =>
      KATEGORI_ALAT.map((kat) => {
        const items = alatList.filter((a) => a.kategori === kat);
        return {
          kategori: kat,
          jumlahAlat: items.length,
          totalUnit: items.reduce((s, a) => s + a.jumlah, 0),
          tersedia: items.reduce((s, a) => s + a.tersedia, 0),
        };
      }).filter((k) => k.jumlahAlat > 0),
    [alatList]
  );

  function exportCSV() {
    let rows: string[] = [];
    if (tab === "Ringkasan") {
      rows = [
        "Kategori,Jumlah Jenis Alat,Total Unit,Tersedia",
        ...perKategori.map((k) => `${k.kategori},${k.jumlahAlat},${k.totalUnit},${k.tersedia}`),
      ];
    } else if (tab === "Peminjaman") {
      rows = [
        "Peminjam,Alat,Jumlah,Tanggal Pinjam,Tanggal Kembali,Status",
        ...peminjamanList.map((p) =>
          [
            findPeminjam(peminjamList, p.peminjamId)?.nama,
            findAlat(alatList, p.alatId)?.nama,
            p.jumlah,
            p.tanggalPinjam,
            p.tanggalKembali,
            p.status,
          ].join(",")
        ),
      ];
    } else if (tab === "Alat Masuk") {
      rows = [
        "Tanggal,Alat,Jumlah,Sumber",
        ...alatMasukList.map((m) => [m.tanggal, findAlat(alatList, m.alatId)?.nama, m.jumlah, m.sumber].join(",")),
      ];
    } else {
      rows = [
        "Tanggal,Alat,Jumlah,Tujuan",
        ...alatKeluarList.map((k) => [k.tanggal, findAlat(alatList, k.alatId)?.nama, k.jumlah, k.tujuan].join(",")),
      ];
    }
    const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `laporan-${tab.toLowerCase().replace(/\s+/g, "-")}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return <p className="text-slate-400 text-sm">Memuat data laporan...</p>;
  }

  return (
    <>
      {loadError && (
        <p className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3.5 py-2.5">
          {loadError}
        </p>
      )}

      <Toolbar
        subtitle="Ringkasan data inventaris dan transaksi"
        action={
          <PrimaryButton onClick={exportCSV}>
            <Icon name="download" className="w-4 h-4" />
            Export CSV
          </PrimaryButton>
        }
      />

      {/* TABS */}
      <div className="flex gap-1 border-b border-white/10 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition ${
              tab === t ? "border-emerald-400 text-white" : "border-transparent text-slate-500 hover:text-slate-300"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Ringkasan" && (
        <div className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-slate-500 text-xs uppercase tracking-wide">
                <th className="px-5 py-3 font-medium">Kategori</th>
                <th className="px-5 py-3 font-medium">Jenis Alat</th>
                <th className="px-5 py-3 font-medium">Total Unit</th>
                <th className="px-5 py-3 font-medium">Tersedia</th>
              </tr>
            </thead>
            <tbody>
              {perKategori.map((k) => (
                <tr key={k.kategori} className="border-b border-white/5">
                  <td className="px-5 py-3.5 text-white font-medium">{k.kategori}</td>
                  <td className="px-5 py-3.5 text-slate-300">{k.jumlahAlat}</td>
                  <td className="px-5 py-3.5 text-slate-300">{k.totalUnit}</td>
                  <td className="px-5 py-3.5 text-emerald-400">{k.tersedia}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "Peminjaman" && (
        <div className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-slate-500 text-xs uppercase tracking-wide">
                <th className="px-5 py-3 font-medium">Peminjam</th>
                <th className="px-5 py-3 font-medium">Alat</th>
                <th className="px-5 py-3 font-medium">Tgl Pinjam</th>
                <th className="px-5 py-3 font-medium">Tgl Kembali</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {peminjamanList.map((p) => (
                <tr key={p.id} className="border-b border-white/5">
                  <td className="px-5 py-3.5 text-white font-medium">{findPeminjam(peminjamList, p.peminjamId)?.nama}</td>
                  <td className="px-5 py-3.5 text-slate-300">{findAlat(alatList, p.alatId)?.nama}</td>
                  <td className="px-5 py-3.5 text-slate-400">{p.tanggalPinjam}</td>
                  <td className="px-5 py-3.5 text-slate-400">{p.tanggalKembali}</td>
                  <td className="px-5 py-3.5"><Badge text={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "Alat Masuk" && (
        <div className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-slate-500 text-xs uppercase tracking-wide">
                <th className="px-5 py-3 font-medium">Tanggal</th>
                <th className="px-5 py-3 font-medium">Alat</th>
                <th className="px-5 py-3 font-medium">Jumlah</th>
                <th className="px-5 py-3 font-medium">Sumber</th>
              </tr>
            </thead>
            <tbody>
              {alatMasukList.map((m) => (
                <tr key={m.id} className="border-b border-white/5">
                  <td className="px-5 py-3.5 text-slate-400">{m.tanggal}</td>
                  <td className="px-5 py-3.5 text-white font-medium">{findAlat(alatList, m.alatId)?.nama}</td>
                  <td className="px-5 py-3.5 text-emerald-400 font-semibold">+{m.jumlah}</td>
                  <td className="px-5 py-3.5 text-slate-300">{m.sumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "Alat Keluar" && (
        <div className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-slate-500 text-xs uppercase tracking-wide">
                <th className="px-5 py-3 font-medium">Tanggal</th>
                <th className="px-5 py-3 font-medium">Alat</th>
                <th className="px-5 py-3 font-medium">Jumlah</th>
                <th className="px-5 py-3 font-medium">Tujuan</th>
              </tr>
            </thead>
            <tbody>
              {alatKeluarList.map((k) => (
                <tr key={k.id} className="border-b border-white/5">
                  <td className="px-5 py-3.5 text-slate-400">{k.tanggal}</td>
                  <td className="px-5 py-3.5 text-white font-medium">{findAlat(alatList, k.alatId)?.nama}</td>
                  <td className="px-5 py-3.5 text-rose-400 font-semibold">-{k.jumlah}</td>
                  <td className="px-5 py-3.5 text-slate-300">{k.tujuan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}