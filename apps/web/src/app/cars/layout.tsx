import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'لیست خودروهای موجود',
  description: 'مشاهده و فیلتر خودروهای ثبت‌شده توسط مشتریان تعمیرگاه. جستجوی هوشمند بر اساس برند، مدل، سال، قیمت و شرایط بدنه.',
};

export default function CarsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
