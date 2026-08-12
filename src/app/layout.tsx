import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CloudImage - Cloud Storage & Image Management',
  description:
    'Organize, manage, and enhance your images in the cloud with AI-powered assistance',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr">
      <body className="bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}
