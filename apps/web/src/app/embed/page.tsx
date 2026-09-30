'use client';

/**
 * Embeddable widget page
 * ----------------------
 * The repair shop can embed this page inside their existing website via iframe:
 *
 * <iframe
 *   src="https://your-domain.com/embed"
 *   width="100%"
 *   height="700"
 *   style="border: none; border-radius: 16px;"
 *   title="خودروهای موجود"
 * ></iframe>
 *
 * Or link directly to /cars for a full-page experience.
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function EmbedPage() {
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/cars`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setCars((d.data || []).slice(0, 8));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-slate-50 min-h-[600px] p-4 font-sans" dir="rtl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-slate-800 text-lg">خودروهای موجود</h2>
        <a
          href="/cars"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 font-medium"
        >
          مشاهده همه
        </a>
      </div>

      {loading ? (
        <div className="text-center text-slate-400 py-16 text-sm">در حال بارگذاری...</div>
      ) : cars.length === 0 ? (
        <div className="text-center text-slate-400 py-16 text-sm">فعلاً خودرویی ثبت نشده است</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {cars.map((car) => (
            <a
              key={car.id}
              href={`/cars/${car.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white rounded-xl p-3 shadow-sm border border-slate-100 hover:border-blue-200 transition"
            >
              <div className="flex justify-between items-start gap-2">
                <div className="min-w-0">
                  <p className="font-bold text-slate-800 text-sm truncate">
                    {car.brand} {car.model}
                  </p>
                  <p className="text-xs text-slate-500">{car.year} • {car.color}</p>
                </div>
                <span className="text-xs font-semibold text-blue-600 whitespace-nowrap">
                  {Number(car.priceAmount).toLocaleString('fa-IR')}
                </span>
              </div>
            </a>
          ))}
        </div>
      )}

      <p className="text-[10px] text-slate-400 text-center mt-6">
        قدرت‌گرفته از سامانه مدیریت خودرو تعمیرگاه
      </p>
    </div>
  );
}
