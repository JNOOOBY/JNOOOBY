'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import NavBar from '@/components/NavBar';
import Signature from '@/components/Signature';

type MediaType = 'image' | 'video';

type MediaItem = {
  id: string;
  type: MediaType;
  title: string;
  gradient: string;
  icon: string;
  addedManually?: boolean;
  enhanced?: boolean;
};

type Character = {
  id: string;
  name: string;
  icon: string;
  gradient: string;
  media: MediaItem[];
};

type VideoCard = {
  id: string;
  title: string;
  duration: string;
  gradient: string;
};

type ImageCard = {
  id: string;
  title: string;
  gradient: string;
  beforeAfter?: boolean;
};

const userVideos: VideoCard[] = [
  { id: 'uv1', title: 'رحلة الشاطئ', duration: '0:42', gradient: 'from-babyblue to-sky-300' },
  { id: 'uv2', title: 'لقطات المدينة', duration: '1:15', gradient: 'from-softpurple to-indigo-300' },
  { id: 'uv3', title: 'غروب الصحراء', duration: '0:58', gradient: 'from-amber-200 to-orange-300' },
];

const aiVideos: VideoCard[] = [
  { id: 'av1', title: 'مونتاج ذكي — أفضل اللقطات', duration: '2:04', gradient: 'from-mint to-emerald-300' },
  { id: 'av2', title: 'فيديو متحرّك من الصور', duration: '0:36', gradient: 'from-fuchsia-200 to-purple-300' },
  { id: 'av3', title: 'تلوين تلقائي للفيديو', duration: '1:27', gradient: 'from-cyan-200 to-babyblue' },
];

const userImages: ImageCard[] = [
  { id: 'ui1', title: 'بورتريه صباحي', gradient: 'from-babyblue-light to-babyblue' },
  { id: 'ui2', title: 'قهوة الصباح', gradient: 'from-amber-100 to-amber-300' },
  { id: 'ui3', title: 'سماء غائمة', gradient: 'from-slate-200 to-slate-400' },
  { id: 'ui4', title: 'حديقة المنزل', gradient: 'from-mint-light to-mint' },
];

const aiImages: ImageCard[] = [
  { id: 'ai1', title: 'تحسين بورتريه', gradient: 'from-softpurple-light to-softpurple', beforeAfter: true },
  { id: 'ai2', title: 'إزالة الضوضاء', gradient: 'from-sky-100 to-sky-300', beforeAfter: true },
  { id: 'ai3', title: 'رفع الدقّة 4x', gradient: 'from-emerald-100 to-emerald-300', beforeAfter: true },
  { id: 'ai4', title: 'تلوين صورة قديمة', gradient: 'from-rose-100 to-rose-300', beforeAfter: true },
];

const initialCharacters: Character[] = [
  {
    id: 'c1',
    name: 'ليان',
    icon: '🦊',
    gradient: 'from-babyblue to-softpurple',
    media: [
      { id: 'c1m1', type: 'image', title: 'بورتريه رئيسي', gradient: 'from-babyblue-light to-babyblue', icon: '🖼️' },
      { id: 'c1m2', type: 'image', title: 'لقطة جانبية', gradient: 'from-sky-100 to-sky-300', icon: '🖼️' },
      { id: 'c1m3', type: 'video', title: 'مقطع تعريفي', gradient: 'from-indigo-100 to-indigo-300', icon: '🎬' },
      { id: 'c1m4', type: 'image', title: 'إضافة يدوية — ستايل جديد', gradient: 'from-purple-100 to-purple-300', icon: '🖼️', addedManually: true },
    ],
  },
  {
    id: 'c2',
    name: 'سراج',
    icon: '🐺',
    gradient: 'from-softpurple to-mint',
    media: [
      { id: 'c2m1', type: 'image', title: 'اللوك الرسمي', gradient: 'from-softpurple-light to-softpurple', icon: '🖼️' },
      { id: 'c2m2', type: 'video', title: 'مشهد الحركة', gradient: 'from-violet-100 to-violet-300', icon: '🎬' },
      { id: 'c2m3', type: 'video', title: 'خلف الكواليس', gradient: 'from-slate-100 to-slate-300', icon: '🎬' },
    ],
  },
  {
    id: 'c3',
    name: 'ندى',
    icon: '🐰',
    gradient: 'from-mint to-babyblue',
    media: [
      { id: 'c3m1', type: 'image', title: 'ابتسامة النعناع', gradient: 'from-mint-light to-mint', icon: '🖼️' },
      { id: 'c3m2', type: 'image', title: 'جلسة الربيع', gradient: 'from-emerald-100 to-emerald-300', icon: '🖼️' },
      { id: 'c3m3', type: 'image', title: 'إضافة يدوية — رسم رقمي', gradient: 'from-teal-100 to-teal-300', icon: '🖼️', addedManually: true },
      { id: 'c3m4', type: 'video', title: 'فلوق قصير', gradient: 'from-cyan-100 to-cyan-300', icon: '🎬' },
      { id: 'c3m5', type: 'video', title: 'مقطع راقص', gradient: 'from-lime-100 to-lime-300', icon: '🎬' },
    ],
  },
];

const sectionTitle = (icon: string, title: string) => (
  <h2 className="text-2xl font-extrabold text-slate-800 mb-1 flex items-center gap-2">
    <span>{icon}</span>
    {title}
  </h2>
);

export default function MediaPage() {
  const [characters, setCharacters] = useState<Character[]>(initialCharacters);
  const [openCharacterId, setOpenCharacterId] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<'all' | MediaType>('all');
  const [sortBy, setSortBy] = useState<'default' | 'type'>('default');
  const mediaIdCounterRef = useRef(0);

  const openCharacter = characters.find((c) => c.id === openCharacterId) ?? null;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenCharacterId(null);
    };
    if (openCharacterId) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [openCharacterId]);

  const visibleMedia = useMemo(() => {
    if (!openCharacter) return [];
    let items = openCharacter.media;
    if (typeFilter !== 'all') {
      items = items.filter((m) => m.type === typeFilter);
    }
    if (sortBy === 'type') {
      items = [...items].sort((a, b) => a.type.localeCompare(b.type));
    }
    return items;
  }, [openCharacter, typeFilter, sortBy]);

  const addMedia = (characterId: string) => {
    mediaIdCounterRef.current += 1;
    const counter = mediaIdCounterRef.current;
    const isVideo = counter % 2 === 0;
    const newItem: MediaItem = {
      id: `new-${counter}`,
      type: isVideo ? 'video' : 'image',
      title: `وسائط جديدة ${counter}`,
      gradient: isVideo ? 'from-indigo-100 to-indigo-300' : 'from-pink-100 to-pink-300',
      icon: isVideo ? '🎬' : '🖼️',
      addedManually: true,
    };
    setCharacters((prev) =>
      prev.map((c) =>
        c.id === characterId ? { ...c, media: [...c.media, newItem] } : c
      )
    );
  };

  const enhanceMedia = (characterId: string, mediaId: string) => {
    setCharacters((prev) =>
      prev.map((c) =>
        c.id === characterId
          ? {
              ...c,
              media: c.media.map((m) =>
                m.id === mediaId ? { ...m, enhanced: !m.enhanced } : m
              ),
            }
          : c
      )
    );
  };

  const openPanel = (characterId: string) => {
    setOpenCharacterId(characterId);
    setTypeFilter('all');
    setSortBy('default');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-babyblue-light via-softpurple-light to-mint-light flex flex-col">
      <Signature className="pt-3" />
      <NavBar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10 space-y-14">
        {/* Videos */}
        <section className="fade-in-up">
          {sectionTitle('🎥', 'الفيديو')}
          <p className="text-sm text-slate-600 mb-6">
            فيديوهاتك وفيديوهات الذكاء الاصطناعي في مكان واحد.
          </p>

          <h3 className="font-bold text-slate-700 mb-3">فيديوهات المستخدم</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {userVideos.map((video) => (
              <div
                key={video.id}
                className="glass-card rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div
                  className={`h-36 bg-gradient-to-br ${video.gradient} flex items-center justify-center`}
                >
                  <span className="w-12 h-12 rounded-full bg-white/70 flex items-center justify-center text-xl shadow">
                    ▶️
                  </span>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <h4 className="font-bold text-slate-800 text-sm">{video.title}</h4>
                  <span className="text-xs text-slate-500 bg-white/70 px-2 py-1 rounded-full">
                    {video.duration}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <h3 className="font-bold text-slate-700 mb-3">فيديوهات الذكاء الاصطناعي</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {aiVideos.map((video) => (
              <div
                key={video.id}
                className="glass-card rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div
                  className={`h-36 bg-gradient-to-br ${video.gradient} flex items-center justify-center relative`}
                >
                  <span className="absolute top-2 start-2 text-[10px] font-bold bg-white/80 text-indigo-700 px-2 py-0.5 rounded-full">
                    🤖 AI
                  </span>
                  <span className="w-12 h-12 rounded-full bg-white/70 flex items-center justify-center text-xl shadow">
                    ▶️
                  </span>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <h4 className="font-bold text-slate-800 text-sm">{video.title}</h4>
                  <span className="text-xs text-slate-500 bg-white/70 px-2 py-1 rounded-full">
                    {video.duration}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Images */}
        <section className="fade-in-up">
          {sectionTitle('📸', 'الصور')}
          <p className="text-sm text-slate-600 mb-6">
            صور المستخدم وصور الذكاء الاصطناعي مع عرض قبل/بعد.
          </p>

          <h3 className="font-bold text-slate-700 mb-3">صور المستخدم</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {userImages.map((image) => (
              <div
                key={image.id}
                className="glass-card rounded-2xl overflow-hidden shadow-md group"
              >
                <div
                  className={`h-32 bg-gradient-to-br ${image.gradient} flex items-center justify-center text-3xl transition-transform duration-500 group-hover:scale-110`}
                >
                  🖼️
                </div>
                <div className="p-3">
                  <h4 className="font-bold text-slate-800 text-xs sm:text-sm">
                    {image.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>

          <h3 className="font-bold text-slate-700 mb-3">
            صور الذكاء الاصطناعي — قبل / بعد
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {aiImages.map((image) => (
              <div
                key={image.id}
                className="glass-card rounded-2xl overflow-hidden shadow-md group"
              >
                <div className="h-32 flex">
                  <div
                    className={`w-1/2 bg-gradient-to-br ${image.gradient} opacity-50 saturate-50 flex flex-col items-center justify-center transition-transform duration-500 group-hover:scale-110`}
                  >
                    <span className="text-2xl">🖼️</span>
                    <span className="text-[10px] font-bold text-slate-700 bg-white/70 px-2 py-0.5 rounded-full mt-1">
                      قبل
                    </span>
                  </div>
                  <div
                    className={`w-1/2 bg-gradient-to-br ${image.gradient} flex flex-col items-center justify-center transition-transform duration-500 group-hover:scale-110`}
                  >
                    <span className="text-2xl">✨</span>
                    <span className="text-[10px] font-bold text-indigo-700 bg-white/80 px-2 py-0.5 rounded-full mt-1">
                      بعد
                    </span>
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="font-bold text-slate-800 text-xs sm:text-sm">
                    {image.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Characters */}
        <section className="fade-in-up">
          {sectionTitle('🧸', 'الشخصيات')}
          <p className="text-sm text-slate-600 mb-6">
            بطاقات تجمع صور كل شخصية وفيديوهاتها والمحتوى المضاف يدويًا.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {characters.map((character) => (
              <div
                key={character.id}
                className="glass-card rounded-3xl p-6 text-center shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div
                  className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${character.gradient} flex items-center justify-center text-4xl shadow-inner mb-4`}
                >
                  {character.icon}
                </div>
                <h3 className="text-lg font-extrabold text-slate-800 mb-1">
                  {character.name}
                </h3>
                <p className="text-xs text-slate-500 mb-5">
                  {character.media.length} وسائط
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <button
                    onClick={() => openPanel(character.id)}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold px-4 py-2 rounded-full transition-colors"
                  >
                    عرض الكل
                  </button>
                  <button
                    onClick={() => addMedia(character.id)}
                    className="flex-1 bg-white/70 hover:bg-white text-slate-700 text-sm font-bold px-4 py-2 rounded-full transition-colors border border-white"
                  >
                    + إضافة وسائط جديدة
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Character detail panel */}
      {openCharacter && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6"
          onClick={() => setOpenCharacterId(null)}
        >
          <div
            className="bg-white/90 backdrop-blur-xl w-full max-w-3xl max-h-[88vh] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col fade-in-up"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={`لوحة الشخصية ${openCharacter.name}`}
          >
            {/* Panel header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-br ${openCharacter.gradient} flex items-center justify-center text-2xl`}
                >
                  {openCharacter.icon}
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800">
                    {openCharacter.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {openCharacter.media.length} وسائط
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpenCharacterId(null)}
                aria-label="إغلاق"
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Filters & sort */}
            <div className="px-5 py-3 border-b border-slate-100 flex flex-wrap items-center gap-2">
              {(
                [
                  { value: 'all', label: 'الكل' },
                  { value: 'image', label: '🖼️ صور' },
                  { value: 'video', label: '🎬 فيديو' },
                ] as const
              ).map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTypeFilter(option.value)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${
                    typeFilter === option.value
                      ? 'bg-slate-800 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {option.label}
                </button>
              ))}
              <span className="ms-auto text-xs text-slate-500">ترتيب:</span>
              <button
                onClick={() =>
                  setSortBy((s) => (s === 'type' ? 'default' : 'type'))
                }
                className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${
                  sortBy === 'type'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                حسب النوع
              </button>
            </div>

            {/* Panel media grid */}
            <div className="flex-1 overflow-y-auto soft-scroll p-5">
              {visibleMedia.length === 0 ? (
                <p className="text-center text-sm text-slate-500 py-10">
                  لا توجد وسائط مطابقة للفلتر الحالي.
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {visibleMedia.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm group"
                    >
                      <div
                        className={`h-28 bg-gradient-to-br ${item.gradient} flex items-center justify-center text-3xl relative transition-all duration-500 group-hover:scale-105 ${
                          item.enhanced ? 'enhanced-img' : ''
                        }`}
                      >
                        {item.icon}
                        {item.addedManually && (
                          <span className="absolute top-2 start-2 text-[9px] font-bold bg-white/85 text-amber-700 px-2 py-0.5 rounded-full">
                            يدوي
                          </span>
                        )}
                        {item.enhanced && (
                          <span className="absolute bottom-2 end-2 text-[9px] font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                            محسّنة ✓
                          </span>
                        )}
                      </div>
                      <div className="p-3 space-y-2">
                        <h4 className="text-xs font-bold text-slate-800 truncate">
                          {item.title}
                        </h4>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] text-slate-500">
                            {item.type === 'image' ? 'صورة' : 'فيديو'}
                          </span>
                          <button
                            onClick={() =>
                              enhanceMedia(openCharacter.id, item.id)
                            }
                            className="text-[10px] font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full transition-colors"
                          >
                            {item.enhanced ? 'تراجع' : '✨ تحسين'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100">
              <button
                onClick={() => addMedia(openCharacter.id)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold py-2.5 rounded-full transition-colors"
              >
                + إضافة وسائط جديدة
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="pb-4">
        <Signature text="أبو تيم © 2026" />
      </footer>
    </div>
  );
}
