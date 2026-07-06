"use client";

import { useState } from "react";

import Navbar from "@/components/home/Navbar";

import Sidebar from "@/components/dashboard/Sidebar";



/* ------------------------------- Icon set -------------------------------- */



function IconCheck(props: React.SVGProps<SVGSVGElement>) {

  return (

    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>

      <circle cx="12" cy="12" r="9" />

      <path d="m8.5 12.5 2.3 2.3 4.7-5" strokeLinecap="round" strokeLinejoin="round" />

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

function IconAlert(props: React.SVGProps<SVGSVGElement>) {

  return (

    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>

      <path d="M12 3 2 20h20L12 3Z" strokeLinecap="round" strokeLinejoin="round" />

      <path d="M12 10v4" strokeLinecap="round" />

      <path d="M12 17h.01" strokeLinecap="round" />

    </svg>

  );

}



/* ------------------------------ Dummy data -------------------------------- */

// TODO: ganti dengan data asli dari Supabase (tabel notifikasi milik user login).



type NotifType = "sukses" | "info" | "peringatan";



interface Notif {

  id: string;

  type: NotifType;

  title: string;

  message: string;

  time: string;

  unread: boolean;

}



const NOTIF_ICON: Record<NotifType, { icon: React.ReactNode; accent: string }> = {

  sukses: { icon: <IconCheck className="h-5 w-5" />, accent: "bg-emerald-500/15 text-emerald-400" },

  info: { icon: <IconClock className="h-5 w-5" />, accent: "bg-sky-500/15 text-sky-400" },

  peringatan: { icon: <IconAlert className="h-5 w-5" />, accent: "bg-amber-500/15 text-amber-400" },

};



const INITIAL_NOTIF: Notif[] = [

  {

    id: "1",

    type: "sukses",

    title: "Peminjaman Disetujui",

    message: "Pengajuan peminjaman Switch TP-Link 8 Port kamu sudah disetujui admin.",

    time: "2 jam yang lalu",

    unread: true,

  },

  {

    id: "2",

    type: "peringatan",

    title: "Pengembalian Terlambat",

    message: "Kabel LAN Cat6 yang kamu pinjam sudah melewati batas waktu pengembalian. Segera kembalikan ke lab.",

    time: "1 hari yang lalu",

    unread: true,

  },

  {

    id: "3",

    type: "info",

    title: "Reminder Pengembalian",

    message: "Jangan lupa mengembalikan Tang Crimping besok sesuai jadwal yang kamu ajukan.",

    time: "2 hari yang lalu",

    unread: false,

  },

  {

    id: "4",

    type: "sukses",

    title: "Pengembalian Dikonfirmasi",

    message: "Pengembalian Laptop Praktikum sudah dikonfirmasi oleh admin. Terima kasih!",

    time: "5 hari yang lalu",

    unread: false,

  },

];



export default function NotifikasiPage() {

  const [notifList, setNotifList] = useState(INITIAL_NOTIF);

  const unreadCount = notifList.filter((n) => n.unread).length;



  function tandaiSemuaDibaca() {

    setNotifList((prev) => prev.map((n) => ({ ...n, unread: false })));

  }



  return (

    <main className="min-h-screen bg-[#05070f] text-white">

      <Navbar />

      <div className="mx-auto flex max-w-7xl">

        <Sidebar />



        <section className="flex-1 min-w-0 px-4 py-8 sm:px-8 sm:py-10">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

            <div>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">

                NOTIFIKASI{" "}

                {unreadCount > 0 && (

                  <span className="align-middle ml-1 inline-flex h-6 min-w-[24px] items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-semibold">

                    {unreadCount}

                  </span>

                )}

              </h1>

              <p className="mt-1.5 text-sm text-slate-400">

                Pemberitahuan terkait aktivitas peminjaman alat laboratorium kamu.

              </p>

            </div>

            {unreadCount > 0 && (

              <button

                onClick={tandaiSemuaDibaca}

                className="text-sm text-emerald-400 hover:text-emerald-300 transition whitespace-nowrap"

              >

                Tandai semua dibaca

              </button>

            )}

          </div>



          {notifList.length === 0 ? (

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">

              <p className="text-sm text-slate-400">Belum ada notifikasi.</p>

            </div>

          ) : (

            <div className="space-y-3">

              {notifList.map((n) => {

                const meta = NOTIF_ICON[n.type];

                return (

                  <div

                    key={n.id}

                    className={`flex gap-4 rounded-2xl border p-4 sm:p-5 transition ${

                      n.unread

                        ? "border-emerald-400/20 bg-emerald-500/[0.04]"

                        : "border-white/10 bg-white/[0.03]"

                    }`}

                  >

                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${meta.accent}`}>

                      {meta.icon}

                    </div>

                    <div className="min-w-0 flex-1">

                      <div className="flex items-center gap-2">

                        <p className="text-sm font-semibold">{n.title}</p>

                        {n.unread && <span className="h-2 w-2 rounded-full bg-emerald-400" />}

                      </div>

                      <p className="mt-1 text-sm text-slate-400">{n.message}</p>

                      <p className="mt-2 text-xs text-slate-600">{n.time}</p>

                    </div>

                  </div>

                );

              })}

            </div>

          )}

        </section>

      </div>

    </main>

  );

}