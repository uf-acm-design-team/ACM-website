import Image from "next/image";
import type { InstagramContent } from "@/data/instagram";
import InstagramCarousel from "./InstagramCarousel";

// Values from the Figma frame "ACM — Consolidated Final / Light", section "06 Instagram".

function InstagramGlyph() {
  // 20×20 outline logo: rounded square, lens, and flash dot (geometry from the Figma SVG export).
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      focusable="false"
      className="size-5 shrink-0 fill-none stroke-ultraviolet"
    >
      <rect x="2.143" y="2.143" width="15.714" height="15.714" rx="4.286" strokeWidth="2" />
      <circle cx="10" cy="10" r="3.786" strokeWidth="2" />
      <circle cx="14.571" cy="5.571" r="1" className="fill-ultraviolet" stroke="none" />
    </svg>
  );
}

// ACM fish mark, path exported from Figma (128 × 50.64). Color comes from the className.
function AcmFish({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 128 50.6374" aria-hidden="true" focusable="false" className={className}>
      <path d="M0 25.7224C4.07124 17.2306 18.6137 0.197686 44.2137 0.001719C69.8137 -0.194248 85.3331 16.414 89.8933 24.7426C93.3943 17.9654 105.918 3.52913 128 0.001719L111.634 45.0742C106.422 42.6246 94.7784 35.1289 89.8933 24.7426C84.0306 34.2144 66.687 52.619 44.2137 50.4634C21.7404 48.3077 5.37404 33.0713 0 25.7224Z" />
    </svg>
  );
}

type InstagramProps = {
  content: InstagramContent;
};

export default function Instagram({ content }: InstagramProps) {
  const { heading, subtext, followLabel, profile, posts } = content;

  return (
    <section
      id="instagram"
      aria-labelledby="instagram-heading"
      className="scroll-mt-20 px-5 pb-14 sm:px-10 xl:px-16 xl:pb-20"
    >
      {/* Top padding lives inside the wrapper so its border is Figma's 1312-wide section hairline. */}
      <div className="mx-auto flex max-w-[1312px] flex-col gap-6 border-t border-border-subtle pt-16 sm:gap-8 sm:pt-20 xl:pt-24">
        <header className="flex flex-col gap-3 sm:gap-4">
          <h2
            id="instagram-heading"
            className="font-display text-[36px] leading-[1.12] font-medium tracking-[-0.02em] text-navy sm:text-[44px] xl:text-[52px]"
          >
            {heading}
          </h2>
          <p className="max-w-[720px] font-body text-base leading-6 text-muted sm:text-[19px] sm:leading-[1.45]">
            {subtext}
          </p>
        </header>

        {/* Profile card */}
        <div className="flex items-center gap-4 rounded-xl bg-surface p-4 sm:min-h-[120px] sm:gap-5 sm:p-6">
          {profile.avatar ? (
            <Image
              src={profile.avatar}
              alt=""
              width={64}
              height={64}
              className="size-12 shrink-0 rounded-full object-cover sm:size-16"
            />
          ) : (
            <span
              aria-hidden="true"
              className="flex size-12 shrink-0 items-center justify-center rounded-full bg-ultraviolet sm:size-16"
            >
              <AcmFish className="w-[60%] fill-white" />
            </span>
          )}

          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <p className="font-display text-[22px] leading-[1.12] font-medium tracking-[-0.01em] text-navy sm:text-[28px]">
              {profile.name}
            </p>
            <p className="flex items-center gap-2 font-body text-sm leading-6 text-muted sm:text-base">
              <InstagramGlyph />
              <span className="truncate">
                @{profile.handle}
                {/* The 820/402 frames show only the handle. */}
                <span className="hidden md:inline"> · {profile.subtitle}</span>
              </span>
            </p>
          </div>

          <a
            href={profile.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-instagram px-5 font-body text-base leading-6 font-medium text-white sm:w-28 sm:px-0"
          >
            {followLabel}
          </a>
        </div>

        <InstagramCarousel
          posts={posts}
          placeholderLabel={content.placeholderLabel}
          swipeHint={content.swipeHint}
          previousLabel={content.previousLabel}
          nextLabel={content.nextLabel}
        />
      </div>
    </section>
  );
}
