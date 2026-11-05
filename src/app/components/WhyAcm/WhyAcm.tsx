import Image, { type StaticImageData } from "next/image";
import { DM_Sans, Space_Grotesk } from "next/font/google";

const headingFont = Space_Grotesk({ subsets: ["latin"], weight: "500" });
const bodyFont = DM_Sans({ subsets: ["latin"], weight: "400" });

export type WhyAcmCard = {
  title: string;
  caption: string;
  image: string | StaticImageData;
  /** Describe the actual photograph, rather than repeating the title. */
  alt: string;
};

export type WhyAcmProps = {
  heading: string;
  intro: string;
  /** Order: Fishbowl Fridays (wide), Club Projects, Club Life. */
  cards: readonly [WhyAcmCard, WhyAcmCard, WhyAcmCard];
};

/**
 * Figma desktop: 1440px frame, 1312px content, 592/336/336px cards.
 * Scoped token defaults mirror Figma until the shared theme includes them.
 * The surrounding About section owns the page's atmospheric background.
 */
export default function WhyAcm({ heading, intro, cards }: WhyAcmProps) {
  return (
    <section
      className={`${bodyFont.className} mx-auto w-full max-w-360 px-6 pb-16 md:px-10 lg:px-(--acm-space-64) lg:pb-24 [--acm-space-16:16px] [--acm-space-24:24px] [--acm-space-64:64px] [--acm-radius-card:12px] [--acm-palette-navy:rgb(11_21_51)] [--acm-light-muted:rgb(89_96_115)] [--acm-light-border:rgb(215_216_228)] [--acm-light-surface:rgb(246_249_255)]`}
    >
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-(--acm-space-64)">
        <h2
          className={`${headingFont.className} text-3xl leading-[1.12] font-medium tracking-[-0.02em] text-(--acm-palette-navy) lg:text-[44px]`}
        >
          {heading}
        </h2>
        <p className="text-base leading-[1.45] text-(--acm-light-muted) lg:text-[19px]">
          {intro}
        </p>
      </div>

      <div className="mt-10 grid gap-(--acm-space-24) md:grid-cols-2 lg:mt-(--acm-space-64) lg:grid-cols-[minmax(0,37fr)_minmax(0,21fr)_minmax(0,21fr)]">
        {cards.map((card, index) => (
          <article
            key={card.title}
            className={`flex min-w-0 flex-col gap-(--acm-space-16) ${index === 0 ? "md:col-span-2 lg:col-span-1" : ""}`}
          >
            <div className="relative h-64 w-full overflow-hidden rounded-(--acm-radius-card) border border-(--acm-light-border) bg-(--acm-light-surface) md:h-80 lg:h-90">
              <Image
                src={card.image}
                alt={card.alt}
                fill
                sizes={
                  index === 0
                    ? "(min-width: 1440px) 592px, (min-width: 1024px) calc((100vw - 176px) * 37 / 79), (min-width: 768px) calc(100vw - 80px), calc(100vw - 48px)"
                    : "(min-width: 1440px) 336px, (min-width: 1024px) calc((100vw - 176px) * 21 / 79), (min-width: 768px) calc((100vw - 104px) / 2), calc(100vw - 48px)"
                }
                className="object-cover"
              />
            </div>
            <h3
              className={`${headingFont.className} text-2xl leading-[1.45] font-medium tracking-[-0.01em] text-(--acm-palette-navy)`}
            >
              {card.title}
            </h3>
            <p className="text-base leading-6 text-(--acm-light-muted)">
              {card.caption}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
