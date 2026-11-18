# موقع مكتب عصام الجسيم للسفريات والسياحة

موقع إلكتروني احترافي كامل (Next.js 16 + TypeScript + Tailwind CSS 4 + PostgreSQL/Drizzle ORM) مع **لوحة تحكم إدارية** تتيح للإدارة تعديل كل محتويات الموقع دون تعديل الكود.

- اللغة: العربية بالكامل — اتجاه RTL.
- الهوية: كحلي داكن `#0a2540` + أخضر زمردي كحلي `#0b3f52` + ذهبي فاخر `#c9a227` + خلفية عاجية `#faf7f0` (كل الألوان قابلة للتعديل من لوحة التحكم).
- الخطوط: Cairo + Tajawal عبر Google Fonts.

---

## 1) التشغيل السريع

```bash
# 1) تثبيت الحزم
npm install

# 2) إعداد ملف البيئة .env (انظر أدناه)

# 3) إنشاء الجداول في قاعدة البيانات
npx drizzle-kit push --config=drizzle.config.json

# 4) التشغيل في بيئة التطوير
npm run dev

# 5) للنشر
npm run build && npm run start
```

عند أول تشغيل يُنفّذ النظام **تهيئة تلقائية** (Bootstrap) تُنشئ: سجل إعدادات الموقع، أقسام الصفحة الرئيسية، الخدمات الأساسية، العروض، شركات الباصات وخطوط السير، الأسئلة الشائعة، أسباب الاختيار، والحساب الإداري الأول.

---

## 2) ملف البيئة `.env`

```env
DATABASE_URL=postgresql://user:password@host:5432/dbname

# حساب المدير الأول — يُنشأ مرة واحدة فقط عند أول تشغيل
ADMIN_EMAIL=admin@essam-aljassim.com
ADMIN_PASSWORD=استخدم_كلمة_مرور_قوية_هنا

# مفتاح تشفير الجلسات (JWT) — يجب تغييره قبل النشر
AUTH_SECRET=سلسلة_عشوائية_طويلة

# رابط الموقع النهائي (يُستخدم في SEO و sitemap)
SITE_URL=https://www.example.com

# مجلد تخزين الصور المرفوعة (اختياري، الافتراضي ./storage/uploads)
UPLOAD_DIR=/var/data/essam-aljassim/uploads
```

### الدخول إلى لوحة التحكم
- الرابط: `/admin` (يُحوَّل تلقائياً إلى `/admin/login` عند عدم وجود جلسة).
- البريد وكلمة المرور يُقرآن من `ADMIN_EMAIL` و `ADMIN_PASSWORD` عند أول تشغيل.
- القيم الافتراضية في بيئة التطوير: `admin@essam-aljassim.com` / `Essam@2026`.
- **غيّر كلمة المرور فوراً بعد النشر** عبر تعديل `ADMIN_PASSWORD` وحذف مستخدم المدير القديم من جدول `admin_users` ثم إعادة تشغيل الخدمة، أو أنشئ مستخدماً جديداً مباشرة في قاعدة البيانات (كلمة المرور تُخزّن مشفّرة بـ bcrypt ولا يمكن تعديلها من اللوحة عمداً).

لا يوجد تسجيل حسابات عامة، ولا نقطة نهاية تُنشئ مستخدمين.

---

## 3) ماذا تدير لوحة التحكم؟

| المسار | الوظيفة |
| --- | --- |
| `/admin` | لوحة المعلومات: عدد الطلبات، طلبات التأشيرات، الاستفسارات، العروض المنشورة، آخر الطلبات، ما لم يُتابع |
| `/admin/requests` | جدول كل طلبات العملاء: بحث، تصفية بالحالة والنوع، تحديث الحالة، ملاحظات المكتب، اتصال/واتساب مباشر، حذف |
| `/admin/sections` | أقسام الصفحة الرئيسية: العنوان، العنوان الفرعي، النص، الصورة، الإظهار/الإخفاء، الترتيب |
| `/admin/services` | الخدمات: إضافة/تعديل/حذف/إخفاء، صورة، وصف، تفاصيل، نقاط، ترتيب، slug |
| `/admin/offers` | العروض والبرامج والمنتجات: عدد غير محدود، صورة رئيسية + صور إضافية، سعر أو «تواصل معنا لمعرفة السعر»، تاريخ البداية والنهاية، الحالة، التصنيف |
| `/admin/bus-companies` | شركات الباصات: الشعار، الغلاف، الوصف، خط السير، المدن، حالة التوفر، شارة «شريك رسمي» (لا تُفعّل إلا بعد تأكيد الإدارة) |
| `/admin/bus-routes` | خطوط سير الباصات لكل شركة |
| `/admin/benefits` | أسباب اختيار المكتب |
| `/admin/stats` | المعلومات السريعة |
| `/admin/testimonials` | آراء العملاء — لا يُعرض أي رأي غير مُدخل من الإدارة |
| `/admin/faqs` | الأسئلة الشائعة |
| `/admin/media` | مكتبة الوسائط: رفع/حذف/نسخ الرابط، واختيار الصور لكل حقل |
| `/admin/settings` | معلومات المكتب، الشعار، الأرقام، العنوان، الخرائط، فيسبوك، تيك توك، أوقات العمل، الألوان، SEO، نافذة واتساب، حقوق النشر |

كل التغييرات تظهر في الموقع **مباشرة** لأن جميع الصفحات تُقرأ من قاعدة البيانات عند الطلب (Dynamic Rendering) دون إعادة بناء.

---

## 4) بنية قاعدة البيانات (Drizzle — `src/db/schema.ts`)

`admin_users`, `site_settings`, `home_sections`, `services`, `offers`, `bus_companies`, `bus_routes`, `booking_requests`, `contact_messages`, `faqs`, `testimonials`, `benefits`, `stats`, `media_files`.

---

## 5) نظام رفع الصور

- المسار: `POST /api/admin/media` (يتطلب جلسة مدير صالحة).
- التخزين **فعلي على الخادم** في `UPLOAD_DIR` (الافتراضي `./storage/uploads`) وسجل كل ملف في جدول `media_files`.
- الخدمة العامة: `GET /api/files/<fileName>` مع ترويسات تخزين مؤقت طويلة.
- التحقق الأمني:
  - السماح فقط بـ `image/jpeg | png | webp | gif | svg+xml | avif | x-icon`.
  - الحد الأقصى 6 ميغابايت.
  - التحقق من **توقيع الملف الحقيقي** (Magic Bytes) وليس الاعتماد على MIME فقط.
  - تنظيف أسماء الملفات ومنع أي مسار (`path traversal`).
  - اسم الملف المخزن يُولَّد من `Date + UUID` لتجنب التعارض.

---

## 6) الأمان

- **الجلسات:** JWT موقّع بـ HS256 عبر `jose` داخل كوكي `httpOnly` + `sameSite=lax` + `secure` في الإنتاج، صلاحية 7 أيام.
- **كلمات المرور:** `bcryptjs` بـ 12 دورة تشفير، ولا تُخزّن كنص صريح.
- **الحماية من التكرار:** محاولات تسجيل الدخول محدودة (8 محاولات / 10 دقائق لكل IP).
- **Middleware:** يمنع الوصول إلى أي مسار `/admin/*` بدون كوكي جلسة، وجميع مسارات `/api/admin/*` تتحقق من الجلسة مرة أخرى (دفاع مزدوج) وتعيد `401`.
- **قاعدة البيانات:** لا يوجد أي اتصال بقاعدة البيانات من المتصفح؛ كل الاستعلامات تمر عبر مكونات الخادم ومسارات API على الخادم فقط (`import "server-only"`). لا توجد مفاتيح سرية في الواجهة الأمامية، ولا يتم عرض أي بيانات حساسة في الـ HTML العام.
- **النماذج العامة:** تجمع فقط الاسم ورقم التواصل وتفاصيل الطلب؛ لا مستندات ولا بيانات حساسة — المستندات تُتبادل عبر القنوات الآمنة المعتمدة من المكتب.
- **RLS (اختياري):** لا حاجة لسياسات Row Level Security لأن قاعدة البيانات غير مكشوفة للمتصفح. إذا انتقلت لاحقاً إلى Supabase وفضّحت الجداول عبر `anon key`، فعّل RLS كما يلي:

```sql
alter table services enable row level security;
alter table offers enable row level security;
alter table bus_companies enable row level security;
alter table faqs enable row level security;
alter table testimonials enable row level security;
alter table benefits enable row level security;
alter table stats enable row level security;
alter table home_sections enable row level security;

create policy "public read services" on services for select using (is_active = true);
create policy "public read offers" on offers for select using (is_active = true);
-- الجداول الحساسة (booking_requests, contact_messages, admin_users, site_settings, media_files)
-- تبقى بلا سياسات عامة: لا يصلها أحد إلا عبر role الخدمة (service_role).
```

---

## 7) تدفق طلبات الحجز

1. الزائر يملأ نموذج الطلب (باص / طيران / تأشيرة / عمرة / خدمة).
2. `POST /api/public/bookings` يتحقق من المدخلات ويُنشئ رقم طلب فريد (مثل `EJ-20260310-A1B2`) ويحفظه في `booking_requests` بحالة **جديد**.
3. الواجهة تعرض رسالة نجاح تحتوي رقم الطلب.
4. يُفتح واتساب المكتب برسالة جاهزة تتضمن كل بيانات الطلب.
5. الطلب يظهر فوراً في `/admin/requests` لمتابعته وتغيير حالته (جديد → قيد المتابعة → تم التواصل → مكتمل / ملغي).

> **مهم:** الطلب لا يُعتبر حجزاً مؤكداً. لا يوجد أي اتصال بنظام حجز خارجي، والتأكيد يتم من المكتب بعد مراجعة التوفر. لا تعرض لوحة التحكم ولا الموقع أي «حجز مؤكد» تلقائياً، ولا تُخترع أسعار أو مواعيد أو مسارات غير مؤكدة — عند عدم تحديد سعر يظهر: «تواصل معنا لمعرفة السعر».

---

## 8) SEO

- `metadata` ديناميكية من قاعدة البيانات (العنوان، الوصف، الكلمات المفتاحية، OG/Twitter، الأيقونة).
- بيانات منظمة `TravelAgency` + `LocalBusiness` (JSON-LD) في تخطيط الموقع.
- `sitemap.xml` يتضمن الصفحات الثابتة + كل خدمة + كل عرض.
- `robots.txt` يسمح بالزحف ويمنع `/admin` و `/api/`.
- نصوص بديلة (`alt`) لكل الصور، وروابط واضحة لكل خدمة وعرض.

---

## 9) النشر وربط الدومين

### أ) على Vercel (الأسهل)
1. ارفع المشروع إلى مستودع Git ثم `Import Project` في Vercel.
2. أضف متغيرات البيئة: `DATABASE_URL`, `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `SITE_URL`.
3. استخدم PostgreSQL مُدار (Supabase / Neon / Railway) في `DATABASE_URL`.
4. نفّذ `npx drizzle-kit push` مرة واحدة على قاعدة الإنتاج.
5. للصور: يُنصح بتعيين `UPLOAD_DIR` إلى مسار دائم، أو استخدام قرص دائم (Railway/Fly.io) لأن Vercel بلا نظام ملفات دائم — في هذه الحالة استبدل `src/lib/storage.ts` بمزود تخزين مثل Supabase Storage أو Cloudflare R2 (نفس الواجهة: `saveUpload` و `readStoredFile`).
6. اربط الدومين من إعدادات المشروع وأضف سجلات DNS (`A` أو `CNAME`) كما يعرضها Vercel، ثم حدّث `SITE_URL`.

### ب) على خادم خاص / VPS
```bash
npm ci
npx drizzle-kit push --config=drizzle.config.json
npm run build
pm2 start npm --name essam-aljassim -- run start   # أو systemd
```
ثم عكس بروكسي Nginx على المنفذ 3000 مع تفعيل HTTPS عبر Certbot، وربط الدومين بسجل `A` ي指向 IP الخادم.

```nginx
server {
  server_name www.example.com;
  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
  client_max_body_size 8m;
}
```
> `client_max_body_size 8m` ضروري لرفع الصور.

---

## 10) قائمة تحقق نهائية

- [x] جميع روابط التواصل تعمل: `tel:+967781808012`، `https://wa.me/967781808012`، فيسبوك، تيك توك، خرائط Google.
- [x] نماذج الطلبات تُحفظ فعلياً في قاعدة البيانات وتظهر في لوحة التحكم.
- [x] تسجيل دخول آمن للمدير، ولا حسابات عامة.
- [x] إضافة/تعديل/حذف/إخفاء الخدمات والعروض وشركات الباصات والأسئلة والآراء.
- [x] رفع واستبدال الصور وحذفها من مكتبة الوسائط.
- [x] كل إعدادات الموقع (الألوان، الشعار، SEO، نافذة واتساب، حقوق النشر) قابلة للتعديل.
- [x] زر واتساب عائم + نافذة منبثقة أنيقة تظهر بعد وقت محدد وقابلة للإغلاق والتفعيل/التعطيل.
- [x] تصميم متجاوب بالكامل (جوال / تابلت / كمبيوتر) وRTL مع حركات انتقال خفيفة.
- [x] لا تقييمات وهمية ولا أسعار ولا مسارات ولا مواعيد غير مؤكدة.
