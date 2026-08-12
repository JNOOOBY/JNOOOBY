'use client';

import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { CompactSignature, TopNavigation } from '@/components/project-chrome';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  images: UploadImage[];
};

type UploadImage = {
  id: string;
  name: string;
  preview: string;
  enhanced: boolean;
};

type QuickCommand = {
  label: string;
  prompt: string;
  mode: 'fill' | 'send';
};

const quickCommands: QuickCommand[] = [
  {
    label: 'ترتيب الملفات',
    prompt: 'اقترح لي طريقة ذكية لترتيب الملفات والصور حسب المشروع والتاريخ.',
    mode: 'fill',
  },
  {
    label: 'تحسين صورة',
    prompt: 'صف لي أفضل خطوات تحسين هذه الصورة مع الحفاظ على مظهر طبيعي.',
    mode: 'fill',
  },
  {
    label: 'ابدأ جلسة سريعة',
    prompt: 'أعطني خطة سريعة من 3 خطوات لبدء العمل على الوسائط اليوم.',
    mode: 'send',
  },
];

const createAssistantReply = (message: string, imageCount: number) => {
  const cleanedMessage = message.trim();

  if (imageCount > 0) {
    return `استلمت ${imageCount} ${
      imageCount === 1 ? 'صورة' : 'صور'
    } داخل المحادثة. أقترح البدء بتحسين الإضاءة، ثم ترتيب النسخ قبل/بعد، وبعدها تجهيز وصف قصير للنشر.`;
  }

  if (cleanedMessage.includes('ترتيب')) {
    return 'أفضل بداية: أنشئ مجلدًا لكل مشروع، ثم قسّم داخله إلى صور أصلية، نسخ محسّنة، وفيديو. بعد ذلك استخدم أسماء موحّدة بالتاريخ والنوع.';
  }

  if (cleanedMessage.includes('تحسين')) {
    return 'ابدأ بتخفيف الضوضاء، ثم زد الوضوح بدرجة خفيفة، وبعدها راقب توازن الألوان حتى تحافظ على مظهر طبيعي وغير مبالغ فيه.';
  }

  return 'تمت قراءة رسالتك. يمكنني اقتراح تنظيم للوسائط، تجهيز خطوات تحسين للصور، أو تلخيص خطة سريعة لمشروعك بشكل مباشر.';
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: 'مرحبًا بك في محادثة JNOOOBY الذكية. اكتب رسالتك، أرفق صورة، أو استخدم أمرًا جاهزًا للبدء بسرعة.',
      images: [],
    },
  ]);
  const [input, setInput] = useState('');
  const [draftImages, setDraftImages] = useState<UploadImage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [showCommands, setShowCommands] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const createdUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    return () => {
      createdUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const sendMessage = async (overrideText?: string) => {
    const userMessage = (overrideText ?? input).trim();
    if ((!userMessage && draftImages.length === 0) || isSending) {
      return;
    }

    setIsSending(true);
    setInput('');
    setShowCommands(false);

    const outgoingImages = draftImages;
    setDraftImages([]);

    const userEntry: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: userMessage || 'تم إرسال صورة جديدة للمراجعة.',
      images: outgoingImages,
    };

    setMessages((current) => [...current, userEntry]);

    await new Promise((resolve) => setTimeout(resolve, 280));

    setMessages((current) => [
      ...current,
      {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: createAssistantReply(userMessage, outgoingImages.length),
        images: [],
      },
    ]);

    setIsSending(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await sendMessage();
  };

  const handleImagesSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    const nextImages = files.map((file, index) => ({
      id: `${file.name}-${index}-${Date.now()}`,
      name: file.name,
      preview: (() => {
        const preview = URL.createObjectURL(file);
        createdUrlsRef.current.push(preview);
        return preview;
      })(),
      enhanced: false,
    }));

    setDraftImages((current) => [...current, ...nextImages]);
    event.target.value = '';
  };

  const toggleEnhancement = (imageId: string) => {
    setDraftImages((current) =>
      current.map((image) =>
        image.id === imageId ? { ...image, enhanced: !image.enhanced } : image
      )
    );

    setMessages((current) =>
      current.map((message) => ({
        ...message,
        images: message.images.map((image) =>
          image.id === imageId ? { ...image, enhanced: !image.enhanced } : image
        ),
      }))
    );
  };

  const helperCards = useMemo(
    () => [
      'ارفع صورة لمعاينتها داخل بطاقات زجاجية.',
      'استخدم الأوامر الجاهزة لتوليد رسائل منطقية بسرعة.',
      'فعّل تحسين الصورة لعرض حالة مرئية مباشرة.',
    ],
    []
  );

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(91,33,182,0.35),_transparent_35%),linear-gradient(180deg,_#071120_0%,_#0f172a_45%,_#111827_100%)] text-slate-50">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <CompactSignature text="Powered by أبو تيم" className="mb-4 text-slate-400" />

        <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-sm text-slate-300">محادثة ذكية بواجهة عربية وتجربة تجريبية كاملة</p>
            <h1 className="text-3xl font-semibold sm:text-4xl">لوحة محادثة عملية لرفع الصور وإدارة الأوامر</h1>
          </div>
          <TopNavigation active="chat" />
        </header>

        <section className="mb-6 grid gap-4 lg:grid-cols-[0.78fr_1.22fr]">
          <div className="rounded-[30px] border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/10 backdrop-blur">
            <p className="mb-4 text-xs font-medium text-slate-300">ماذا يمكن أن تفعل هنا؟</p>
            <div className="space-y-3">
              {helperCards.map((card) => (
                <div
                  key={card}
                  className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-slate-200"
                >
                  {card}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/10 backdrop-blur">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs font-medium text-slate-300">الأوامر الجاهزة</p>
              <button
                type="button"
                onClick={() => setShowCommands((current) => !current)}
                className="rounded-full border border-sky-300/20 bg-sky-300/10 px-4 py-2 text-sm transition hover:bg-sky-300/20"
              >
                {showCommands ? 'إخفاء الأوامر' : 'عرض الأوامر'}
              </button>
            </div>
            {showCommands ? (
              <div className="grid gap-3 md:grid-cols-3">
                {quickCommands.map((command) => (
                  <button
                    key={command.label}
                    type="button"
                    onClick={async () => {
                      if (command.mode === 'fill') {
                        setInput(command.prompt);
                        return;
                      }
                      await sendMessage(command.prompt);
                    }}
                    className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-4 text-right transition hover:border-violet-300/35 hover:bg-slate-900"
                  >
                    <span className="mb-2 block text-sm font-semibold">{command.label}</span>
                    <span className="text-xs leading-6 text-slate-300">{command.prompt}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 px-4 py-5 text-sm text-slate-400">
                افتح الأوامر الجاهزة لإضافة اقتراح سريع إلى الحقل أو إرسال رسالة مباشرة.
              </div>
            )}
          </div>
        </section>

        <section className="flex-1 rounded-[32px] border border-white/10 bg-white/5 p-4 shadow-2xl shadow-black/10 backdrop-blur sm:p-6">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-start sm:justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-3xl rounded-[26px] px-4 py-4 shadow-lg backdrop-blur ${
                    message.role === 'user'
                      ? 'bg-violet-300/20 text-violet-50'
                      : 'bg-sky-300/20 text-sky-50'
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm leading-7">{message.text}</p>
                  {message.images.length > 0 && (
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {message.images.map((image) => (
                        <div
                          key={image.id}
                          className={`rounded-3xl border p-3 backdrop-blur ${
                            image.enhanced
                              ? 'border-emerald-300/40 bg-emerald-300/10'
                              : 'border-white/15 bg-white/10'
                          }`}
                        >
                          <img
                            src={image.preview}
                            alt={image.name}
                            className={`mb-3 h-40 w-full rounded-2xl object-cover transition duration-200 ${
                              image.enhanced ? 'scale-[1.02] saturate-150' : ''
                            }`}
                          />
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-sm font-medium">{image.name}</p>
                              <p className="text-xs text-slate-200/80">
                                {image.enhanced ? 'تم تحسينها تجريبيًا' : 'جاهزة للتحسين'}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => toggleEnhancement(image.id)}
                              className="rounded-full bg-white/15 px-4 py-2 text-xs font-semibold transition hover:bg-white/25"
                            >
                              تحسين الصورة
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </section>

        <section className="mt-6 rounded-[32px] border border-white/10 bg-slate-950/60 p-4 shadow-2xl shadow-black/20 backdrop-blur">
          {draftImages.length > 0 && (
            <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {draftImages.map((image) => (
                <div
                  key={image.id}
                  className={`rounded-3xl border p-3 ${
                    image.enhanced
                      ? 'border-emerald-300/40 bg-emerald-300/10'
                      : 'border-white/10 bg-white/5'
                  }`}
                >
                  <img
                    src={image.preview}
                    alt={image.name}
                    className={`mb-3 h-32 w-full rounded-2xl object-cover ${
                      image.enhanced ? 'saturate-150' : ''
                    }`}
                  />
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-slate-300">{image.name}</span>
                    <button
                      type="button"
                      onClick={() => toggleEnhancement(image.id)}
                      className="rounded-full bg-white/10 px-3 py-2 text-xs font-semibold transition hover:bg-white/20"
                    >
                      تحسين الصورة
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3 lg:flex-row">
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="اكتب رسالتك هنا أو استخدم أمرًا جاهزًا..."
              className="min-h-[52px] flex-1 rounded-full border border-white/10 bg-white/8 px-5 text-sm text-white outline-none placeholder:text-slate-400"
            />
            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={isSending}
                className="rounded-full bg-violet-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:bg-violet-300"
              >
                {isSending ? 'جارٍ الإرسال...' : 'إرسال'}
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-full border border-sky-300/25 bg-sky-300/10 px-5 py-3 text-sm font-semibold transition hover:bg-sky-300/20"
              >
                رفع صورة
              </button>
              <button
                type="button"
                onClick={() => setShowCommands((current) => !current)}
                className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold transition hover:bg-white/10"
              >
                أوامر جاهزة
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImagesSelected}
            />
          </form>
        </section>

        <CompactSignature text="Powered by أبو تيم" className="mt-6 text-slate-400" />
      </div>
    </main>
  );
}
