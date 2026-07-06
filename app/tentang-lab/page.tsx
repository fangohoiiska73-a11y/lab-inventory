import Navbar from "@/components/home/Navbar";
import Sidebar from "@/components/dashboard/Sidebar";
import { initialAlat } from "@/lib/data";

const FASILITAS = [
  "Perangkat jaringan (router, switch, access point) untuk praktik konfigurasi",
  "Peralatan instalasi kabel (crimping tool, LAN tester, kabel Cat5e/Cat6)",
  "Laptop & PC praktikum untuk simulasi dan konfigurasi jaringan",
  "Ruang praktik ber-AC dengan kapasitas hingga 36 siswa",
];

export default function TentangLabPage() {
  const totalAlat = initialAlat.length;
  const totalStok = initialAlat.reduce((sum, a) => sum + a.tersedia, 0);

  return (
    <main className="min-h-screen bg-[#05070f] text-white">
      <Navbar />
      <div className="mx-auto flex max-w-7xl">
        <Sidebar />

        <section className="flex-1 min-w-0 px-4 py-8 sm:px-8 sm:py-10">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              TENTANG <span className="text-emerald-400">LABORATORIUM</span>
            </h1>
            <p className="mt-1.5 text-sm text-slate-400">
              Mengenal lebih dekat Laboratorium TJKT SMK Siwa Lima St. Joseph Langgur.
            </p>
          </div>

          <div className="max-w-3xl space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-7">
              <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wide mb-3">
                Profil Laboratorium
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Laboratorium Teknik Jaringan Komputer dan Telekomunikasi (TJKT) adalah fasilitas praktik siswa
                untuk mendalami instalasi, konfigurasi, dan pemeliharaan jaringan komputer. Sistem peminjaman
                alat ini dibuat agar proses pinjam-kembali alat laboratorium lebih tertib, tercatat, dan mudah
                dipantau baik oleh siswa maupun petugas lab.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center">
                <p className="text-2xl font-bold text-emerald-400">{totalAlat}</p>
                <p className="mt-1 text-xs text-slate-400">Jenis Alat Tersedia</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center">
                <p className="text-2xl font-bold text-emerald-400">{totalStok}</p>
                <p className="mt-1 text-xs text-slate-400">Total Unit di Lab</p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-7">
              <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wide mb-4">
                Fasilitas
              </h2>
              <ul className="space-y-3">
                {FASILITAS.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-slate-300">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}