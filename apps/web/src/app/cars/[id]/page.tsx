'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import PricePositionChart from '@/components/PricePositionChart';

const BODY_LABELS: Record<string, string> = {
  ZERO_KM_DRY: 'صفر کیلومتر خشک',
  NO_PAINT_NO_SCRATCH: 'بی‌رنگ بدون خط و خش',
  NO_PAINT_MINOR_SCRATCH: 'بی‌رنگ با خط و خش جزئی',
  ONE_PART_PAINTED: 'یک قطعه رنگ',
  TWO_PARTS_PAINTED: 'دو قطعه رنگ',
  THREE_PARTS_PAINTED: 'سه قطعه رنگ',
  FULL_PAINT: 'دور رنگ',
};

const CHASSIS_LABELS: Record<string, string> = {
  HEALTHY_AND_SEALED: 'سالم و پلمپ',
  IMPACTED: 'ضربه خورده',
};

const ENGINE_LABELS: Record<string, string> = {
  HEALTHY_AND_SEALED: 'سالم و پلمپ',
  RECENTLY_REPAIRED: 'تازه تعمیر',
  NEEDS_REPAIR: 'نیاز به تعمیر',
};

const PRICE_LABELS: Record<string, string> = {
  CASH_ONLY: 'فقط نقدی',
  EXCHANGEABLE: 'قابل معاوضه',
  INSTALLMENT: 'شرایطی',
};

const DOC_LABELS: Record<string, string> = {
  COMPLETE_AND_READY: 'کامل و آماده انتقال',
  HAS_PROBLEM: 'مشکل دارد',
};

export default function CarDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const id = params.id as string;
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/cars/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setCar(d.data);
        else setError(d.message || 'خودرو یافت نشد');
      })
      .catch(() => setError('خطا در دریافت اطلاعات'))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse text-slate-400">در حال بارگذاری...</div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-6">
        <p className="text-slate-500 mb-4">{error || 'خودرو یافت نشد'}</p>
        <Link href="/cars" className="text-blue-600 font-medium">بازگشت به لیست</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-28">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => router.back()} className="text-slate-600 text-lg">→</button>
          <h1 className="font-bold text-slate-800 truncate">
            {car.brand} {car.model}
          </h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto">
        <div className="aspect-[16/10] bg-slate-200 flex items-center justify-center text-slate-400 text-sm">
          {car.images?.length > 0 ? 'گالری تصاویر' : 'بدون تصویر'}
        </div>

        <div className="px-4 py-5 space-y-5">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {car.brand} {car.model} {car.trim}
            </h2>
            <p className="text-sm text-slate-500 mt-1">{car.year} • {car.color}</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              {Number(car.priceAmount).toLocaleString('fa-IR')}
              <span className="text-sm font-medium text-slate-500 mr-1">تومان</span>
            </p>
            <span className="inline-block mt-2 text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
              {PRICE_LABELS[car.priceType] || car.priceType}
            </span>
          </div>

          {/* Price Position Chart */}
          <PricePositionChart carId={car.id} />

          <section className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
            <h3 className="font-semibold text-slate-800">مشخصات</h3>
            <Row label="شرایط بدنه" value={BODY_LABELS[car.bodyConditionType] || car.bodyConditionType} />
            {car.bodyPaintedParts?.length > 0 && (
              <Row label="قطعات رنگ" value={car.bodyPaintedParts.join('، ')} />
            )}
            <Row label="شاسی" value={CHASSIS_LABELS[car.chassisConditionType] || car.chassisConditionType} />
            <Row label="موتور" value={ENGINE_LABELS[car.engineConditionType] || car.engineConditionType} />
            <Row label="گیربکس" value={ENGINE_LABELS[car.gearboxConditionType] || car.gearboxConditionType} />
            <Row label="بیمه بدنه" value={car.hasBodyInsurance ? 'دارد' : 'ندارد'} />
            <Row label="وضعیت مدارک" value={DOC_LABELS[car.documentStatusType] || car.documentStatusType} />
          </section>

          <section className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-3">فروشنده</h3>
            <p className="text-sm text-slate-700">{car.ownerFullName}</p>
            {car.isPhoneVisible && car.ownerMobile ? (
              <a
                href={`tel:${car.ownerMobile}`}
                className="mt-3 flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-emerald-600 text-white font-semibold active:scale-[0.98]"
              >
                تماس: <span dir="ltr">{car.ownerMobile}</span>
              </a>
            ) : (
              <p className="text-sm text-slate-400 mt-2">شماره تماس مخفی است</p>
            )}
          </section>

          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-xs text-amber-800 leading-relaxed">
            <strong>سلب مسئولیت:</strong> تعمیرگاه هیچ‌گونه مسئولیتی در قبال معامله بین خریدار و فروشنده ندارد.
            مسئولیت بررسی صحت اطلاعات، وضعیت فنی و مدارک خودرو بر عهده طرفین معامله است.
          </div>
        </div>
      </main>

      {car.isPhoneVisible && car.ownerMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-30">
          <div className="max-w-lg mx-auto">
            <a
              href={`tel:${car.ownerMobile}`}
              className="flex items-center justify-center gap-2 w-full h-13 rounded-xl bg-emerald-600 text-white font-bold text-base active:scale-[0.98] shadow-lg shadow-emerald-200 py-3.5"
            >
              تماس با فروشنده
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-slate-50 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-medium text-slate-800 text-left">{value}</span>
    </div>
  );
}
