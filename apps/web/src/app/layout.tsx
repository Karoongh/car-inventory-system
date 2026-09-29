import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'سیستم مدیریت خودرو | تعمیرگاه',
    template: '%s | سیستم مدیریت خودرو',
  },
  description: 'ثبت، مدیریت و معرفی هوشمند خودروهای مشتریان تعمیرگاه. خرید و فروش خودرو زیر نظر تعمیرگاه معتبر.',
  keywords: ['خرید خودرو', 'فروش خودرو', 'تعمیرگاه', 'خودرو کارکرده', 'قیمت خودرو'],
  authors: [{ name: 'تعمیرگاه' }],
  openGraph: {
    type: 'website',
    locale: 'fa_IR',
    siteName: 'سیستم مدیریت خودرو',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#2563eb',
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
