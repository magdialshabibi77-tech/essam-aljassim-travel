type LogoProps = {
  name: string;
  tagline?: string;
  logoUrl?: string;
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
};

export default function Logo({ name, tagline, logoUrl, variant = "dark", size = "md" }: LogoProps) {
  const titleSize = size === "lg" ? "text-xl sm:text-2xl" : size === "sm" ? "text-base" : "text-lg";
  const markSize = size === "lg" ? "h-14 w-14" : size === "sm" ? "h-9 w-9" : "h-11 w-11";

  if (logoUrl) {
    return (
      <span className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoUrl}
          alt={`شعار ${name}`}
          className={`${markSize} rounded-2xl object-contain`}
        />
        <span className="flex flex-col leading-tight">
          <span
            className={`font-display font-extrabold ${titleSize} ${
              variant === "light" ? "text-white" : "text-navy"
            }`}
          >
            {name}
          </span>
          {tagline ? (
            <span className={`text-[11px] font-semibold ${variant === "light" ? "text-gold" : "text-primary/70"}`}>
              {tagline}
            </span>
          ) : null}
        </span>
      </span>
    );
  }

  return (
    <span className="flex items-center gap-3">
      <span
        className={`${markSize} relative grid place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-navy to-[#061527] shadow-lg`}
        aria-hidden="true"
      >
        <span className="absolute inset-0 pattern-arabesque opacity-60" />
        <svg viewBox="0 0 48 48" className="relative h-[62%] w-[62%]" fill="none">
          <circle cx="24" cy="24" r="14" stroke="#c9a227" strokeWidth="2.4" />
          <path
            d="M10 24h28M24 10c5 4 5 24 0 28M24 10c-5 4-5 24 0 28"
            stroke="#c9a227"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M27 20l11-6-3.4 9.8L27 28l3-4-3-4z"
            fill="#f4e7bb"
            stroke="#c9a227"
            strokeWidth="1.2"
          />
        </svg>
        <span className="absolute -bottom-3 h-4 w-14 rounded-full bg-gold/40 blur-md" />
      </span>
      <span className="flex flex-col leading-tight">
        <span
          className={`font-display font-extrabold ${titleSize} ${
            variant === "light" ? "text-white" : "text-navy"
          }`}
        >
          {name}
        </span>
        {tagline ? (
          <span
            className={`text-[11px] font-semibold tracking-wide ${
              variant === "light" ? "text-gold" : "text-primary/70"
            }`}
          >
            {tagline}
          </span>
        ) : null}
      </span>
    </span>
  );
}
