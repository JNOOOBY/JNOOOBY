'use client';

import Link from 'next/link';
import NavBar from '@/components/NavBar';
import Signature from '@/components/Signature';

const cards = [
  {
    icon: '📁',
    title: 'رفع الملفات',
    description: 'ارفع ملفاتك وصورك بسهولة ونظّمها في مكان واحد آمن ومرتب.',
    href: '/media',
    accent: 'from-babyblue/70 to-babyblue-light/70',
  },
  {
    icon: '🖼️',
    title: 'إدارة الصور',
    description: 'تصفّح صورك وحسّنها وقارن بين النسخ قبل وبعد التحسين.',
    href: '/media',
    accent: 'from-softpurple/70 to-softpurple-light/70',
  },
  {
    icon: '🤖',
    title: 'الدخول للمحادثة الذكية',
    description: 'تحدّث مع المساعد الذكي، أرسل الصور، واستخدم الأوامر الجاهزة.',
    href: '/chat',
    accent: 'from-mint/70 to-mint-light/70',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen pastel-gradient flex flex-col">
      <Signature className="pt-3" />
      <NavBar />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-14">
        {/* Hero */}
        <section className="text-center max-w-3xl mx-auto fade-in-up">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-800 leading-tight mb-6">
            أهلًا بك في{' '}
            <span className="bg-gradient-to-l from-indigo-600 via-sky-600 to-emerald-600 bg-clip-text text-transparent">
              JNOOOBY
            </span>
          </h1>
          <p className="text-slate-700 text-lg sm:text-xl mb-10">
            منصّتك اللطيفة لإدارة الوسائط، تحسين الصور، والمحادثة الذكية — بتصميم
            عربي حديث وتجربة استخدام سلسة.
          </p>
          <Link
            href="/chat"
            className="inline-block bg-slate-800 text-white text-lg font-bold px-10 py-4 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-slate-700"
          >
            ابدأ الآن ✨
          </Link>
        </section>

        {/* Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full mt-16">
          {cards.map((card, i) => (
            <Link
              key={card.title}
              href={card.href}
              className="glass-card rounded-3xl p-8 text-center shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-2 fade-in-up"
              style={{ animationDelay: `${0.15 * (i + 1)}s` }}
            >
              <div
                className={`w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br ${card.accent} flex items-center justify-center text-3xl shadow-sm transition-transform duration-300 group-hover:scale-110`}
              >
                {card.icon}
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">
                {card.title}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {card.description}
              </p>
            </Link>
          ))}
        </section>
      </main>

      <footer className="pb-4">
        <Signature text="Designed & Curated by أبو تيم" />
      </footer>
    </div>
  );
}
