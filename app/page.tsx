import Navbar from "../components/home/Navbar";

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

export default function Home() {
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

        {/* FOOTER */}
        <footer className="px-6 py-6 mt-16">
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