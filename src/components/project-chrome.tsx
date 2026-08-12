import Link from 'next/link';

type ActivePage = 'home' | 'chat' | 'media';

const navItems: Array<{ href: string; label: string; key: ActivePage }> = [
  { href: '/', label: 'الرئيسية', key: 'home' },
  { href: '/chat', label: 'المحادثة', key: 'chat' },
  { href: '/media', label: 'الوسائط', key: 'media' },
];

export function CompactSignature({
  text,
  className = '',
}: {
  text: string;
  className?: string;
}) {
  return (
    <p
      className={`text-[11px] font-medium tracking-[0.28em] text-slate-600/80 ${className}`}
    >
      {text}
    </p>
  );
}

export function TopNavigation({ active }: { active: ActivePage }) {
  return (
    <nav className="flex flex-wrap items-center gap-2 rounded-full border border-white/45 bg-white/35 p-2 shadow-lg shadow-slate-900/5 backdrop-blur">
      {navItems.map((item) => (
        <Link
          key={item.key}
          href={item.href}
          className={`rounded-full px-4 py-2 text-sm font-medium transition duration-200 ${
            item.key === active
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-700 hover:bg-white/70'
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
