'use client';

import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/login');
  };

  const handleCardClick = (path: string) => {
    router.push(path);
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #A8D8EA 0%, #C3B1E1 50%, #98E2C6 100%)'
    }}>
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-screen">
        
        {/* Welcome Title */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg">
            مرحباً بك
          </h1>
          <p className="text-2xl md:text-3xl text-white/90 font-light">
            منصتك الشاملة لإدارة الصور والمحادثات الذكية
          </p>
        </div>

        {/* Start Button */}
        <button
          onClick={handleGetStarted}
          className="mb-16 px-12 py-4 text-xl font-semibold text-white bg-white/20 backdrop-blur-md border-2 border-white/40 rounded-full hover:bg-white/30 hover:scale-105 transform transition-all duration-300 shadow-xl hover:shadow-2xl"
        >
          ابدأ الآن
        </button>

        {/* Three Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
          
          {/* Card 1: File Upload */}
          <div
            onClick={() => handleCardClick('/storage')}
            className="group bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl p-8 text-center cursor-pointer hover:bg-white/30 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
          >
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#A8D8EA] to-[#7DC8E3] rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">رفع الملفات</h3>
            <p className="text-white/80 text-lg">
              قم برفع وتخزين ملفاتك بسهولة وأمان
            </p>
          </div>

          {/* Card 2: Image Management */}
          <div
            onClick={() => handleCardClick('/storage')}
            className="group bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl p-8 text-center cursor-pointer hover:bg-white/30 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
          >
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#C3B1E1] to-[#A78FCC] rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">إدارة الصور</h3>
            <p className="text-white/80 text-lg">
              نظّم وأدر صورك بطريقة احترافية
            </p>
          </div>

          {/* Card 3: Smart Chat */}
          <div
            onClick={() => handleCardClick('/chat')}
            className="group bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl p-8 text-center cursor-pointer hover:bg-white/30 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
          >
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#98E2C6] to-[#7BD5B0] rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">الدخول للمحادثة الذكية</h3>
            <p className="text-white/80 text-lg">
              تواصل مع مساعدك الذكي المدعوم بالذكاء الاصطناعي
            </p>
          </div>

        </div>
      </div>

      {/* Footer Signature */}
      <footer className="absolute bottom-0 w-full py-6 text-center">
        <p className="text-white/90 text-lg font-medium drop-shadow-md">
          Designed &amp; Curated by <span className="font-bold">أبو تيم</span>
        </p>
      </footer>
    </div>
  );
}
