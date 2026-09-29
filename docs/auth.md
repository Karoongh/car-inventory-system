# Authentication (Task 3)

## Flow

1. کاربر شماره موبایل را وارد می‌کند (`POST /api/v1/auth/request-otp`)
2. سیستم OTP ۵ رقمی تولید و (فعلاً در لاگ) ارسال می‌کند
3. کاربر کد را وارد می‌کند (`POST /api/v1/auth/verify-otp`)
4. در صورت صحیح بودن، کاربر به صورت خودکار به عنوان Owner ثبت‌نام می‌شود (اگر قبلاً نبوده) و JWT دریافت می‌کند

## Security Measures

- Rate limiting: حداکثر ۵ درخواست OTP در ۱۵ دقیقه برای هر شماره
- حداکثر ۵ تلاش اشتباه برای هر کد
- TTL کد: ۵ دقیقه
- JWT با انقضای ۷ روز

## Current Implementation Notes

- OTP store و User store فعلاً in-memory هستند (برای توسعه سریع)
- در تسک‌های بعدی با Redis + Prisma جایگزین می‌شوند
- SMS واقعی هنوز وصل نشده (فقط console.log)

## Frontend

- صفحه `/auth/login` کاملاً موبایل‌فرست طراحی شده
- دکمه‌های بزرگ، inputهای لمسی، RTL، و بازخورد فوری
