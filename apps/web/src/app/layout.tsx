import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'سیستم مدیریت خودرو | تعمیرگاه',
  description: 'مدیریت و معرفی هوشمند خودروهای مشتریان',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
