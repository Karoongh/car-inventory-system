# Cars CRUD + Image Upload (Task 4)

## Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/v1/cars | JWT | ایجاد خودرو + آپلود تصویر |
| GET | /api/v1/cars | Public | لیست عمومی با فیلتر |
| GET | /api/v1/cars/my | JWT | خودروهای من |
| GET | /api/v1/cars/:id | Public | جزئیات یک خودرو |
| PATCH | /api/v1/cars/:id/visibility | JWT | مخفی/نمایش شماره |
| DELETE | /api/v1/cars/:id | JWT | حذف نرم |

## Image Processing

- حداکثر ۱۰ تصویر، هر کدام تا ۸ مگابایت
- تبدیل خودکار به WebP
- سه سایز: thumbnail (400×300)، medium (800×600)، large (1200×900)
- کیفیت پیش‌فرض ۸۰
- فقط نام فایل medium در دیتابیس ذخیره می‌شود

## Frontend

- فرم `/cars/new` کاملاً موبایل‌فرست با:
  - بخش‌بندی واضح
  - انتخاب چندتایی قطعات رنگ
  - پیش‌نمایش تصاویر
  - دکمه ثابت پایین صفحه (Sticky CTA)
  - اعتبارسنجی سمت کلاینت
