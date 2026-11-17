import { HERO, type HeroButton, type HeroContent } from "@/data/hero";
import Image from "next/image";
import HeroOcean from "./HeroOcean";
import "./hero.css";

type HeroProps = {
  content?: HeroContent;
};

// Staggered text entrance: a slow, soft drop. Only runs when reduced motion is off.
const rise =
  "motion-safe:animate-[hero-drop_1400ms_cubic-bezier(0.16,1,0.3,1)_both] motion-safe:will-change-[transform,opacity,filter]";

const baseButton = "inline-flex items-center gap-4 rounded-sm font-sans text-base font-medium";

const buttonVariants: Record<HeroButton["variant"], string> = {
  primary: "h-14 w-[192px] justify-between px-6 py-4 bg-black text-white",
  secondary: "h-14 w-[264px] justify-center px-6 py-4 border-[1.5px] border-border bg-surface text-navy",
};

function ArrowIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.9"
      aria-hidden="true"
    >
      <path d="M4 10L10 4M5 4h5v5" />
    </svg>
  );
}

export default function Hero({ content = HERO }: HeroProps) {
  const { titleLines, tagline, buttons } = content;

  return (
    <section className="relative isolate flex min-h-[125vh] flex-col items-center justify-start overflow-hidden px-4 pt-[22vh] text-center">
      <div
        aria-hidden="true"
        data-hero-wave
        className="pointer-events-none absolute -inset-x-[34%] inset-y-0 -z-10"
      >
        <Image
          src="/hero/wave.svg"
          alt=""
          fill
          preload
          unoptimized
          className="object-fill"
        />
      </div>
      <HeroOcean />

      <h1 className="relative z-10 font-display text-[90px] font-medium leading-[82px] tracking-[-0.03em] text-center text-navy">
        {titleLines.map((line, i) => (
          <span
            key={line}
            className={`block ${rise}`}
            style={{ animationDelay: `${150 + i * 180}ms` }}
          >
            {line}
          </span>
        ))}
      </h1>

      <p
        data-hero-obstacle
        className={`relative z-10 mt-3 max-w-3xl text-balance font-sans text-[28px] font-medium leading-[38px] tracking-normal text-center text-navy ${rise} [animation-delay:550ms]`}
      >
        {tagline.before}
        <strong className="font-semibold">{tagline.highlight}</strong>
        {tagline.after}
      </p>

      <div className={`relative z-10 mt-6 flex flex-wrap justify-center gap-3 ${rise} [animation-delay:750ms]`}>
        {buttons.map((button) => (
          <a
            key={button.label}
            href={button.href}
            target="_blank"
            rel="noopener noreferrer"
            data-hero-obstacle
            className={`${baseButton} ${buttonVariants[button.variant]}`}
          >
            {button.label}
            <ArrowIcon />
          </a>
        ))}
      </div>
    </section>
  );
}
