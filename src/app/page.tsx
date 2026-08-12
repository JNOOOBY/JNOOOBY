import Link from 'next/link';
import { CompactSignature, TopNavigation } from '@/components/project-chrome';

const featureCards = [
  {
    title: 'رفع الملفات',
    description: 'ابدأ مشروعك سريعًا عبر لوحة وسائط تعرض إضافاتك بشكل منظم وواضح.',
    href: '/media',
  },
  {
    title: 'إدارة الصور',
    description: 'استعرض صور المستخدم والذكاء الاصطناعي مع نموذج قبل/بعد وفلاتر جاهزة.',
    href: '/media',
  },
  {
    title: 'الدخول للمحادثة الذكية',
    description: 'محادثة عملية مع أوامر جاهزة، رفع صور، وردود محلية سريعة.',
    href: '/chat',
  },
];

export default function HomePage() {
  return (
    <main
      className="min-h-screen text-slate-900"
      style={{
        backgroundImage:
          'linear-gradient(135deg, rgba(186,230,253,0.95) 0%, rgba(221,214,254,0.92) 50%, rgba(209,250,229,0.95) 100%)',
      }}
    >
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <CompactSignature text="Designed & Curated by أبو تيم" className="mb-4" />

        <header className="mb-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm text-slate-700">واجهة JNOOOBY العربية داخل التطبيق الحالي</p>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
              تجربة حديثة، متجاوبة، وعملية لإدارة المحادثة والوسائط
            </h1>
          </div>
          <TopNavigation active="home" />
        </header>

        <section className="mb-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="rounded-[32px] border border-white/50 bg-white/45 p-7 shadow-2xl shadow-slate-900/10 backdrop-blur">
            <p className="mb-4 text-sm text-slate-700">
              كل العناصر الأساسية تعمل محليًا: التنقل، الأوامر الجاهزة، رفع الصور تجريبيًا،
              وعرض الشخصيات والوسائط داخل لوحات واضحة وسلسة.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/chat"
                className="rounded-full bg-slate-900 px-6 py-3 text-center text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800"
              >
                ابدأ الآن
              </Link>
              <Link
                href="/media"
                className="rounded-full border border-slate-900/15 bg-white/70 px-6 py-3 text-center text-sm font-semibold text-slate-900 transition duration-200 hover:-translate-y-0.5 hover:bg-white"
              >
                استعراض الوسائط
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[28px] border border-white/55 bg-white/55 p-5 shadow-lg shadow-slate-900/5 backdrop-blur sm:col-span-2">
              <div className="mb-3 flex items-center justify-between">
                <span className="rounded-full bg-white/75 px-3 py-1 text-xs font-semibold text-slate-700">
                  JNOOOBY
                </span>
                <span className="text-xs text-slate-600">RTL • Responsive • Local Demo</span>
              </div>
              <p className="text-sm leading-7 text-slate-700">
                الواجهة مبنية على التقنيات الحالية نفسها، مع تنظيم أوضح وهوية ألطف وانتقالات
                خفيفة تناسب الجوال وسطح المكتب.
              </p>
            </div>
            {featureCards.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="rounded-[28px] border border-white/55 bg-white/55 p-5 shadow-lg shadow-slate-900/5 backdrop-blur transition duration-200 hover:-translate-y-1 hover:bg-white/75"
              >
                <h2 className="mb-3 text-xl font-semibold">{card.title}</h2>
                <p className="text-sm leading-7 text-slate-700">{card.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            'تنقل واضح بين الرئيسية والمحادثة والوسائط.',
            'مكوّنات زجاجية ولمسات لونية لطيفة دون مبالغة.',
            'تجربة مباشرة قابلة للعرض دون الاعتماد على خدمات خارجية.',
          ].map((item) => (
            <div
              key={item}
              className="rounded-3xl border border-white/45 bg-white/35 px-5 py-4 text-sm text-slate-700 shadow-md shadow-slate-900/5 backdrop-blur"
            >
              {item}
            </div>
          ))}
        </section>

        <CompactSignature
          text="Designed & Curated by أبو تيم"
          className="mt-auto pt-8 text-slate-700"
        />
      </div>
    </main>
  );
}
