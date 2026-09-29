'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const stored = localStorage.getItem('user');
    if (!token || !stored) {
      router.replace('/auth/login');
      return;
    }
    setUser(JSON.parse(stored));

    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/cars/my`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setCars(d.data || []);
      })
      .finally(() => setLoading(false));
  }, [router]);

  function logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    router.replace('/auth/login');
  }

  async function toggleVisibility(id: string, current: boolean) {
    const token = localStorage.getItem('accessToken');
    await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/cars/${id}/visibility`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isPhoneVisible: !current }),
    });
    setCars((prev) => prev.map((c) => (c.id === id ? { ...c, isPhoneVisible: !current } : c)));
  }

  async function removeCar(id: string) {
    if (!confirm('آیا از حذف این خودرو مطمئن هستید؟')) return;
    const token = localStorage.getItem('accessToken');
    await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/cars/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    setCars((prev) => prev.filter((c) => c.id !== id));
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-slate-400">در حال بارگذاری...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-8">
      <header className="bg-white border-b border-slate-200 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-bold text-slate-800">پنل مالک</h1>
            <p className="text-xs text-slate-500" dir="ltr">{user.mobile}</p>
          </div>
          <button onClick={logout} className="text-sm text-red-600 font-medium px-3 py-1.5 rounded-lg active:bg-red-50">
            خروج
          </button>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-4">
        <Link
          href="/cars/new"
          className="block w-full h-14 rounded-2xl bg-blue-600 text-white font-semibold text-base flex items-center justify-center active:scale-[0.98] transition shadow-md shadow-blue-200"
        >
          + ثبت خودروی جدید
        </Link>

        {loading ? (
          <div className="text-center text-slate-400 py-10">در حال بارگذاری خودروها...</div>
        ) : cars.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 text-center text-slate-400 text-sm">
            هنوز خودرویی ثبت نشده است
          </div>
        ) : (
          cars.map((car) => (
            <div key={car.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-800">{car.brand} {car.model}</h3>
                  <p className="text-sm text-slate-500">{car.trim} – {car.year}</p>
                  <p className="text-sm font-medium text-blue-600 mt-1">
                    {Number(car.priceAmount).toLocaleString('fa-IR')} تومان
                  </p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600">{car.color}</span>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => toggleVisibility(car.id, car.isPhoneVisible)}
                  className="flex-1 h-10 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 active:bg-slate-50"
                >
                  {car.isPhoneVisible ? 'مخفی کردن شماره' : 'نمایش شماره'}
                </button>
                <button
                  onClick={() => removeCar(car.id)}
                  className="h-10 px-4 rounded-xl border border-red-200 text-sm font-medium text-red-600 active:bg-red-50"
                >
                  حذف
                </button>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}
