import Navbar from "@/components/home/Navbar";
import Sidebar from "@/components/dashboard/sidebar";

const LANGKAH = [
  {
    no: "01",
    judul: "Pilih Alat yang Dibutuhkan",
    desc: "Buka halaman Ajukan Peminjaman, lalu pilih alat laboratorium yang ingin dipinjam dari daftar yang tersedia.",
  },
  {
    no: "02",
    judul: "Isi Data Diri & Detail Peminjaman",
    desc: "Lengkapi nama, no induk, kelas, jumlah alat, tanggal pinjam, dan rencana tanggal pengembalian dengan benar.",
  },
  {
    no: "03",
    judul: "Ambil Foto Bukti",
    desc: "Ambil foto wajah kamu dengan jelas sambil memegang alat yang dipinjam, langsung dari kamera (bukan galeri).",
  },
  {
    no: "04",
    judul: "Kirim & Tunggu Verifikasi",
    desc: "Setelah dikirim, admin lab akan memverifikasi pengajuan kamu. Status bisa dipantau di halaman Riwayat Peminjaman.",
  },
  {
    no: "05",
    judul: "Kembalikan Tepat Waktu",
    desc: "Kembalikan alat sebelum atau tepat pada tanggal yang sudah dijadwalkan agar tidak tercatat sebagai keterlambatan.",
  },
];

export default function PanduanPage() {
  return (
    <main className="min-h-screen bg-[#05070f] text-white">
      <Navbar />
      <div className="mx-auto flex max-w-7xl">
        <Sidebar />

        <section className="flex-1 min-w-0 px-4 py-8 sm:px-8 sm:py-10">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              PANDUAN <span className="text-emerald-400">PEMINJAMAN</span>
            </h1>
            <p className="mt-1.5 text-sm text-slate-400">
              Ikuti langkah-langkah berikut untuk meminjam alat laboratorium TJKT.
            </p>
          </div>

          <div className="max-w-2xl space-y-4">
            {LANGKAH.map((l) => (
              <div
                key={l.no}
                className="flex gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6"
              >
                <span className="shrink-0 text-2xl font-bold text-emerald-400/40">{l.no}</span>
                <div>
                  <h2 className="text-base font-semibold">{l.judul}</h2>
                  <p className="mt-1.5 text-sm text-slate-400">{l.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}