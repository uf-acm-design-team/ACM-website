import Image from "next/image";

export type SponsorLogo = {
  name: string;
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type SponsorsProps = {
  heading: string;
  description: string;
  action: { label: string; href: string | null };
  /** Figma order: Accenture, Bloomberg, Datadog, Roblox. */
  logos: readonly [SponsorLogo, SponsorLogo, SponsorLogo, SponsorLogo];
};

// Different internal whitespace in each SVG requires optical alignment.
const logoPlacement = ["lg:pt-[38.5px]", "lg:pt-[69.7px]", "lg:pt-[23.79px]", "lg:pt-0"] as const;

export default function Sponsors({ heading, description, action, logos }: SponsorsProps) {
  const actionClassName = "inline-flex h-10 w-[194px] shrink-0 items-center justify-between rounded-lg border border-border bg-background px-5 text-base leading-[1.4] font-medium text-navy focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent";
  const actionContent = (
    <>
      <span className="whitespace-nowrap">{action.label}</span>
      <Image src="/sponsors/arrow-navy.svg" alt="" width={20} height={20} className="shrink-0" />
    </>
  );

  return (
    <section id="sponsors" aria-labelledby="sponsors-heading" className="relative mx-auto w-full max-w-360 scroll-mt-24 pt-10 pb-8 font-sans">
      <div aria-hidden="true" className="absolute inset-x-6 top-0 h-px bg-border md:inset-x-10 lg:inset-x-16" />
      <div className="flex flex-wrap items-center gap-5 px-6 md:px-10 lg:h-10 lg:px-16">
        <h2 id="sponsors-heading" className="font-sans text-base leading-6 font-medium text-muted">{heading}</h2>
        {action.href ? (
          <a href={action.href} className={`${actionClassName} hover:bg-surface-muted`}>{actionContent}</a>
        ) : (
          <button type="button" disabled className={`${actionClassName} cursor-not-allowed`}>{actionContent}</button>
        )}
        <p className="text-base leading-6 text-muted">{description}</p>
      </div>
      <div className="relative mt-4 overflow-hidden lg:h-[165px] lg:mask-[url('/sponsors/strip-mask.svg')] lg:mask-size-[100%_165px] lg:mask-no-repeat">
        <div aria-hidden="true" className="absolute inset-x-6 top-0.5 h-px bg-border lg:left-[1.8056%] lg:w-[93.9346%] lg:h-[1.164px]" />
        <ul className="mx-auto grid max-w-[1173px] grid-cols-2 items-center gap-x-8 gap-y-6 px-6 py-6 md:px-10 lg:h-42 lg:grid-cols-[284fr_284fr_183fr_284fr] lg:items-start lg:gap-x-[46px] lg:px-0 lg:py-0">
          {logos.map((logo, index) => (
            <li key={logo.name} className={`flex min-w-0 items-center justify-center lg:items-start ${logoPlacement[index]}`}>
              <Image src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} className="h-auto max-w-full" />
            </li>
          ))}
        </ul>
        <div aria-hidden="true" className="absolute inset-x-6 bottom-0.5 h-px bg-border lg:top-[162px] lg:bottom-auto lg:left-[1.8056%] lg:w-[93.9346%] lg:h-[1.164px]" />
      </div>
    </section>
  );
}
