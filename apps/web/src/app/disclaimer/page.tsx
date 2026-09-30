import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'سلب مسئولیت و شرایط استفاده',
  description: 'قرارداد کوتاه سلب مسئولیت تعمیرگاه در قبال معاملات خرید و فروش خودرو بین مشتریان',
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-slate-600 text-lg">→</Link>
          <h1 className="font-bold text-slate-800 text-lg">سلب مسئولیت</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-5 text-sm leading-7 text-slate-700">
        <section className="bg-white rounded-2xl p-5 shadow-sm space-y-3">
          <h2 className="font-bold text-slate-800 text-base">نقش تعمیرگاه</h2>
          <p>
            این سامانه صرفاً یک بستر معرفی و ارتباط بین فروشندگان و خریداران خودرو است.
            تعمیرگاه هیچ‌گونه دخالتی در مذاکره، معامله، پرداخت وجه یا انتقال سند ندارد
            و صرفاً فضای دیجیتال را برای تسهیل آشنایی طرفین فراهم کرده است.
          </p>
        </section>

        <section className="bg-white rounded-2xl p-5 shadow-sm space-y-3">
          <h2 className="font-bold text-slate-800 text-base">مسئولیت فروشنده</h2>
          <ul className="list-disc pr-5 space-y-1">
            <li>صحت و کامل بودن اطلاعات ثبت‌شده (برند، مدل، سال، شرایط بدنه، شاسی، موتور، گیربکس، قیمت و مدارک) بر عهده فروشنده است.</li>
            <li>فروشنده موظف است وضعیت واقعی خودرو را بدون اغراق یا پنهان‌کاری اعلام کند.</li>
            <li>مسئولیت پاسخگویی به خریدار و انجام معامله بر عهده خود فروشنده است.</li>
          </ul>
        </section>

        <section className="bg-white rounded-2xl p-5 shadow-sm space-y-3">
          <h2 className="font-bold text-slate-800 text-base">مسئولیت خریدار</h2>
          <ul className="list-disc pr-5 space-y-1">
            <li>خریدار موظف است قبل از هرگونه پرداخت یا توافق، خودرو را از نزدیک معاینه و در صورت نیاز به کارشناس مستقل مراجعه کند.</li>
            <li>صحت مدارک، وضعیت فنی و اصالت خودرو باید توسط خریدار بررسی شود.</li>
            <li>هرگونه توافق مالی و حقوقی مستقیماً بین خریدار و فروشنده انجام می‌شود.</li>
          </ul>
        </section>

        <section className="bg-amber-50 border border-amber-100 rounded-2xl p-5 space-y-2 text-amber-900">
          <h2 className="font-bold text-base">سلب مسئولیت تعمیرگاه</h2>
          <p>
            تعمیرگاه، مدیران، کارکنان و این سامانه هیچ‌گونه مسئولیتی در قبال اختلافات،
            خسارات مادی یا معنوی، عدم تطابق خودرو با آگهی، مشکلات حقوقی سند،
            یا هرگونه زیان ناشی از معامله بین خریدار و فروشنده ندارند.
          </p>
          <p>
            استفاده از این سامانه به منزله مطالعه و پذیرش کامل این شرایط است.
          </p>
        </section>

        <p className="text-xs text-slate-400 text-center pt-2">
          آخرین به‌روزرسانی: ۱۴۰۴
        </p>
      </main>
    </div>
  );
}
