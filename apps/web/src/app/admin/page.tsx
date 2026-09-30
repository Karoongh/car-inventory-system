'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminPage() {
  const router = useRouter();
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const stored = localStorage.getItem('user');
    if (!token || !stored) {
      router.replace('/auth/login');
      return;
    }
    const u = JSON.parse(stored);
    setUser(u);

    // Note: current in-memory auth creates users as Owner.
    // For demo, we still try the admin endpoint; real Admin role will be set later.
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/cars/admin/all`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setCars(d.data || []);
        else setError(d.message || 'دسترسی محدود');
      })
      .catch(() => setError('خطا در دریافت داده'))
      .finally(() => setLoading(false));
  }, [router]);

  async function removeCar(id: string) {
    if (!confirm('حذف این خودرو توسط ادمین؟')) return;
    const token = localStorage.getItem('accessToken');
    await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/cars/admin/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    setCars((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-8">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-slate-800">پنل ادمین</h1>
            <p className="text-xs text-slate-500">{user?.mobile}</p>
          </div>
          <Link href="/dashboard" className="text-sm text-blue-600 font-medium">
            پنل مالک
          </Link>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-5 space-y-3">
        {loading ? (
          <div className="text-center text-slate-400 py-12">در حال بارگذاری...</div>
        ) : error ? (
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 text-sm text-amber-800">
            {error}
            <p className="mt-2 text-xs text-amber-600">
              در نسخه فعلی کاربران به صورت Owner ثبت می‌شوند. برای تست کامل ادمین، نقش Admin باید در دیتابیس تنظیم شود.
            </p>
          </div>
        ) : cars.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center text-slate-400 text-sm shadow-sm">
            هیچ خودروی فعالی وجود ندارد
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-500">{cars.length.toLocaleString('fa-IR')} خودرو فعال</p>
            {cars.map((car) => (
              <div key={car.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-800">{car.brand} {car.model}</h3>
                    <p className="text-xs text-slate-500">{car.trim} – {car.year} – {car.color}</p>
                    <p className="text-sm font-medium text-blue-600 mt-1">
                      {Number(car.priceAmount).toLocaleString('fa-IR')} تومان
                    </p>
                    <p className="text-xs text-slate-400 mt-1" dir="ltr">{car.ownerMobile}</p>
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <Link
                    href={`/cars/${car.id}`}
                    className="flex-1 h-10 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 flex items-center justify-center active:bg-slate-50"
                  >
                    مشاهده
                  </Link>
                  <button
                    onClick={() => removeCar(car.id)}
                    className="h-10 px-4 rounded-xl border border-red-200 text-sm font-medium text-red-600 active:bg-red-50"
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </main>
    </div>
  );
}
