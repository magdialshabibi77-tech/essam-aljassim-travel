import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative grid min-h-screen place-items-center navy-mesh px-4 text-center text-white">
      <div className="absolute inset-0 pattern-arabesque opacity-30" aria-hidden="true" />
      <div className="relative">
        <p className="font-display text-6xl font-extrabold text-gold">404</p>
        <h1 className="mt-4 font-display text-2xl font-extrabold">الصفحة غير موجودة</h1>
        <p className="mt-3 text-[14px] text-white/70">
          يبدو أن الرابط الذي تبحث عنه غير متوفر. يمكنك العودة إلى الصفحة الرئيسية أو التواصل معنا مباشرة.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="btn btn-gold">
            الصفحة الرئيسية
          </Link>
          <Link href="/services" className="btn btn-ghost-light">
            استعرض الخدمات
          </Link>
        </div>
      </div>
    </div>
  );
}
