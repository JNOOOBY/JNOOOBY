'use client';

import { useEffect, useRef, useState, ChangeEvent, FormEvent } from 'react';
import NavBar from '@/components/NavBar';
import Signature from '@/components/Signature';

type ImageAttachment = {
  id: string;
  dataUrl: string;
  name: string;
  status: 'idle' | 'enhancing' | 'enhanced';
};

type ChatMessage = {
  id: string;
  role: 'user' | 'ai';
  text?: string;
  image?: ImageAttachment;
  time: string;
};

const quickCommands = [
  { label: '✨ حسّن جودة صوري', text: 'حسّن جودة صوري الأخيرة وأخبرني بالنتيجة' },
  { label: '🗂️ نظّم وسائطي', text: 'اقترح طريقة لتنظيم صوري وفيديوهاتي حسب الشخصيات' },
  { label: '🎨 اقترح لوحة ألوان', text: 'اقترح لوحة ألوان لطيفة تناسب معرض صوري' },
  { label: '📸 أفكار لصور جديدة', text: 'أعطني أفكارًا إبداعية لجلسة تصوير جديدة' },
];

const nowTime = () =>
  new Date().toLocaleTimeString('ar', { hour: '2-digit', minute: '2-digit' });

const aiReply = (userText: string): string => {
  if (userText.includes('تحسين') || userText.includes('حسّن')) {
    return 'تم تجهيز أدوات التحسين! ✨ اضغط زر «تحسين الصورة» على أي صورة في المحادثة وسترى النتيجة فورًا مع رفع السطوع والتباين والألوان.';
  }
  if (userText.includes('نظّم') || userText.includes('تنظيم')) {
    return 'أنصحك بتقسيم الوسائط إلى ثلاثة أقسام: فيديو، صور، وشخصيات 🗂️ — يمكنك فتح صفحة «الوسائط» من الأعلى لرؤية التنظيم المقترح مع الفلاتر والترتيب حسب النوع.';
  }
  if (userText.includes('ألوان') || userText.includes('لوحة')) {
    return 'جرّب هذه اللوحة اللطيفة: بيبي بلو 💙، بنفسجي ناعم 💜، وأخضر نعناعي 💚 — نفس هوية JNOOOBY! تعطي إحساسًا حديثًا وهادئًا لأي معرض صور.';
  }
  if (userText.includes('أفكار') || userText.includes('تصوير')) {
    return 'إليك ثلاث أفكار سريعة 📸: 1) لقطات قبل/بعد التحسين، 2) بورتريه بإضاءة ناعمة متدرجة، 3) سلسلة صور لشخصياتك المفضلة بخلفيات باستيل موحّدة.';
  }
  return 'وصلتني رسالتك! 🤖 أنا مساعد JNOOOBY التجريبي — اسألني عن تحسين الصور، تنظيم الوسائط، أو استخدم الأوامر الجاهزة من الشريط بالأسفل.';
};

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'ai',
      text: 'أهلًا بك في محادثة JNOOOBY الذكية! 👋 أرسل رسالة أو صورة، أو جرّب الأوامر الجاهزة.',
      time: '',
    },
  ]);
  const [input, setInput] = useState('');
  const [showCommands, setShowCommands] = useState(false);
  const [aiTyping, setAiTyping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const idCounterRef = useRef(0);

  const nextId = () => {
    idCounterRef.current += 1;
    return `msg-${idCounterRef.current}`;
  };

  useEffect(() => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === 'welcome' && !msg.time ? { ...msg, time: nowTime() } : msg
      )
    );
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, aiTyping]);

  useEffect(() => {
    const timers = timersRef.current;
    return () => timers.forEach(clearTimeout);
  }, []);

  const queueAiReply = (text: string) => {
    setAiTyping(true);
    const timer = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: nextId(), role: 'ai', text, time: nowTime() },
      ]);
      setAiTyping(false);
    }, 900);
    timersRef.current.push(timer);
  };

  const sendText = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((prev) => [
      ...prev,
      { id: nextId(), role: 'user', text: trimmed, time: nowTime() },
    ]);
    setInput('');
    queueAiReply(aiReply(trimmed));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendText(input);
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: 'user',
          image: {
            id: nextId(),
            dataUrl: String(reader.result),
            name: file.name,
            status: 'idle',
          },
          time: nowTime(),
        },
      ]);
      queueAiReply(
        'وصلتني الصورة! 🖼️ يمكنك الضغط على «تحسين الصورة» أسفلها لتطبيق تحسين فوري للسطوع والألوان.'
      );
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const enhanceImage = (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId && msg.image
          ? { ...msg, image: { ...msg.image, status: 'enhancing' } }
          : msg
      )
    );
    const timer = setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId && msg.image
            ? { ...msg, image: { ...msg.image, status: 'enhanced' } }
            : msg
        )
      );
    }, 1400);
    timersRef.current.push(timer);
  };

  const applyCommand = (text: string) => {
    setInput(text);
    setShowCommands(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 text-slate-100">
      <Signature tone="dark" className="pt-3" />
      <NavBar tone="dark" />

      {/* Messages */}
      <main className="flex-1 overflow-y-auto soft-scroll">
        <div className="max-w-3xl mx-auto w-full px-4 py-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex fade-in-up ${
                msg.role === 'user' ? 'justify-start' : 'justify-end'
              }`}
            >
              <div
                className={`max-w-[85%] sm:max-w-md rounded-2xl px-4 py-3 backdrop-blur-md border shadow-md ${
                  msg.role === 'user'
                    ? 'bg-purple-400/20 border-purple-300/30 rounded-ss-sm'
                    : 'bg-sky-400/15 border-sky-300/30 rounded-se-sm'
                }`}
              >
                {msg.text && (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {msg.text}
                  </p>
                )}

                {msg.image && (
                  <div className="glass-card-dark rounded-xl p-2.5 space-y-2">
                    <div
                      className={`rounded-lg overflow-hidden ${
                        msg.image.status === 'enhancing' ? 'enhancing' : ''
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={msg.image.dataUrl}
                        alt={msg.image.name}
                        className={`w-full max-h-64 object-cover transition-all duration-700 ${
                          msg.image.status === 'enhanced' ? 'enhanced-img' : ''
                        }`}
                      />
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] text-slate-300 truncate">
                        {msg.image.name}
                      </span>
                      {msg.image.status === 'enhanced' ? (
                        <span className="text-[11px] font-bold text-emerald-300 whitespace-nowrap">
                          تم التحسين ✓
                        </span>
                      ) : (
                        <button
                          onClick={() => enhanceImage(msg.id)}
                          disabled={msg.image.status === 'enhancing'}
                          className="text-[11px] font-bold bg-purple-400/25 hover:bg-purple-400/40 disabled:opacity-60 text-purple-100 px-3 py-1.5 rounded-full transition-colors whitespace-nowrap"
                        >
                          {msg.image.status === 'enhancing'
                            ? 'جارٍ التحسين…'
                            : '✨ تحسين الصورة'}
                        </button>
                      )}
                    </div>
                  </div>
                )}

                <p className="text-[10px] text-slate-400 mt-1.5">{msg.time}</p>
              </div>
            </div>
          ))}

          {aiTyping && (
            <div className="flex justify-end fade-in-up">
              <div className="bg-sky-400/15 border border-sky-300/30 rounded-2xl px-4 py-3 backdrop-blur-md">
                <span className="text-sm text-sky-200 animate-pulse">
                  يكتب…
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Quick commands */}
      {showCommands && (
        <div className="max-w-3xl mx-auto w-full px-4 pb-2 fade-in-up">
          <div className="glass-card-dark rounded-2xl p-3 flex flex-wrap gap-2">
            {quickCommands.map((cmd) => (
              <button
                key={cmd.label}
                onClick={() => applyCommand(cmd.text)}
                className="text-xs bg-white/10 hover:bg-white/20 text-slate-100 px-3 py-2 rounded-full transition-colors"
              >
                {cmd.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input bar */}
      <div className="border-t border-white/10 bg-slate-900/70 backdrop-blur-md">
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-2"
        >
          <button
            type="button"
            onClick={() => setShowCommands((v) => !v)}
            title="أوامر جاهزة"
            aria-label="أوامر جاهزة"
            className={`shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-lg transition-colors ${
              showCommands
                ? 'bg-purple-400/40 text-white'
                : 'bg-white/10 hover:bg-white/20 text-slate-200'
            }`}
          >
            ⚡
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="رفع صورة"
            aria-label="رفع صورة"
            className="shrink-0 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 flex items-center justify-center text-lg transition-colors"
          >
            🖼️
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اكتب رسالتك هنا…"
            className="flex-1 bg-white/10 border border-white/15 text-slate-100 placeholder:text-slate-400 rounded-full px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-400/50 transition-shadow"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="shrink-0 bg-gradient-to-l from-purple-500 to-sky-500 hover:from-purple-400 hover:to-sky-400 disabled:opacity-40 text-white font-bold px-6 py-3 rounded-full text-sm transition-all duration-300 hover:shadow-lg"
          >
            إرسال
          </button>
        </form>
        <Signature text="Powered by أبو تيم" tone="dark" className="pb-3" />
      </div>
    </div>
  );
}
