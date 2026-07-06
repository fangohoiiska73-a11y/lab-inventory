import Navbar from "../components/home/Navbar";
import { initialAlat } from "@/lib/data";

const FEATURES = [
  {
    title: "Digital & Terintegrasi",
    desc: "Kelola peminjaman alat secara digital dan terpusat.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="w-7 h-7"
      >
        <rect x="3" y="4" width="18" height="12" rx="1.5" />
        <path
          d="M2 20h20M9 20l1-4h4l1 4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Cepat & Efisien",
    desc: "Proses peminjaman lebih cepat dan mudah digunakan.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="w-7 h-7"
      >
        <circle cx="12" cy="12" r="9" />
        <path
          d="M12 7v5l3 3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Aman & Terpercaya",
    desc: "Data tersimpan aman dengan sistem yang terpercaya.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="w-7 h-7"
      >
        <path
          d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z"
          strokeLinejoin="round"
        />
        <path
          d="m9 12 2 2 4-4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Laporan Real-time",
    desc: "Pantau data peminjaman secara real-time.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="w-7 h-7"
      >
        <path
          d="M4 20V10M12 20V4M20 20v-7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

const SOCIALS = [
  {
    label: "Facebook",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M13.5 22v-8h2.7l.4-3.1h-3.1V9c0-.9.25-1.5 1.55-1.5H16.7V4.7C16.4 4.66 15.4 4.58 14.3 4.58c-2.3 0-3.9 1.4-3.9 4V11H7.7v3.1h2.7V22h3.1Z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="w-4 h-4"
      >
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M23 12s0-3.6-.46-5.2a2.9 2.9 0 0 0-2-2C18.9 4.3 12 4.3 12 4.3s-6.9 0-8.54.5a2.9 2.9 0 0 0-2 2C1 8.4 1 12 1 12s0 3.6.46 5.2a2.9 2.9 0 0 0 2 2c1.64.5 8.54.5 8.54.5s6.9 0 8.54-.5a2.9 2.9 0 0 0 2-2C23 15.6 23 12 23 12Z" />
        <path d="M9.8 15.5V8.5l6 3.5-6 3.5Z" fill="#05070f" />
      </svg>
    ),
  },
];

/* --------------------------- Cara Meminjam data --------------------------- */

const LANGKAH_MEMINJAM = [
  {
    no: "01",
    judul: "Pilih Alat yang Dibutuhkan",
    desc: "Buka halaman Ajukan Peminjaman, lalu pilih alat laboratorium yang ingin dipinjam dari daftar yang tersedia.",
  },
  {
    no: "02",
    judul: "Isi Data Diri & Detail Peminjaman",
    desc: "Lengkapi nama, no induk, kelas, jumlah alat, tanggal pinjam, dan rencana tanggal pengembalian.",
  },
  {
    no: "03",
    judul: "Ambil Foto Bukti",
    desc: "Ambil foto wajah kamu dengan jelas sambil memegang alat yang dipinjam, langsung dari kamera.",
  },
  {
    no: "04",
    judul: "Kirim & Tunggu Verifikasi",
    desc: "Admin lab akan memverifikasi pengajuan kamu. Status bisa dipantau di halaman Riwayat Peminjaman.",
  },
  {
    no: "05",
    judul: "Kembalikan Tepat Waktu",
    desc: "Kembalikan alat sebelum atau tepat pada tanggal yang sudah dijadwalkan.",
  },
];

/* ------------------------------- Kontak data ------------------------------ */

function IconWhatsapp(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path
        d="M5 4h3.2l1.4 4.5-2.1 1.5a12 12 0 0 0 5.5 5.5l1.5-2.1L19 15v3.2a1.8 1.8 0 0 1-2 1.8A15.8 15.8 0 0 1 3.2 6a1.8 1.8 0 0 1 1.8-2Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconMail(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconMapPin(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M12 21s7-6.5 7-11.5A7 7 0 0 0 5 9.5C5 14.5 12 21 12 21Z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="9.5" r="2.3" />
    </svg>
  );
}
function IconClock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconBox(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="m3.5 8 8.5-4 8.5 4-8.5 4-8.5-4Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.5 8v8l8.5 4 8.5-4V8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 12v8" strokeLinecap="round" />
    </svg>
  );
}

const KONTAK = [
  {
    icon: IconWhatsapp,
    label: "WhatsApp Petugas Lab",
    value: "0812-3456-7890",
    href: "https://wa.me/6281234567890",
  },
  {
    icon: IconMail,
    label: "Email",
    value: "lab.tjkt@smksiwalima.sch.id",
    href: "mailto:lab.tjkt@smksiwalima.sch.id",
  },
  {
    icon: IconMapPin,
    label: "Lokasi",
    value: "Lab TJKT, Gedung B Lt. 2, SMK Siwa Lima St. Joseph Langgur",
    href: undefined,
  },
  {
    icon: IconClock,
    label: "Jam Operasional",
    value: "Senin – Jumat, 07.00 – 15.00 WIT",
    href: undefined,
  },
];

const FASILITAS = [
  "Perangkat jaringan (router, switch, access point) untuk praktik konfigurasi",
  "Peralatan instalasi kabel (crimping tool, LAN tester, kabel Cat5e/Cat6)",
  "Laptop & PC praktikum untuk simulasi dan konfigurasi jaringan",
  "Ruang praktik ber-AC dengan kapasitas hingga 36 siswa",
];

export default function Home() {
  const totalAlat = initialAlat.length;
  const totalStok = initialAlat.reduce((sum, a) => sum + a.tersedia, 0);

  return (
    <main className="bg-[#05070f] text-white min-h-screen overflow-x-hidden">
      {/* NAVBAR */}
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative px-6 pt-20 pb-24 md:pt-28 md:pb-32">
        {/* BACKGROUND */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-emerald-500/10 blur-[180px] rounded-full" />
          <div className="absolute bottom-[-200px] right-[-100px] w-[500px] h-[500px] bg-emerald-400/5 blur-[180px] rounded-full" />

          <div
            className="absolute inset-y-0 right-0 w-full md:w-[60%] bg-cover bg-center opacity-20 md:opacity-35"
            style={{
              backgroundImage: "url('/lab-bg.jpg')",
              maskImage: "linear-gradient(to right, transparent, black 40%)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent, black 40%)",
            }}
          />

          <svg
            className="absolute inset-y-0 left-0 w-[45%] h-full opacity-20 hidden md:block"
            viewBox="0 0 400 800"
            fill="none"
          >
            <g stroke="rgb(52 211 153 / 0.35)" strokeWidth="1.5">
              <path d="M0 100 H120 V220 H260" />
              <path d="M0 300 H80 V420 H220 V520" />
              <path d="M0 550 H150 V650" />
              <path d="M0 700 H100" />
            </g>

            <g fill="rgb(52 211 153 / 0.5)">
              <circle cx="120" cy="100" r="4" />
              <circle cx="260" cy="220" r="4" />
              <circle cx="80" cy="300" r="4" />
              <circle cx="220" cy="420" r="4" />
              <circle cx="150" cy="550" r="4" />
              <circle cx="100" cy="700" r="4" />
            </g>
          </svg>
        </div>

        {/* HERO CONTENT */}
        <div className="relative z-10 max-w-6xl mx-auto grid md:grid-cols-[auto_1fr] items-center gap-10 md:gap-16">
          {/* LOGO */}
          <div className="flex justify-center md:justify-start">
            <img
              src="/logo-tjkt.png"
              alt="Logo SMK Siwa Lima TJKT"
              className="w-44 h-auto md:w-56 object-contain drop-shadow-2xl"
            />
          </div>

          {/* COPY */}
          <div className="text-center md:text-left">
            <p className="text-emerald-400/90 tracking-widest text-sm uppercase font-medium">
              SMK SIWA LIMA ST JOSEPH LANGGUR • TJKT SYSTEM
            </p>

            <h1 className="mt-4 text-4xl md:text-5xl font-bold leading-tight text-white">
              Sistem Peminjaman <br />
              <span className="text-emerald-400">
                Laboratorium TJKT
              </span>
            </h1>

            <p className="mt-6 text-slate-300 text-lg max-w-xl mx-auto md:mx-0 leading-relaxed">
              Sistem digital untuk mengelola peminjaman alat laboratorium
              Teknik Jaringan Komputer dan Telekomunikasi secara modern,
              cepat, dan terintegrasi.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-5">
              <a
                href="/peminjaman"
                className="flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 transition rounded-full font-medium shadow-lg shadow-emerald-500/15"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-5 h-5"
                >
                  <path
                    d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Ajukan Peminjaman
              </a>

              <a
                href="#fitur"
                className="text-white/65 hover:text-white transition font-medium"
              >
               
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM SECTION */}
      <div className="relative bg-[#0b0f1c] border-t border-white/10">
        {/* FEATURES BAR */}
        <div
          id="fitur"
          className="relative z-10 max-w-6xl mx-auto -mt-8 md:-mt-10 rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6 divide-y md:divide-y-0 md:divide-x divide-white/10"
        >
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="flex flex-col gap-3 md:px-6 pt-8 md:pt-0 first:pt-0"
            >
              <span className="text-emerald-400">{f.icon}</span>

              <h3 className="font-semibold text-white text-[15px]">
                {f.title}
              </h3>

              <p className="text-slate-400 text-sm leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>

        {/* ============================ INVENTARIS ============================ */}
        <section id="inventaris" className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-4 scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-emerald-400/90 tracking-widest text-xs uppercase font-semibold">
              Daftar Alat
            </p>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold">
              Inventaris <span className="text-emerald-400">Laboratorium</span>
            </h2>
            <p className="mt-3 text-slate-400">
              Berikut daftar alat laboratorium TJKT yang tersedia untuk dipinjam.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {initialAlat.map((a) => (
              <div
                key={a.id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-emerald-400/30"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
                  <IconBox className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold text-white">{a.nama}</h3>
                <p className="mt-1 text-sm text-slate-400">{a.kategori}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span
                    className={`text-xs font-medium rounded-full px-2.5 py-1 border ${
                      a.tersedia > 0
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-red-500/10 text-red-400 border-red-500/20"
                    }`}
                  >
                    {a.tersedia > 0 ? `Tersedia: ${a.tersedia}` : "Stok Habis"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <a
              href="/peminjaman"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-emerald-500 hover:bg-emerald-600 transition rounded-full font-medium shadow-lg shadow-emerald-500/15"
            >
              Ajukan Peminjaman Alat →
            </a>
          </div>
        </section>

        {/* ========================= CARA MEMINJAM ========================= */}
        <section id="cara-meminjam" className="relative z-10 max-w-4xl mx-auto px-6 pt-24 pb-4 scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-emerald-400/90 tracking-widest text-xs uppercase font-semibold">
              Panduan
            </p>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold">
              Cara <span className="text-emerald-400">Meminjam Alat</span>
            </h2>
            <p className="mt-3 text-slate-400">
              Ikuti 5 langkah mudah berikut untuk meminjam alat laboratorium TJKT.
            </p>
          </div>

          <div className="space-y-4">
            {LANGKAH_MEMINJAM.map((l) => (
              <div
                key={l.no}
                className="flex gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6"
              >
                <span className="shrink-0 text-2xl font-bold text-emerald-400/40">{l.no}</span>
                <div>
                  <h3 className="text-base font-semibold">{l.judul}</h3>
                  <p className="mt-1.5 text-sm text-slate-400">{l.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================== TENTANG LAB =========================== */}
        <section id="tentang-lab" className="relative z-10 max-w-4xl mx-auto px-6 pt-24 pb-4 scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-emerald-400/90 tracking-widest text-xs uppercase font-semibold">
              Profil
            </p>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold">
              Tentang <span className="text-emerald-400">Laboratorium</span>
            </h2>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-7">
            <p className="text-sm text-slate-300 leading-relaxed">
              Laboratorium Teknik Jaringan Komputer dan Telekomunikasi (TJKT) adalah fasilitas praktik siswa
              untuk mendalami instalasi, konfigurasi, dan pemeliharaan jaringan komputer. Sistem peminjaman
              alat ini dibuat agar proses pinjam-kembali alat laboratorium lebih tertib, tercatat, dan mudah
              dipantau baik oleh siswa maupun petugas lab.
            </p>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center">
              <p className="text-2xl font-bold text-emerald-400">{totalAlat}</p>
              <p className="mt-1 text-xs text-slate-400">Jenis Alat Tersedia</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center">
              <p className="text-2xl font-bold text-emerald-400">{totalStok}</p>
              <p className="mt-1 text-xs text-slate-400">Total Unit di Lab</p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-7">
            <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wide mb-4">
              Fasilitas
            </h3>
            <ul className="space-y-3">
              {FASILITAS.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-slate-300">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* =============================== KONTAK =============================== */}
        <section id="kontak" className="relative z-10 max-w-4xl mx-auto px-6 pt-24 pb-24 scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-emerald-400/90 tracking-widest text-xs uppercase font-semibold">
              Hubungi Kami
            </p>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold">
              Ada <span className="text-emerald-400">Pertanyaan?</span>
            </h2>
            <p className="mt-3 text-slate-400">
              Hubungi petugas laboratorium melalui kontak berikut.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {KONTAK.map((k) => {
              const Icon = k.icon;
              const content = (
                <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 h-full transition hover:border-emerald-400/30">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wide text-slate-500">{k.label}</p>
                    <p className="mt-1 text-sm font-medium break-words">{k.value}</p>
                  </div>
                </div>
              );
              return k.href ? (
                <a key={k.label} href={k.href} target="_blank" rel="noopener noreferrer">
                  {content}
                </a>
              ) : (
                <div key={k.label}>{content}</div>
              );
            })}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="px-6 py-6 mt-8">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm text-center md:text-left">
              © 2024 SMK SIWA LIMA – TJKT System. All rights reserved.
            </p>

            <div className="flex items-center gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white transition"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}