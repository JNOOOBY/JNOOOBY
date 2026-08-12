import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'JNOOOBY — منصّة الوسائط والمحادثة الذكية',
  description:
    'واجهة JNOOOBY: الصفحة الرئيسية، المحادثة الذكية، وإدارة الوسائط والشخصيات بتصميم عربي حديث',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}
