import {HERO, type HeroButton, type HeroContent} from "@/data/hero";
import Image from "next/image";
import { DM_Sans, Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["500", "600"] });

type HeroProps = {
  content?: HeroContent;
};

const baseButton = `${dmSans.className} inline-flex items-center gap-4 rounded-sm text-base font-medium`;

const buttonVariants: Record<HeroButton["variant"], string> = { primary: "h-14 w-[192px] justify-between px-6 py-4 bg-black text-white",
   secondary: "h-14 w-[264px] justify-center px-6 py-4 border-[1.5px] border-border bg-white text-navy", };


function ArrowIcon() {
  return (
    <svg 
    width ="20"
    height="20"
    viewBox="0 0 14 14"
    fill="none"
    stroke="currentColor"
    strokeWidth = "0.9"
    aria-hidden="true"
    >
      <path d = "M4 10L10 4M5 4h5v5"
/>
    </svg>
  );
}

export default function Hero({ content = HERO }: HeroProps) {
  const { titleLines, tagline, buttons } = content;

  return (

    <section className = "relative flex min-h-[125vh] flex-col items-center justify-start overflow-hidden px-4 pt-[22vh] text-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-[34%] inset-y-0 -z-10"
      >
        <Image
          src="/hero/wave.svg"
          alt=""
          fill
          priority
          unoptimized
          className="object-fill"
        />
      </div>

      <h1 className = {`${spaceGrotesk.className} relative z-10 text-[90px] font-medium leading-[82px] tracking-[-0.03em] text-center text-navy`}>
        {titleLines.map((line) => (
          <span key={line} 
          className = "block">
             {line}
          </span>
        ))}
      </h1>



      <p className = {`${dmSans.className} relative z-10 mt-3 max-w-3xl text-balance text-[28px] font-medium leading-[38px] tracking-normal text-center text-navy`}>
        {tagline.before}
        <strong className = "font-semibold">{tagline.highlight}

        </strong>
        {tagline.after}
      </p>

      <div className = "relative z-10 mt-6 flex flex-wrap justify-center gap-3">
        {buttons.map((button) => (

    
        <a
        key = {button.label}
        href = {button.href}
        target = "_blank"
        rel = "noopener noreferrer"

        className = {` ${baseButton} ${buttonVariants[button.variant]}`}
        >
          {button.label}
          <ArrowIcon/>
        </a>
        ))}
      </div>
    </section>
  );
}
