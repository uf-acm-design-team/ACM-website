import Image, { type StaticImageData } from "next/image";
import arrowLight from "./assets/arrow-light.svg";
import arrowNavy from "./assets/arrow-navy.svg";
import localCurrent from "./assets/local-current.svg";
import photoPlaceholder from "./assets/photo-placeholder.svg";

type GetInvolvedAction = {
  label: string;
  /** Null keeps an unfinished destination disabled instead of linking to #. */
  href: string | null;
};

export type GetInvolvedProps = {
  heading: string;
  description: string;
  discord: GetInvolvedAction;
  calendar: GetInvolvedAction;
  photo: { src: string | StaticImageData; alt: string } | null;
  photoPlaceholderLabel: string;
};

export default function GetInvolved({
  heading,
  description,
  discord,
  calendar,
  photo,
  photoPlaceholderLabel,
}: GetInvolvedProps) {
  return (
    <section className="relative isolate mx-auto w-full max-w-360 px-6 py-12 font-sans md:px-10 lg:px-16 lg:py-24">
      <div aria-hidden="true" className="absolute inset-x-6 top-0 h-px bg-border md:inset-x-10 lg:inset-x-16" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <Image src={localCurrent} alt="" width={620} height={470} className="absolute top-86.5 -left-10 hidden max-w-none lg:block" />
      </div>

      {/* Figma: 1312 × 560 photo band; 500px panel inset 40px. */}
      <div className="relative isolate overflow-hidden rounded-[20px] bg-surface ring-1 ring-border lg:h-140">
        {photo ? (
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(min-width: 1440px) 1312px, (min-width: 1024px) calc(100vw - 128px), (min-width: 768px) calc(100vw - 80px), calc(100vw - 48px)"
            className="-z-10 object-cover object-right"
          />
        ) : (
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,var(--color-sky)_0%,transparent_70%)] opacity-[0.055]" aria-hidden="true" />
        )}

        <div className="relative flex h-60 items-center justify-center lg:absolute lg:inset-0 lg:h-auto">
          {!photo && (
            <div className="flex flex-col items-center gap-4 text-center text-base leading-6 text-placeholder">
              <Image src={photoPlaceholder} alt="" width={44} height={36} />
              <p>{photoPlaceholderLabel}</p>
            </div>
          )}
        </div>

        <div className="relative m-4 flex flex-col items-start gap-5 rounded-2xl border border-border bg-surface/98 px-6 py-8 shadow-[0_8px_24px_0_var(--color-navy)] shadow-navy/8 sm:m-10 sm:px-8 sm:py-10 lg:absolute lg:bottom-10 lg:left-10 lg:m-0 lg:w-125">
          <h2 className="font-display text-3xl leading-tight font-medium tracking-[-0.02em] text-navy lg:text-[44px] lg:leading-[51px]">
            {heading}
          </h2>
          <p className="text-lg leading-[27px] text-muted">{description}</p>
          <div className="flex w-full flex-wrap gap-3">
            {([discord, calendar] as const).map((action, index) => {
              const className = `inline-flex h-14 max-w-full shrink-0 items-center gap-4 rounded-lg px-6 py-4 text-base leading-[1.4] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent ${index === 0 ? "w-45 justify-between bg-navy text-background hover:bg-navy/90" : "w-55 border-[1.5px] border-border bg-background text-navy hover:bg-surface-muted"}`;
              const content = (
                <>
                  <span>{action.label}</span>
                  <Image src={index === 0 ? arrowLight : arrowNavy} alt="" width={20} height={20} className="shrink-0" />
                </>
              );

              return action.href ? (
                <a key={index} href={action.href} className={className}>
                  {content}
                </a>
              ) : (
                <button key={index} type="button" disabled className={`${className} cursor-not-allowed`}>
                  {content}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
