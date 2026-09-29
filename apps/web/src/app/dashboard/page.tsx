'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const stored = localStorage.getItem('user');
    if (!token || !stored) {
      router.replace('/auth/login');
      return;
    }
    setUser(JSON.parse(stored));
  }, [router]);

  function logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    router.replace('/auth/login');
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-slate-400">در حال بارگذاری...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-bold text-slate-800">پنل مالک</h1>
            <p className="text-xs text-slate-500" dir="ltr">{user.mobile}</p>
          </div>
          <button
            onClick={logout}
            className="text-sm text-red-600 font-medium px-3 py-1.5 rounded-lg active:bg-red-50"
          >
            خروج
          </button>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h2 className="font-semibold text-slate-800 mb-1">خوش آمدید</h2>
          <p className="text-sm text-slate-500">
            از اینجا می‌توانید خودروهای خود را مدیریت کنید.
          </p>
        </div>

        <button
          className="w-full h-14 rounded-2xl bg-blue-600 text-white font-semibold text-base active:scale-[0.98] transition shadow-md shadow-blue-200"
          onClick={() => alert('در تسک ۴ پیاده‌سازی می‌شود')}
        >
          + ثبت خودروی جدید
        </button>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 text-center text-slate-400 text-sm">
          هنوز خودرویی ثبت نشده است
        </div>
      </main>
    </div>
  );
}
