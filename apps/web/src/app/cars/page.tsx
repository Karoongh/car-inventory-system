'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

interface Car {
  id: string;
  brand: string;
  model: string;
  trim: string;
  year: number;
  color: string;
  priceAmount: number;
  priceType: string;
  bodyConditionType: string;
  ownerFullName: string;
  ownerMobile: string | null;
  isPhoneVisible: boolean;
  images: string[];
  hasBodyInsurance: boolean;
  documentStatusType: string;
}

const BODY_LABELS: Record<string, string> = {
  ZERO_KM_DRY: 'صفر خشک',
  NO_PAINT_NO_SCRATCH: 'بی‌رنگ تمیز',
  NO_PAINT_MINOR_SCRATCH: 'بی‌رنگ خط‌دار',
  ONE_PART_PAINTED: '۱ قطعه رنگ',
  TWO_PARTS_PAINTED: '۲ قطعه رنگ',
  THREE_PARTS_PAINTED: '۳ قطعه رنگ',
  FULL_PAINT: 'دور رنگ',
};

const PRICE_TYPE_LABELS: Record<string, string> = {
  CASH_ONLY: 'نقدی',
  EXCHANGEABLE: 'معاوضه',
  INSTALLMENT: 'شرایطی',
};

export default function CarsListPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  // Filters
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [yearFrom, setYearFrom] = useState('');
  const [yearTo, setYearTo] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

  const fetchCars = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (brand) params.set('brand', brand);
      if (model) params.set('model', model);
      if (yearFrom) params.set('yearFrom', yearFrom);
      if (yearTo) params.set('yearTo', yearTo);
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);
      if (search) params.set('search', search);

      const res = await fetch(`${apiBase}/cars?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setCars(data.data || []);
        setTotal(data.total || 0);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [apiBase, brand, model, yearFrom, yearTo, minPrice, maxPrice, search]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  function clearFilters() {
    setBrand('');
    setModel('');
    setYearFrom('');
    setYearTo('');
    setMinPrice('');
    setMaxPrice('');
    setSearch('');
  }

  const hasActiveFilters = brand || model || yearFrom || yearTo || minPrice || maxPrice || search;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sticky Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <Link href="/" className="text-slate-600 text-lg">→</Link>
            <h1 className="font-bold text-slate-800 text-lg">خودروهای موجود</h1>
            <div className="w-6" />
          </div>

          {/* Search */}
          <div className="relative">
            <input
              type="search"
              placeholder="جستجو برند، مدل، تیپ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-11 pr-4 pl-10 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
          </div>

          {/* Filter toggle */}
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex-1 h-10 rounded-xl text-sm font-medium border transition ${
                showFilters || hasActiveFilters
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-white border-slate-200 text-slate-600'
              }`}
            >
              فیلترها {hasActiveFilters ? '•' : ''}
            </button>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="h-10 px-4 rounded-xl text-sm text-red-600 border border-red-100 active:bg-red-50"
              >
                پاک کردن
              </button>
            )}
          </div>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="border-t border-slate-100 bg-slate-50 px-4 py-4 space-y-3 max-w-lg mx-auto">
            <div className="grid grid-cols-2 gap-3">
              <FilterInput label="برند" value={brand} onChange={setBrand} placeholder="پژو، سمند..." />
              <FilterInput label="مدل" value={model} onChange={setModel} placeholder="۲۰۶، دنا..." />
              <FilterInput label="از سال" value={yearFrom} onChange={setYearFrom} type="number" placeholder="۱۳۹۵" />
              <FilterInput label="تا سال" value={yearTo} onChange={setYearTo} type="number" placeholder="۱۴۰۳" />
              <FilterInput label="حداقل قیمت" value={minPrice} onChange={setMinPrice} type="number" placeholder="تومان" />
              <FilterInput label="حداکثر قیمت" value={maxPrice} onChange={setMaxPrice} type="number" placeholder="تومان" />
            </div>
            <button
              onClick={() => { fetchCars(); setShowFilters(false); }}
              className="w-full h-11 rounded-xl bg-blue-600 text-white font-semibold text-sm active:scale-[0.98]"
            >
              اعمال فیلتر
            </button>
          </div>
        )}
      </header>

      {/* Results count */}
      <div className="max-w-lg mx-auto px-4 py-3 text-sm text-slate-500">
        {loading ? 'در حال جستجو...' : `${total.toLocaleString('fa-IR')} خودرو یافت شد`}
      </div>

      {/* Car List */}
      <main className="max-w-lg mx-auto px-4 pb-8 space-y-3">
        {loading ? (
          // Skeleton
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm animate-pulse">
              <div className="flex gap-3">
                <div className="w-24 h-20 rounded-xl bg-slate-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                  <div className="h-4 bg-slate-200 rounded w-1/3" />
                </div>
              </div>
            </div>
          ))
        ) : cars.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center text-slate-400 text-sm shadow-sm">
            خودرویی با این مشخصات یافت نشد
          </div>
        ) : (
          cars.map((car) => (
            <Link
              key={car.id}
              href={`/cars/${car.id}`}
              className="block bg-white rounded-2xl p-3 shadow-sm border border-slate-100 active:scale-[0.99] transition"
            >
              <div className="flex gap-3">
                {/* Image placeholder */}
                <div className="w-24 h-20 rounded-xl bg-slate-100 flex-shrink-0 overflow-hidden flex items-center justify-center text-slate-300 text-xs">
                  {car.images?.length > 0 ? (
                    <span className="text-slate-400">تصویر</span>
                  ) : (
                    'بدون تصویر'
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-bold text-slate-800 text-[15px] truncate">
                      {car.brand} {car.model}
                    </h2>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 flex-shrink-0">
                      {car.year}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mt-0.5 truncate">{car.trim} • {car.color}</p>

                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="text-[11px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700">
                      {BODY_LABELS[car.bodyConditionType] || car.bodyConditionType}
                    </span>
                    <span className="text-[11px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">
                      {PRICE_TYPE_LABELS[car.priceType] || car.priceType}
                    </span>
                  </div>

                  <p className="text-sm font-bold text-blue-600 mt-1.5">
                    {Number(car.priceAmount).toLocaleString('fa-IR')} تومان
                  </p>
                </div>
              </div>
            </Link>
          ))
        )}
      </main>

      {/* Bottom safe area spacer */}
      <div className="h-6" />
    </div>
  );
}

function FilterInput({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-xs text-slate-500 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      />
    </div>
  );
}
