# Car Inventory System

سیستم مدیریت و معرفی هوشمند خودروهای مشتریان تعمیرگاه

**وضعیت پروژه:** تمام ۸ تسک اصلی تکمیل شده است.

## امکانات اصلی

- ثبت‌نام / ورود مالک فقط با OTP موبایل
- فرم کامل ثبت خودرو (برند، مدل، تیپ، سال، بیمه، رنگ، شرایط بدنه با قطعات، شاسی، موتور، گیربکس، قیمت و نوع فروش، مدارک، تصاویر)
- بهینه‌سازی خودکار تصاویر (WebP + سه سایز استاندارد)
- مخفی کردن شماره تماس و حذف نرم توسط مالک
- لیست عمومی با جستجو و فیلترهای پیشرفته (موبایل‌فرست)
- نمودار موقعیت قیمت نسبت به میانگین بازار (خاکستری → سبز → زرد → نارنجی → قرمز)
- پیشنهاد خودروهای مشابه (هوشمند)
- صفحه سلب مسئولیت کامل
- پنل ادمین ساده
- صفحه embed برای قرار دادن در وب‌سایت تعمیرگاه
- اسکلت بکاپ روزانه دیتابیس

## معماری

- **Clean Architecture** + DDD سبک
- Monorepo با pnpm workspaces
- `apps/api` – NestJS
- `apps/web` – Next.js 14 (App Router) – کاملاً Mobile-First و RTL
- `packages/domain` – Entities & Value Objects
- `packages/shared` – Types مشترک
- `packages/infrastructure` – Image processor (sharp) + Market price service

اصول کدنویسی:  
→ https://github.com/Karoongh/car-inventory-system-principles

## شروع سریع (توسعه)

```bash
git clone https://github.com/Karoongh/car-inventory-system.git
cd car-inventory-system
pnpm install
cp .env.example .env
docker compose up -d
pnpm dev
```

- وب: http://localhost:3000
- API: http://localhost:3001/api/v1

## مسیرهای مهم

| مسیر | توضیح |
|------|--------|
| `/` | صفحه اصلی |
| `/auth/login` | ورود با OTP |
| `/dashboard` | پنل مالک |
| `/cars/new` | ثبت خودروی جدید |
| `/cars` | لیست عمومی + فیلتر |
| `/cars/[id]` | جزئیات + نمودار قیمت + پیشنهاد مشابه |
| `/disclaimer` | سلب مسئولیت |
| `/admin` | پنل ادمین |
| `/embed` | ویجت قابل قرار دادن در سایت تعمیرگاه |

## تسک‌های انجام‌شده

- [x] تسک ۱ – ساختار پروژه + اصول کدنویسی
- [x] تسک ۲ – Domain + Prisma Schema
- [x] تسک ۳ – احراز هویت OTP
- [x] تسک ۴ – CRUD خودرو + آپلود و بهینه‌سازی تصویر
- [x] تسک ۵ – لیست عمومی + فیلتر + SEO
- [x] تسک ۶ – موقعیت قیمت نسبت به بازار + نمودار رنگی
- [x] تسک ۷ – پیشنهاد هوشمند + سلب مسئولیت + پنل ادمین
- [x] تسک ۸ – بکاپ روزانه + امنیت + embed + مستندات نهایی

## مراحل بعدی پیشنهادی (پس از این نسخه)

1. اتصال واقعی Prisma به جای in-memory store
2. انتقال OTP و session به Redis
3. اتصال درگاه پیامک واقعی (SMS.ir / Kavenegar)
4. اسکرپر واقعی دیوار با rate-limit و cache
5. استقرار روی VPS با HTTPS
6. افزودن نقش Admin واقعی و پنل مدیریتی غنی‌تر

## مجوز

خصوصی – متعلق به صاحب پروژه.
