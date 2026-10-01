# راه‌اندازی Prisma (اتصال دیتابیس واقعی)

## پیش‌نیاز

1. Docker در حال اجرا باشد
2. فایل `.env` از روی `.env.example` ساخته شده باشد

## مراحل اجرا (اولین بار)

```bash
# 1. روشن کردن PostgreSQL و Redis
docker compose up -d

# 2. نصب وابستگی‌ها (اگر قبلاً نکرده‌اید)
pnpm install

# 3. تولید Prisma Client
cd packages/infrastructure
pnpm prisma:generate

# 4. اجرای Migration (ساخت جداول)
pnpm prisma:migrate
# وقتی پرسید نام migration را وارد کنید، مثلاً: init

# 5. بازگشت به ریشه پروژه و اجرای برنامه
cd ../..
pnpm dev
```

## دستورات مفید

| دستور | کار |
|--------|------|
| `pnpm prisma:generate` | تولید کلاینت Prisma بعد از تغییر schema |
| `pnpm prisma:migrate` | ساخت/اعمال migration در development |
| `pnpm prisma:deploy` | اعمال migration در production |
| `pnpm prisma:studio` | رابط گرافیکی برای دیدن داده‌ها |

## چه چیزی تغییر کرد؟

- **قبل:** داده‌ها در حافظه RAM بودند و با ری‌استارت پاک می‌شدند
- **الان:** داده‌ها در PostgreSQL ذخیره می‌شوند و دائمی هستند

جداول ساخته‌شده:
- `users` – کاربران
- `cars` – خودروها
- `market_price_history` – تاریخچه قیمت بازار
- `audit_logs` – لاگ عملیات حساس

## نکته مهم

اگر خطای اتصال به دیتابیس گرفتید:
1. مطمئن شوید `docker compose up -d` اجرا شده
2. مقدار `DATABASE_URL` در `.env` درست باشد:
   ```
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/car_inventory?schema=public
   ```
