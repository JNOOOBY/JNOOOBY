import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'JNOOOBY',
  description:
    'واجهة عربية متجاوبة للمحادثة الذكية والوسائط داخل مشروع JNOOOBY',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
