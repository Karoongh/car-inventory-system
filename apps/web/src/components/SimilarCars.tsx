'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Props {
  brand?: string;
  model?: string;
  year?: number;
  maxPrice?: number;
  excludeId?: string;
}

export default function SimilarCars({ brand, model, year, maxPrice, excludeId }: Props) {
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (brand) params.set('brand', brand);
    if (model) params.set('model', model);
    if (year) params.set('year', String(year));
    if (maxPrice) params.set('maxPrice', String(maxPrice));
    if (excludeId) params.set('excludeId', excludeId);
    params.set('limit', '4');

    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/cars/suggestions?${params}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setCars(d.data || []);
      })
      .finally(() => setLoading(false));
  }, [brand, model, year, maxPrice, excludeId]);

  if (loading || cars.length === 0) return null;

  return (
    <section className="space-y-3">
      <h3 className="font-semibold text-slate-800 px-1">خودروهای مشابه پیشنهادی</h3>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x">
        {cars.map((car) => (
          <Link
            key={car.id}
            href={`/cars/${car.id}`}
            className="flex-shrink-0 w-40 bg-white rounded-2xl p-3 shadow-sm border border-slate-100 snap-start active:scale-[0.98] transition"
          >
            <div className="aspect-[4/3] rounded-xl bg-slate-100 mb-2 flex items-center justify-center text-slate-300 text-xs">
              تصویر
            </div>
            <p className="font-bold text-sm text-slate-800 truncate">{car.brand} {car.model}</p>
            <p className="text-xs text-slate-500">{car.year}</p>
            <p className="text-sm font-semibold text-blue-600 mt-1">
              {Number(car.priceAmount).toLocaleString('fa-IR')}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
