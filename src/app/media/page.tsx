'use client';

import { useMemo, useState } from 'react';
import { CompactSignature, TopNavigation } from '@/components/project-chrome';

type MediaType = 'image' | 'video';
type MediaOwner = 'user' | 'ai';

type ShowcaseItem = {
  id: string;
  title: string;
  type: MediaType;
  owner: MediaOwner;
  details: string;
  accent: string;
  before?: string;
  after?: string;
};

type CharacterAsset = {
  id: string;
  title: string;
  type: MediaType;
  addedAt: number;
  details: string;
};

type Character = {
  id: string;
  name: string;
  portrait: string;
  description: string;
  assets: CharacterAsset[];
};

const showcaseItems: ShowcaseItem[] = [
  {
    id: 'uv-1',
    title: 'مقتطف إعلان قصير',
    type: 'video',
    owner: 'user',
    details: 'نسخة 4K · 00:24',
    accent: 'from-sky-300 via-cyan-200 to-emerald-200',
  },
  {
    id: 'uv-2',
    title: 'رحلة نهاية الأسبوع',
    type: 'video',
    owner: 'user',
    details: 'مقاطع منظمة حسب اليوم',
    accent: 'from-fuchsia-300 via-violet-200 to-sky-200',
  },
  {
    id: 'av-1',
    title: 'مشهد مولّد للعرض',
    type: 'video',
    owner: 'ai',
    details: 'إخراج آلي · 00:18',
    accent: 'from-emerald-300 via-teal-200 to-sky-200',
  },
  {
    id: 'av-2',
    title: 'تمهيد بصري للشخصية',
    type: 'video',
    owner: 'ai',
    details: 'إيقاع هادئ وانتقال ناعم',
    accent: 'from-violet-300 via-fuchsia-200 to-rose-200',
  },
  {
    id: 'ui-1',
    title: 'لقطة المنتج الأساسية',
    type: 'image',
    owner: 'user',
    details: 'ألوان طبيعية وتكوين نظيف',
    accent: 'from-slate-100 via-sky-100 to-cyan-100',
  },
  {
    id: 'ui-2',
    title: 'جلسة تصوير شخصية',
    type: 'image',
    owner: 'user',
    details: 'خلفية ناعمة وتباين متوازن',
    accent: 'from-emerald-100 via-teal-100 to-sky-100',
  },
  {
    id: 'ai-1',
    title: 'تحسين تلقائي للبورتريه',
    type: 'image',
    owner: 'ai',
    details: 'نموذج قبل/بعد',
    accent: 'from-violet-100 via-fuchsia-100 to-rose-100',
    before: 'إضاءة هادئة',
    after: 'حدة أوضح ولمعان متزن',
  },
  {
    id: 'ai-2',
    title: 'إعادة توازن للألوان',
    type: 'image',
    owner: 'ai',
    details: 'نموذج قبل/بعد',
    accent: 'from-sky-100 via-cyan-100 to-emerald-100',
    before: 'ألوان باهتة',
    after: 'توهّج بصري مريح',
  },
];

const initialCharacters: Character[] = [
  {
    id: 'char-1',
    name: 'نورا',
    portrait: 'خلفية بنفسجية مع ملامح مرحة',
    description: 'شخصية إبداعية للمحتوى التعريفي والقصص القصيرة.',
    assets: [
      {
        id: 'nora-1',
        title: 'صورة تعريفية',
        type: 'image',
        addedAt: 4,
        details: 'نسخة اجتماعية جاهزة للنشر',
      },
      {
        id: 'nora-2',
        title: 'فيديو تقديمي',
        type: 'video',
        addedAt: 3,
        details: 'مقطع 12 ثانية مع حركة هادئة',
      },
      {
        id: 'nora-3',
        title: 'لقطة بديلة',
        type: 'image',
        addedAt: 2,
        details: 'تعديل تركيز ودفء لوني',
      },
    ],
  },
  {
    id: 'char-2',
    name: 'سلمان',
    portrait: 'تدرج سماوي مع طابع احترافي',
    description: 'شخصية مناسبة للعروض، الشروحات، ومشاهد الفيديو السريعة.',
    assets: [
      {
        id: 'salman-1',
        title: 'صورة غلاف',
        type: 'image',
        addedAt: 5,
        details: 'استخدام أساسي في الواجهة',
      },
      {
        id: 'salman-2',
        title: 'فيديو عرض الخدمة',
        type: 'video',
        addedAt: 1,
        details: 'نسخة مختصرة مع حركة نصية',
      },
    ],
  },
  {
    id: 'char-3',
    name: 'ليان',
    portrait: 'ألوان mint ولمسات ناعمة',
    description: 'شخصية مناسبة للهوية الودية ولتجارب ما قبل/بعد.',
    assets: [
      {
        id: 'layan-1',
        title: 'صورة رئيسية',
        type: 'image',
        addedAt: 6,
        details: 'توازن جيد للبشرة والسطوع',
      },
      {
        id: 'layan-2',
        title: 'حركة افتتاحية',
        type: 'video',
        addedAt: 2,
        details: 'انتقال خفيف وشاشة ختامية',
      },
      {
        id: 'layan-3',
        title: 'محتوى يدوي مضاف',
        type: 'image',
        addedAt: 0,
        details: 'عنصر تم إنشاؤه محليًا للتجربة',
      },
    ],
  },
];

export default function MediaPage() {
  const [characters, setCharacters] = useState(initialCharacters);
  const [activeCharacterId, setActiveCharacterId] = useState(initialCharacters[0].id);
  const [assetFilter, setAssetFilter] = useState<'all' | MediaType>('all');
  const [assetSort, setAssetSort] = useState<'newest' | 'title' | 'type'>('newest');
  const [toolMessage, setToolMessage] = useState('جرّب أدوات التحسين لعرض نتيجة تجريبية فورية.');

  const activeCharacter =
    characters.find((character) => character.id === activeCharacterId) ?? characters[0];

  const visibleAssets = useMemo(() => {
    const filtered = activeCharacter.assets.filter((asset) =>
      assetFilter === 'all' ? true : asset.type === assetFilter
    );

    return [...filtered].sort((first, second) => {
      if (assetSort === 'title') {
        return first.title.localeCompare(second.title, 'ar');
      }

      if (assetSort === 'type') {
        return first.type.localeCompare(second.type);
      }

      return second.addedAt - first.addedAt;
    });
  }, [activeCharacter.assets, assetFilter, assetSort]);

  const addMockAsset = (characterId: string) => {
    const stamp = Date.now();

    setCharacters((current) =>
      current.map((character) =>
        character.id === characterId
          ? {
              ...character,
              assets: [
                {
                  id: `asset-${stamp}`,
                  title: 'وسائط جديدة',
                  type: stamp % 2 === 0 ? 'image' : 'video',
                  addedAt: stamp,
                  details: 'تمت إضافتها محليًا كتجربة مباشرة داخل الواجهة',
                },
                ...character.assets,
              ],
            }
          : character
      )
    );

    setActiveCharacterId(characterId);
    setToolMessage('تمت إضافة وسائط تجريبية جديدة لهذه الشخصية.');
  };

  const runTool = (label: string) => {
    setToolMessage(`تم تشغيل أداة «${label}» بشكل تجريبي على محتوى ${activeCharacter.name}.`);
  };

  const userVideos = showcaseItems.filter(
    (item) => item.owner === 'user' && item.type === 'video'
  );
  const aiVideos = showcaseItems.filter(
    (item) => item.owner === 'ai' && item.type === 'video'
  );
  const userImages = showcaseItems.filter(
    (item) => item.owner === 'user' && item.type === 'image'
  );
  const aiImages = showcaseItems.filter(
    (item) => item.owner === 'ai' && item.type === 'image'
  );

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <CompactSignature text="أبو تيم © 2026" className="mb-4 text-slate-400" />

        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-3 text-sm text-slate-300">مكتبة الوسائط الذكية لمشروع JNOOOBY</p>
            <h1 className="text-3xl font-semibold sm:text-4xl">فيديو، صور، وشخصيات في لوحة واحدة</h1>
          </div>
          <TopNavigation active="media" />
        </header>

        <section className="mb-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/10 backdrop-blur">
            <p className="mb-3 text-xs font-medium text-slate-300">الفيديو</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {[...userVideos, ...aiVideos].map((video) => (
                <div
                  key={video.id}
                  className="group rounded-3xl border border-white/10 bg-slate-900/80 p-4 transition duration-200 hover:-translate-y-1 hover:border-sky-300/40"
                >
                  <div
                    className={`mb-4 flex aspect-video items-end rounded-2xl bg-gradient-to-br ${video.accent} p-4 text-slate-900`}
                  >
                    <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold">
                      {video.owner === 'user' ? 'فيديو المستخدم' : 'فيديو الذكاء الاصطناعي'}
                    </span>
                  </div>
                  <h2 className="mb-1 text-lg font-medium">{video.title}</h2>
                  <p className="text-sm text-slate-300">{video.details}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/10 backdrop-blur">
            <p className="mb-3 text-xs font-medium text-slate-300">الصور</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {[...userImages, ...aiImages].map((image) => (
                <div
                  key={image.id}
                  className="group rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur transition duration-200 hover:scale-[1.01] hover:border-fuchsia-300/40"
                >
                  {image.before && image.after ? (
                    <div className="mb-4 grid gap-3 sm:grid-cols-2">
                      <div
                        className={`rounded-2xl bg-gradient-to-br ${image.accent} p-4 text-sm text-slate-800`}
                      >
                        <span className="mb-2 block text-xs font-semibold">قبل</span>
                        {image.before}
                      </div>
                      <div className="rounded-2xl bg-white/80 p-4 text-sm text-slate-800">
                        <span className="mb-2 block text-xs font-semibold">بعد</span>
                        {image.after}
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`mb-4 flex aspect-[4/3] items-end rounded-2xl bg-gradient-to-br ${image.accent} p-4 text-slate-800`}
                    >
                      <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold">
                        {image.owner === 'user' ? 'صورة المستخدم' : 'صورة الذكاء الاصطناعي'}
                      </span>
                    </div>
                  )}
                  <h2 className="mb-1 text-lg font-medium text-white">{image.title}</h2>
                  <p className="text-sm text-slate-300">{image.details}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-8 rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/10 backdrop-blur">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-medium text-slate-300">الشخصيات</p>
              <h2 className="text-2xl font-semibold">بطاقات تجمع الصور والفيديو والمحتوى اليدوي</h2>
            </div>
            <div className="rounded-full bg-white/10 px-4 py-2 text-sm text-slate-200">
              {characters.length} شخصيات جاهزة للاستخدام
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {characters.map((character) => (
                <article
                  key={character.id}
                  className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 transition duration-200 hover:-translate-y-1 hover:border-emerald-300/35"
                >
                  <div className="mb-4 flex aspect-[4/3] items-end rounded-2xl bg-gradient-to-br from-sky-200 via-violet-200 to-emerald-200 p-4 text-slate-900">
                    <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold">
                      {character.portrait}
                    </span>
                  </div>
                  <div className="mb-4">
                    <h3 className="text-xl font-medium">{character.name}</h3>
                    <p className="mt-2 text-sm text-slate-300">{character.description}</p>
                  </div>
                  <div className="mb-4 rounded-2xl bg-white/5 px-4 py-3 text-sm text-slate-200">
                    عدد الوسائط: <strong>{character.assets.length}</strong>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveCharacterId(character.id)}
                      className="flex-1 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-sky-100"
                    >
                      عرض الكل
                    </button>
                    <button
                      type="button"
                      onClick={() => addMockAsset(character.id)}
                      className="flex-1 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold transition hover:bg-white/20"
                    >
                      إضافة وسائط جديدة
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <aside className="rounded-3xl border border-white/10 bg-white/8 p-5 backdrop-blur">
              <div className="mb-4">
                <p className="text-xs font-medium text-slate-300">لوحة الشخصية</p>
                <h3 className="text-2xl font-semibold">{activeCharacter.name}</h3>
                <p className="mt-2 text-sm text-slate-300">{activeCharacter.description}</p>
              </div>

              <div className="mb-4 grid gap-3 sm:grid-cols-2">
                <select
                  value={assetFilter}
                  onChange={(event) => setAssetFilter(event.target.value as 'all' | MediaType)}
                  className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none"
                >
                  <option value="all">كل الأنواع</option>
                  <option value="image">الصور فقط</option>
                  <option value="video">الفيديو فقط</option>
                </select>
                <select
                  value={assetSort}
                  onChange={(event) =>
                    setAssetSort(event.target.value as 'newest' | 'title' | 'type')
                  }
                  className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm outline-none"
                >
                  <option value="newest">الأحدث</option>
                  <option value="title">الاسم</option>
                  <option value="type">النوع</option>
                </select>
              </div>

              <div className="mb-4 flex flex-wrap gap-2">
                {['تحسين الإضاءة', 'ترتيب العناصر', 'تجهيز للنشر'].map((tool) => (
                  <button
                    key={tool}
                    type="button"
                    onClick={() => runTool(tool)}
                    className="rounded-full border border-sky-300/25 bg-sky-300/10 px-4 py-2 text-sm transition hover:bg-sky-300/20"
                  >
                    {tool}
                  </button>
                ))}
              </div>

              <div className="mb-4 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-100">
                {toolMessage}
              </div>

              <div className="space-y-3">
                {visibleAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="rounded-2xl border border-white/10 bg-slate-900/80 p-4"
                  >
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <h4 className="font-medium">{asset.title}</h4>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300">
                        {asset.type === 'image' ? 'صورة' : 'فيديو'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300">{asset.details}</p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <CompactSignature text="أبو تيم © 2026" className="mt-auto pt-4 text-slate-400" />
      </div>
    </main>
  );
}
