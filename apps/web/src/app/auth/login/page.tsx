'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
  const [mobile, setMobile] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

  async function requestOtp() {
    setError('');
    setMessage('');
    if (!/^09\d{9}$/.test(mobile)) {
      setError('شماره موبایل را به درستی وارد کنید (مثال: ۰۹۱۲۳۴۵۶۷۸۹)');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/auth/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'خطا در ارسال کد');
      setMessage(data.message || 'کد تایید ارسال شد');
      setStep('otp');
    } catch (e: any) {
      setError(e.message || 'خطایی رخ داد');
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp() {
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'کد اشتباه است');

      // store token
      localStorage.setItem('accessToken', data.tokens.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      router.push('/dashboard');
    } catch (e: any) {
      setError(e.message || 'خطایی رخ داد');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col">
      {/* Header */}
      <header className="pt-safe px-4 pt-6 pb-2">
        <h1 className="text-center text-xl font-bold text-slate-800">ورود / ثبت‌نام</h1>
        <p className="text-center text-sm text-slate-500 mt-1">با شماره موبایل وارد شوید</p>
      </header>

      <main className="flex-1 flex flex-col justify-center px-4 pb-8 max-w-md mx-auto w-full">
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-5">
          {step === 'mobile' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">شماره موبایل</label>
                <input
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={11}
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 text-lg text-center tracking-wider focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  dir="ltr"
                />
              </div>

              {error && <p className="text-sm text-red-600 text-center">{error}</p>}
              {message && <p className="text-sm text-green-600 text-center">{message}</p>}

              <button
                onClick={requestOtp}
                disabled={loading || mobile.length !== 11}
                className="w-full h-12 rounded-xl bg-blue-600 text-white font-semibold text-base disabled:opacity-50 active:scale-[0.98] transition"
              >
                {loading ? 'در حال ارسال...' : 'دریافت کد تایید'}
              </button>
            </>
          ) : (
            <>
              <div className="text-center text-sm text-slate-600">
                کد ۵ رقمی ارسال‌شده به <span className="font-medium" dir="ltr">{mobile}</span> را وارد کنید
              </div>

              <div>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={5}
                  placeholder="─────"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full h-14 px-4 rounded-xl border border-slate-200 text-2xl text-center tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  dir="ltr"
                  autoFocus
                />
              </div>

              {error && <p className="text-sm text-red-600 text-center">{error}</p>}

              <button
                onClick={verifyOtp}
                disabled={loading || code.length < 4}
                className="w-full h-12 rounded-xl bg-blue-600 text-white font-semibold text-base disabled:opacity-50 active:scale-[0.98] transition"
              >
                {loading ? 'در حال بررسی...' : 'ورود'}
              </button>

              <button
                onClick={() => { setStep('mobile'); setCode(''); setError(''); }}
                className="w-full text-sm text-slate-500 py-2"
              >
                تغییر شماره موبایل
              </button>
            </>
          )}
        </div>

        <p className="text-xs text-center text-slate-400 mt-6 leading-relaxed">
          با ورود به سیستم، شرایط استفاده و سلب مسئولیت تعمیرگاه را می‌پذیرید.
        </p>
      </main>
    </div>
  );
}
