'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

const BODY_TYPES = [
  { value: 'ZERO_KM_DRY', label: 'صفر کیلومتر خشک' },
  { value: 'NO_PAINT_NO_SCRATCH', label: 'بی‌رنگ بدون خط و خش' },
  { value: 'NO_PAINT_MINOR_SCRATCH', label: 'بی‌رنگ با خط و خش جزئی' },
  { value: 'ONE_PART_PAINTED', label: 'یک قطعه رنگ' },
  { value: 'TWO_PARTS_PAINTED', label: 'دو قطعه رنگ' },
  { value: 'THREE_PARTS_PAINTED', label: 'سه قطعه رنگ' },
  { value: 'FULL_PAINT', label: 'دور رنگ' },
];

const BODY_PARTS = [
  'کاپوت', 'گلگیر جلو چپ', 'گلگیر جلو راست', 'گلگیر عقب چپ', 'گلگیر عقب راست',
  'درب جلو چپ', 'درب جلو راست', 'درب عقب چپ', 'درب عقب راست',
  'درب صندوق', 'سقف', 'سپر جلو', 'سپر عقب',
];

const CHASSIS_TYPES = [
  { value: 'HEALTHY_AND_SEALED', label: 'سالم و پلمپ' },
  { value: 'IMPACTED', label: 'ضربه خورده' },
];

const ENGINE_TYPES = [
  { value: 'HEALTHY_AND_SEALED', label: 'سالم و پلمپ' },
  { value: 'RECENTLY_REPAIRED', label: 'تازه تعمیر' },
  { value: 'NEEDS_REPAIR', label: 'نیاز به تعمیر' },
];

const PRICE_TYPES = [
  { value: 'CASH_ONLY', label: 'فقط نقدی' },
  { value: 'EXCHANGEABLE', label: 'قابل معاوضه' },
  { value: 'INSTALLMENT', label: 'شرایطی (چک و غیره)' },
];

const DOC_TYPES = [
  { value: 'COMPLETE_AND_READY', label: 'کامل و آماده انتقال' },
  { value: 'HAS_PROBLEM', label: 'مشکل دارد' },
];

export default function NewCarPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const [form, setForm] = useState({
    brand: '',
    model: '',
    trim: '',
    year: new Date().getFullYear(),
    thirdPartyInsuranceDate: '',
    hasBodyInsurance: false,
    color: '',
    bodyConditionType: 'NO_PAINT_NO_SCRATCH',
    bodyPaintedParts: [] as string[],
    bodyDescription: '',
    chassisConditionType: 'HEALTHY_AND_SEALED',
    chassisImpactAreas: [] as string[],
    chassisDescription: '',
    engineConditionType: 'HEALTHY_AND_SEALED',
    engineDescription: '',
    gearboxConditionType: 'HEALTHY_AND_SEALED',
    gearboxDescription: '',
    priceAmount: '',
    priceType: 'CASH_ONLY',
    exchangeDetails: '',
    installmentDetails: '',
    ownerFullName: '',
    ownerMobile: '',
    isPhoneVisible: true,
    documentStatusType: 'COMPLETE_AND_READY',
    documentProblemDesc: '',
  });

  function update(field: string, value: any) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []).slice(0, 8);
    setImages(files);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  }

  async function submit() {
    setError('');
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    if (!form.brand || !form.model || !form.trim || !form.priceAmount || !form.ownerFullName || !form.ownerMobile) {
      setError('لطفاً فیلدهای الزامی را پر کنید');
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (Array.isArray(v)) {
          v.forEach((item) => fd.append(k, item));
        } else if (v !== '' && v !== null) {
          fd.append(k, String(v));
        }
      });
      images.forEach((img) => fd.append('images', img));

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/cars`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'خطا در ثبت خودرو');

      router.push('/dashboard');
    } catch (e: any) {
      setError(e.message || 'خطایی رخ داد');
    } finally {
      setLoading(false);
    }
  }

  const showPaintedParts = ['ONE_PART_PAINTED', 'TWO_PARTS_PAINTED', 'THREE_PARTS_PAINTED', 'FULL_PAINT'].includes(form.bodyConditionType);

  return (
    <div className="min-h-screen bg-slate-50 pb-28">
      <header className="bg-white border-b border-slate-200 px-4 py-4 sticky top-0 z-20">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button onClick={() => router.back()} className="text-slate-600 text-lg">→</button>
          <h1 className="font-bold text-slate-800 text-lg">ثبت خودروی جدید</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-5 space-y-6">
        {/* Images */}
        <section className="bg-white rounded-2xl p-4 shadow-sm">
          <h2 className="font-semibold text-slate-800 mb-3">تصاویر خودرو</h2>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {previews.map((src, i) => (
              <div key={i} className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100">
                <img src={src} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
            {previews.length < 8 && (
              <button
                onClick={() => fileRef.current?.click()}
                className="aspect-[4/3] rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 text-2xl active:bg-slate-50"
              >
                +
              </button>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
          <p className="text-xs text-slate-400">حداکثر ۸ تصویر – به صورت خودکار به WebP تبدیل و بهینه‌سازی می‌شوند</p>
        </section>

        {/* Basic Info */}
        <section className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
          <h2 className="font-semibold text-slate-800">اطلاعات پایه</h2>
          <Input label="برند" value={form.brand} onChange={(v) => update('brand', v)} placeholder="مثلاً پژو" />
          <Input label="مدل" value={form.model} onChange={(v) => update('model', v)} placeholder="مثلاً ۲۰۶" />
          <Input label="تیپ / سطح امکانات" value={form.trim} onChange={(v) => update('trim', v)} placeholder="مثلاً تیپ ۵" />
          <Input label="سال ساخت" type="number" value={String(form.year)} onChange={(v) => update('year', Number(v))} />
          <Input label="رنگ" value={form.color} onChange={(v) => update('color', v)} placeholder="مثلاً سفید" />
        </section>

        {/* Body */}
        <section className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
          <h2 className="font-semibold text-slate-800">شرایط بدنه</h2>
          <Select label="وضعیت بدنه" value={form.bodyConditionType} onChange={(v) => update('bodyConditionType', v)} options={BODY_TYPES} />
          {showPaintedParts && (
            <div>
              <p className="text-sm text-slate-600 mb-2">قطعات رنگ‌شده را انتخاب کنید</p>
              <div className="flex flex-wrap gap-2">
                {BODY_PARTS.map((part) => {
                  const selected = form.bodyPaintedParts.includes(part);
                  return (
                    <button
                      key={part}
                      type="button"
                      onClick={() => {
                        const next = selected
                          ? form.bodyPaintedParts.filter((p) => p !== part)
                          : [...form.bodyPaintedParts, part];
                        update('bodyPaintedParts', next);
                      }}
                      className={`px-3 py-1.5 rounded-full text-sm border transition ${
                        selected ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200'
                      }`}
                    >
                      {part}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* Chassis / Engine / Gearbox */}
        <section className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
          <h2 className="font-semibold text-slate-800">فنی</h2>
          <Select label="شاسی" value={form.chassisConditionType} onChange={(v) => update('chassisConditionType', v)} options={CHASSIS_TYPES} />
          <Select label="موتور" value={form.engineConditionType} onChange={(v) => update('engineConditionType', v)} options={ENGINE_TYPES} />
          <Select label="گیربکس" value={form.gearboxConditionType} onChange={(v) => update('gearboxConditionType', v)} options={ENGINE_TYPES} />
        </section>

        {/* Price */}
        <section className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
          <h2 className="font-semibold text-slate-800">قیمت و شرایط فروش</h2>
          <Input label="قیمت پیشنهادی (تومان)" type="number" value={form.priceAmount} onChange={(v) => update('priceAmount', v)} placeholder="مثلاً ۸۵۰۰۰۰۰۰۰" />
          <Select label="نوع فروش" value={form.priceType} onChange={(v) => update('priceType', v)} options={PRICE_TYPES} />
          {form.priceType === 'EXCHANGEABLE' && (
            <Input label="جزئیات معاوضه" value={form.exchangeDetails} onChange={(v) => update('exchangeDetails', v)} />
          )}
          {form.priceType === 'INSTALLMENT' && (
            <Input label="جزئیات شرایطی" value={form.installmentDetails} onChange={(v) => update('installmentDetails', v)} />
          )}
        </section>

        {/* Owner & Docs */}
        <section className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
          <h2 className="font-semibold text-slate-800">مالک و مدارک</h2>
          <Input label="نام و نام خانوادگی مالک" value={form.ownerFullName} onChange={(v) => update('ownerFullName', v)} />
          <Input label="شماره موبایل" type="tel" value={form.ownerMobile} onChange={(v) => update('ownerMobile', v.replace(/\D/g, ''))} placeholder="۰۹۱۲۳۴۵۶۷۸۹" dir="ltr" />
          <label className="flex items-center gap-3 py-2">
            <input
              type="checkbox"
              checked={form.isPhoneVisible}
              onChange={(e) => update('isPhoneVisible', e.target.checked)}
              className="w-5 h-5 rounded border-slate-300 text-blue-600"
            />
            <span className="text-sm text-slate-700">نمایش شماره تماس به خریداران</span>
          </label>
          <Select label="وضعیت سند و مدارک" value={form.documentStatusType} onChange={(v) => update('documentStatusType', v)} options={DOC_TYPES} />
          {form.documentStatusType === 'HAS_PROBLEM' && (
            <Input label="توضیح مشکل مدارک" value={form.documentProblemDesc} onChange={(v) => update('documentProblemDesc', v)} />
          )}
          <label className="flex items-center gap-3 py-2">
            <input
              type="checkbox"
              checked={form.hasBodyInsurance}
              onChange={(e) => update('hasBodyInsurance', e.target.checked)}
              className="w-5 h-5 rounded border-slate-300 text-blue-600"
            />
            <span className="text-sm text-slate-700">بیمه بدنه دارد</span>
          </label>
        </section>

        {error && <p className="text-sm text-red-600 text-center bg-red-50 rounded-xl py-3">{error}</p>}
      </main>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 safe-bottom z-30">
        <div className="max-w-lg mx-auto">
          <button
            onClick={submit}
            disabled={loading}
            className="w-full h-13 rounded-xl bg-blue-600 text-white font-bold text-base disabled:opacity-50 active:scale-[0.98] transition shadow-lg shadow-blue-200 py-3.5"
          >
            {loading ? 'در حال ثبت و بهینه‌سازی تصاویر...' : 'ثبت خودرو'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, placeholder, type = 'text', dir }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-600 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        dir={dir}
        className="w-full h-12 px-4 rounded-xl border border-slate-200 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
}

function Select({ label, value, onChange, options }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-600 mb-1.5">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-12 px-4 rounded-xl border border-slate-200 text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {options.map((o: any) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}
