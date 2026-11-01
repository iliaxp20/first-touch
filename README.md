# فرست تاچ (First Touch) ⚽
### پلتفرم تخصصی مدیریت مربیان و شاگردان فوتبال

«فرست تاچ» یک پلتفرم جامع با معماری مدرن است که برای ارتباط مربیان با شاگردان، ارائه برنامه‌های تمرینی، خرید اشتراک و عضویت، و تخته تاکتیک آنلاین و تعاملی طراحی شده است.

---

## 🏗 معماری پروژه (Monorepo)

این پروژه به صورت ماژولار و تفکیک‌شده طراحی شده است:

```
first-touch/
├── .agent/                             # قوانین و مهارت‌های توسعه برای Agent و تیم
│   ├── skills/
│   │   ├── clean-code-solid/           # مهارت و دستورالعمل اصول SOLID و Clean Code
│   │   ├── responsive-theming/         # مهارت طراحی واکنش‌گرا (موبایل سر زمین) و Dark/Light
│   │   └── first-touch-workflow/       # ورک‌فلو ۵ مرحله‌ای توسعه ویژگی‌های جدید
│   └── rules/                          # قوانین کلی کدنویسی پروژه
├── apps/
│   ├── web/                            # اپلیکیشن و داشبورد مربی و شاگرد (React + Vite + Tailwind + shadcn)
│   │   ├── src/
│   │   │   ├── components/layout/      # Navbar, Sidebar, AppLayout (ریسپانسیو با نوبار پایین موبایل)
│   │   │   ├── context/ThemeContext    # مدیریت تم تاریک/روشن با ذخیره در حافظه و ترجیح سیستم
│   │   │   └── features/
│   │   │       ├── tactics/            # تخته تاکتیک تعاملی مربی (Drag & Drop بازیکنان، آرایش ۴-۳-۳ و...)
│   │   │       ├── plans/              # برنامه‌های تمرینی هفتگی، سطوح مهارتی و ارزیابی
│   │   │       └── subscriptions/      # بسته‌های اشتراک، فاکتورها و درآمد مربی
│   │   └── index.html                  # فونت استاندارد Vazirmatn و ساختار راست‌به‌چپ (RTL)
│   │
│   └── api/                            # سرور و وب‌سرویس اختصاصی (NestJS + TypeScript)
│       ├── prisma/schema.prisma        # اسکیما دیتابیس PostgreSQL (کاربران، مربی، شاگرد، تمرین، پرداخت)
│       └── src/
│           ├── database/               # PrismaService و ارتباط امن با دیتابیس
│           └── main.ts                 # راه‌اندازی سرور، CORS و مستندات خودکار Swagger
│
└── packages/
    └── shared/                         # تایپ‌ها و DTOهای مشترک بین کلاینت و سرور
        └── src/types/                  # UserRole, TacticBoard, PlanDto, SubscriptionStatus
```

---

## 🎨 استانداردهای تم تاریک/روشن و واکنش‌گرایی

1. **Dark & Light Mode:**
   - استفاده از متغیرهای معنایی CSS (`hsl(...)`).
   - تعویض تم در دکمه بالایی با ۳ حالت: روشن (Light)، تاریک (Dark)، خودکار سیستم (System).
   - بدون استفاده از رنگ‌های ثابت (Hardcoded).
2. **واکنش‌گرایی (Mobile-First):**
   - بهینه‌سازی شده برای گوشی مربی و شاگرد سر زمین تمرین یا باشگاه.
   - منوی زیرین (Bottom Navigation) در موبایل و منوی کناری (Sidebar) در دسکتاپ.
   - تخته تاکتیک مجهز به لمس (Touch Events) با حفظ نسبت ابعاد زمین فوتبال (16:9).

---

## 🚀 راهنمای راه‌اندازی (Getting Started)

### ۱. پیش‌نیازها
* Node.js نسخه 18 یا بالاتر
* پایگاه داده PostgreSQL

### ۲. نصب پکیج‌ها
```bash
# در ریشه پروژه
npm install
```

### ۳. راه‌اندازی دیتابیس و مهاجرت‌ها (Prisma)
یک فایل `.env` داخل `apps/api` ایجاد کرده و آدرس دیتابیس را وارد کنید:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/first_touch_db?schema=public"
PORT=4000
```
سپس دستور زیر را اجرا کنید:
```bash
cd apps/api
npx prisma migrate dev --name init
```

### ۴. اجرای فرانت‌اند وب
```bash
cd apps/web
npm run dev
# فرانت‌اند در آدرس http://localhost:3000 اجرا می‌شود
```

### ۵. اجرای بک‌اند API
```bash
cd apps/api
npm run start:dev
# وب‌سرویس در آدرس http://localhost:4000 و مستندات Swagger در http://localhost:4000/api/docs در دسترس است
```
