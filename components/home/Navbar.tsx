"use client";

import { useState } from "react";

const NAV_LINKS = [
  { label: "Beranda", href: "#" },
  { label: "Inventaris", href: "#inventaris" },
  { label: "Cara Meminjam", href: "#cara-meminjam" },
  { label: "Tentang Lab", href: "#tentang-lab" },
  { label: "Kontak", href: "#kontak" },
];

export default function Navbar() {
  const [active, setActive] = useState("Beranda");

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#05070f]/90 backdrop-blur-md">
      <nav className="mx-auto flex h-24 max-w-7xl items-center justify-between px-6">
        {/* LOGO + BRAND */}
        <div className="flex items-center gap-3">
          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-transparent">
            <img
              src="/logo-tjkt.png"
              alt="Logo TJKT"
              className="h-full w-full scale-[1.12] object-cover"
            />
          </div>

          <div className="leading-tight">
            <p className="text-lg font-bold tracking-wide md:text-xl">
              SMK SIWA LIMA ST JOSEPH LANGGUR
            </p>

            <p className="text-xs font-medium tracking-widest text-emerald-400/90 md:text-sm">
              Teknik Jaringan Komputer & Telekomunikasi
            </p>
          </div>
        </div>

        {/* NAV LINKS */}
        <ul className="hidden items-center gap-10 text-[15px] font-medium text-slate-300 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                onClick={() => setActive(link.label)}
                className={`relative pb-1 transition-colors ${
                  active === link.label
                    ? "text-white"
                    : "hover:text-white"
                }`}
              >
                {link.label}

                {active === link.label && (
                  <span className="absolute -bottom-1 left-0 h-[2px] w-full rounded-full bg-emerald-400/90" />
                )}
              </a>
            </li>
          ))}
        </ul>

        {/* TOMBOL LOGIN */}
        <a
          href="/login"
          aria-label="Masuk ke sistem"
          className="flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 font-medium text-white shadow-lg shadow-emerald-500/15 transition hover:bg-emerald-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-4 w-4"
          >
            <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.4 0-8 2.2-8 5v1a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1c0-2.8-3.6-5-8-5Z" />
          </svg>
        </a>
      </nav>
    </header>
  );
}