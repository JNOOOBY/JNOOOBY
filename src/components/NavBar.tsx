'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'الرئيسية', icon: '🏠' },
  { href: '/chat', label: 'المحادثة الذكية', icon: '💬' },
  { href: '/media', label: 'الوسائط', icon: '🎞️' },
];

export default function NavBar({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const pathname = usePathname();
  const dark = tone === 'dark';

  return (
    <nav
      className={`sticky top-0 z-40 ${
        dark ? 'glass-card-dark' : 'glass-card'
      } shadow-sm`}
      aria-label="التنقل الرئيسي"
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <Link
          href="/"
          className={`font-extrabold text-lg tracking-wide ${
            dark ? 'text-sky-200' : 'text-indigo-700'
          }`}
        >
          JNOOOBY
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  active
                    ? dark
                      ? 'bg-sky-400/20 text-sky-200'
                      : 'bg-indigo-500/15 text-indigo-700'
                    : dark
                    ? 'text-slate-300 hover:bg-white/10'
                    : 'text-slate-600 hover:bg-white/60'
                }`}
              >
                <span className="hidden sm:inline">{link.icon} </span>
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
