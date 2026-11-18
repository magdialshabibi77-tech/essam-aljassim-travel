import Reveal from "@/components/site/reveal";

type SectionHeadingProps = {
  kicker?: string;
  title: string;
  subtitle?: string;
  description?: string;
  align?: "center" | "start";
  tone?: "dark" | "light";
};

export default function SectionHeading({
  kicker,
  title,
  subtitle,
  description,
  align = "center",
  tone = "dark",
}: SectionHeadingProps) {
  const alignment = align === "center" ? "text-center items-center" : "text-right items-start";
  const titleColor = tone === "light" ? "text-white" : "text-navy";
  const descColor = tone === "light" ? "text-white/75" : "text-navy/70";
  const kickerColor = tone === "light" ? "text-gold" : "text-primary/80";

  return (
    <Reveal className={`flex flex-col ${alignment} gap-3`}>
      {kicker ? (
        <span
          className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-wider ${kickerColor} ${
            tone === "light" ? "bg-white/10 ring-1 ring-white/20" : "bg-gold/12 ring-1 ring-gold/30"
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          {kicker}
        </span>
      ) : null}
      {subtitle ? (
        <p className={`text-sm font-bold ${tone === "light" ? "text-gold" : "text-primary/70"}`}>
          {subtitle}
        </p>
      ) : null}
      <h2
        className={`font-display text-3xl font-extrabold leading-[1.25] sm:text-4xl lg:text-[2.6rem] ${titleColor}`}
      >
        {title}
      </h2>
      {description ? (
        <p className={`max-w-2xl text-[15px] leading-relaxed ${descColor}`}>{description}</p>
      ) : null}
      <span className={`h-[3px] w-24 rounded-full bg-gradient-to-r from-gold to-transparent ${align === "center" ? "" : "mr-0"}`} />
    </Reveal>
  );
}
