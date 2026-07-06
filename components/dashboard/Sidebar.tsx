"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

/* ----------------------------- Icon set ----------------------------- */

function IconHome(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M4 11.5 12 4l8 7.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 10v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 20v-5h4v5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconClipboard(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="6" y="4" width="12" height="17" rx="2" />
      <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" strokeLinecap="round" />
      <path d="M9 11h6M9 15h6M9 19h3" strokeLinecap="round" />
    </svg>
  );
}
function IconRotate(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M4 4v5h5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 20v-5h-5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 15a8 8 0 0 0 14.3 3M19 9A8 8 0 0 0 4.7 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconHistory(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M3 12a9 9 0 1 0 3-6.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 4v5h5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 8v4l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconBell(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.7 21a2 2 0 0 1-3.4 0" strokeLinecap="round" />
    </svg>
  );
}
function IconBook(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconPhone(props: React.SVGProps<SVGSVGElement>) {
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
function IconInfo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" strokeLinecap="round" />
      <path d="M12 8h.01" strokeLinecap="round" />
    </svg>
  );
}
function IconHeadset(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M4 13v-1a8 8 0 0 1 16 0v1" strokeLinecap="round" />
      <rect x="3" y="13" width="4" height="6" rx="1.2" />
      <rect x="17" y="13" width="4" height="6" rx="1.2" />
      <path d="M19 19v1a2 2 0 0 1-2 2h-3" strokeLinecap="round" />
    </svg>
  );
}

/* ------------------------------ Menu data ------------------------------ */

type MenuItem = {
  href: string;
  label: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactElement;
  badge?: number;
};

const MENU_ITEMS: MenuItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: IconHome },
  { href: "/peminjaman", label: "Ajukan Peminjaman", icon: IconClipboard },
  { href: "/pengembalian", label: "Ajukan Pengembalian", icon: IconRotate },
  { href: "/riwayat-peminjaman", label: "Riwayat Peminjaman", icon: IconHistory },
  { href: "/notifikasi", label: "Notifikasi", icon: IconBell, badge: 2 },
];

const LAINNYA_ITEMS: MenuItem[] = [
  { href: "/panduan", label: "Panduan", icon: IconBook },
  { href: "/kontak", label: "Kontak", icon: IconPhone },
  { href: "/tentang-lab", label: "Tentang Lab", icon: IconInfo },
];

/* ------------------------------- Link item ------------------------------ */

function SidebarLink({ href, label, icon: Icon, active, badge }: MenuItem & { active: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm transition ${
        active
          ? "bg-emerald-500/12 text-emerald-400 font-medium"
          : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
      }`}
    >
      <span className={`flex h-5 w-5 items-center justify-center ${active ? "text-emerald-400" : "text-slate-500"}`}>
        <Icon className="h-full w-full" />
      </span>
      <span className="flex-1">{label}</span>
      {!!badge && (
        <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
          {badge}
        </span>
      )}
    </Link>
  );
}

/* -------------------------------- Sidebar -------------------------------- */

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-[260px] shrink-0 flex-col justify-between border-r border-white/10 bg-[#070a13] px-4 py-6">
      <div>
        <p className="px-3.5 mb-2 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
          Menu
        </p>
        <nav className="space-y-1">
          {MENU_ITEMS.map((item) => (
            <SidebarLink key={item.href} {...item} active={pathname === item.href} />
          ))}
        </nav>

        <p className="px-3.5 mt-7 mb-2 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
          Lainnya
        </p>
        <nav className="space-y-1">
          {LAINNYA_ITEMS.map((item) => (
            <SidebarLink key={item.href} {...item} active={pathname === item.href} />
          ))}
        </nav>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
          <IconHeadset className="h-5 w-5" />
        </div>
        <p className="mt-3 text-sm font-medium text-slate-200">Butuh Bantuan?</p>
        <p className="mt-1 text-xs text-slate-500">
          Jika ada kendala atau pertanyaan, hubungi petugas laboratorium.
        </p>
        <Link
          href="/kontak"
          className="mt-3 block w-full rounded-lg bg-emerald-500 hover:bg-emerald-600 transition py-2 text-xs font-semibold"
        >
          Hubungi Kami
        </Link>
      </div>
    </aside>
  );
}