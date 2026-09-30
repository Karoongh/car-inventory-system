'use client';

import { useEffect, useState } from 'react';

interface PricePosition {
  ratio: number;
  label: string;
  colorKey: 'gray' | 'green' | 'yellow' | 'orange' | 'red';
  marketAverage: number;
  carPrice: number;
  sampleCount: number;
}

const COLOR_MAP = {
  gray: { bar: 'bg-slate-400', text: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200' },
  green: { bar: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  yellow: { bar: 'bg-amber-400', text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
  orange: { bar: 'bg-orange-500', text: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200' },
  red: { bar: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' },
};

interface Props {
  carId: string;
}

export default function PricePositionChart({ carId }: Props) {
  const [data, setData] = useState<PricePosition | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/cars/${carId}/price-position`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data) setData(d.data);
      })
      .finally(() => setLoading(false));
  }, [carId]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-4 shadow-sm animate-pulse">
        <div className="h-4 bg-slate-200 rounded w-1/2 mb-3" />
        <div className="h-8 bg-slate-100 rounded-full" />
      </div>
    );
  }

  if (!data) return null;

  const colors = COLOR_MAP[data.colorKey];
  // Convert ratio to 0–100 position on the gauge (clamp for display)
  const percent = Math.min(100, Math.max(0, (data.ratio - 0.7) / 0.6 * 100));

  return (
    <section className={`rounded-2xl p-4 shadow-sm border ${colors.bg} ${colors.border}`}>
      <h3 className="font-semibold text-slate-800 mb-1">موقعیت قیمت نسبت به بازار</h3>
      <p className={`text-sm font-medium mb-4 ${colors.text}`}>{data.label}</p>

      {/* Gauge bar */}
      <div className="relative h-4 rounded-full overflow-hidden bg-gradient-to-l from-slate-300 via-emerald-400 via-40% via-amber-400 via-60% via-orange-400 to-red-500">
        {/* Marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-slate-800 shadow-md transition-all duration-500"
          style={{ right: `calc(${percent}% - 8px)` }}
        />
      </div>

      {/* Scale labels */}
      <div className="flex justify-between text-[10px] text-slate-500 mt-1.5 px-0.5">
        <span>زیر بازار</span>
        <span>میانگین</span>
        <span>بالای بازار</span>
      </div>

      {/* Numbers */}
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="bg-white/70 rounded-xl p-3">
          <p className="text-xs text-slate-500 mb-0.5">قیمت این خودرو</p>
          <p className="font-bold text-slate-800">
            {data.carPrice.toLocaleString('fa-IR')}
          </p>
        </div>
        <div className="bg-white/70 rounded-xl p-3">
          <p className="text-xs text-slate-500 mb-0.5">میانگین بازار</p>
          <p className="font-bold text-slate-800">
            {data.marketAverage.toLocaleString('fa-IR')}
          </p>
        </div>
      </div>

      <p className="text-[11px] text-slate-400 mt-3 text-center">
        بر اساس حدود {data.sampleCount} آگهی مشابه • به‌روزرسانی روزانه
      </p>
    </section>
  );
}
