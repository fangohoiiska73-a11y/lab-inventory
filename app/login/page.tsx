"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../../components/home/Navbar";

export default function LoginPage() {
  const router = useRouter();

  const [masuk, setMasuk] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pesan, setPesan] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMasuk(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const usernameDemo = "admin";
    const passwordDemo = "admin123";

    const adminBenar =
      username.trim() === usernameDemo && password === passwordDemo;

    if (adminBenar) {
      setPesan("Login berhasil. Mengalihkan ke dashboard...");
      setLoading(true);

      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 1200);

      return;
    }

    setPesan("Username atau password salah.");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070f] text-white">
      {/* Background */}
      <div
        className="absolute inset-0 scale-105 bg-cover bg-center blur-[1px]"
        style={{
          backgroundImage: "url('/lab-bg.jpg')",
        }}
      />

      {/* Lapisan gelap */}
      <div className="absolute inset-0 bg-[#05070f]/80" />

      {/* Gradient hijau */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/35 via-[#05070f]/60 to-[#05070f]/95" />

      {/* Glow */}
      <div className="absolute -left-40 top-24 h-[360px] w-[360px] rounded-full bg-emerald-500/10 blur-[150px]" />
      <div className="absolute -right-40 bottom-0 h-[320px] w-[320px] rounded-full bg-emerald-400/5 blur-[150px]" />

      {/* Navbar */}
      <div className="relative z-30">
        <Navbar />
      </div>

      {/* Area Login */}
      <section className="relative z-10 flex min-h-[calc(100vh-92px)] items-center justify-center px-4 py-8 sm:px-6">
        {/* Tombol kembali */}
        <Link
          href="/"
          aria-label="Kembali ke beranda"
          className="absolute right-6 top-5 text-2xl font-semibold text-emerald-400/90 transition hover:text-emerald-300"
        >
          ×
        </Link>

        {/* Card Login */}
        <div
          className={`w-full max-w-[400px] rounded-2xl border border-white/10 bg-[#08111e]/95 p-6 shadow-2xl shadow-black/40 backdrop-blur-md transition-all duration-700 ease-out sm:p-8 ${
            masuk
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          }`}
        >
          {/* Icon user */}
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-emerald-400/40 bg-emerald-500/10 text-emerald-400">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-6 w-6"
            >
              <circle cx="12" cy="8" r="3.5" />
              <path
                d="M4.5 20c.8-4 3.3-6 7.5-6s6.7 2 7.5 6"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Judul */}
          <div className="mt-4 text-center">
            <h1 className="text-[20px] font-bold tracking-tight sm:text-[22px]">
              Login <span className="text-emerald-400">Admin</span>
            </h1>

            <p className="mt-1 text-xs text-slate-400">
              Masuk untuk mengelola sistem peminjaman
            </p>

            <p className="mt-3 rounded-md border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-[11px] text-emerald-300">
              Demo: username <b>admin</b> · password <b>admin123</b>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="mt-6 space-y-3.5">
            {/* Username */}
            <div>
              <label className="mb-1.5 block text-sm text-slate-200">
                Username
              </label>

              <input
                type="text"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="off"
                style={{
                  backgroundColor: "#0b1523",
                  color: "#ffffff",
                }}
                className="w-full rounded-lg border border-white/15 px-3.5 py-3 text-sm outline-none placeholder:text-slate-500 transition focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-sm text-slate-200">
                Password
              </label>

              <div
                style={{ backgroundColor: "#0b1523" }}
                className="flex items-center rounded-lg border border-white/15 px-3.5 transition focus-within:border-emerald-400 focus-within:ring-1 focus-within:ring-emerald-400/30"
              >
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  style={{
                    backgroundColor: "transparent",
                    color: "#ffffff",
                  }}
                  className="w-full py-3 text-sm outline-none placeholder:text-slate-500"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="ml-3 whitespace-nowrap text-xs text-slate-400 transition hover:text-emerald-400"
                >
                  {showPassword ? "Sembunyikan" : "Lihat"}
                </button>
              </div>
            </div>

            {/* Pesan login */}
            {pesan && (
              <p
                className={`text-center text-xs ${
                  pesan.includes("berhasil")
                    ? "text-emerald-400"
                    : "text-red-400"
                }`}
              >
                {pesan}
              </p>
            )}

            {/* Tombol login */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-emerald-500 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/15 transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Memproses..." : "Masuk Admin →"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}