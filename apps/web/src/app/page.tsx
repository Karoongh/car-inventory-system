import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">سیستم مدیریت خودرو</h1>
        <p className="text-slate-500 text-sm mb-8 max-w-xs">
          ثبت، مدیریت و معرفی هوشمند خودروهای مشتریان تعمیرگاه
        </p>

        <div className="w-full max-w-xs space-y-3">
          <Link
            href="/auth/login"
            className="block w-full h-12 rounded-xl bg-blue-600 text-white font-semibold flex items-center justify-center active:scale-[0.98] transition"
          >
            ورود مالک خودرو
          </Link>
          <Link
            href="/cars"
            className="block w-full h-12 rounded-xl bg-white border border-slate-200 text-slate-700 font-medium flex items-center justify-center active:scale-[0.98] transition"
          >
            مشاهده خودروهای موجود
          </Link>
          <Link
            href="/disclaimer"
            className="block w-full h-10 rounded-xl text-slate-500 text-sm flex items-center justify-center"
          >
            سلب مسئولیت و شرایط استفاده
          </Link>
        </div>
      </div>

      <footer className="py-4 text-center text-xs text-slate-400">
        نسخه فعلی – تسک ۷ تکمیل شد
      </footer>
    </main>
  );
}
