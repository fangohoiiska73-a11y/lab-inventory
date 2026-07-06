import Navbar from "@/components/home/Navbar";
import Sidebar from "@/components/dashboard/Sidebar";

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

export default function KontakPage() {
  return (
    <main className="min-h-screen bg-[#05070f] text-white">
      <Navbar />
      <div className="mx-auto flex max-w-7xl">
        <Sidebar />

        <section className="flex-1 min-w-0 px-4 py-8 sm:px-8 sm:py-10">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              HUBUNGI <span className="text-emerald-400">KAMI</span>
            </h1>
            <p className="mt-1.5 text-sm text-slate-400">
              Ada kendala atau pertanyaan seputar peminjaman alat? Hubungi kami melalui kontak berikut.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
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
      </div>
    </main>
  );
}