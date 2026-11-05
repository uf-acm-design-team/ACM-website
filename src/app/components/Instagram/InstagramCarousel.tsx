"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { InstagramPost } from "@/data/instagram";

type CarouselState = {
  /** Number of scroll stops (one per arrow click, last one = scrolled to the end). */
  count: number;
  index: number;
  atStart: boolean;
  atEnd: boolean;
};

/** One "step" = one card width + the track gap. */
function getStep(track: HTMLElement): number {
  const card = track.firstElementChild as HTMLElement | null;
  if (!card) return 0;
  const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
  return card.offsetWidth + gap;
}

function measure(track: HTMLElement): CarouselState {
  const step = getStep(track);
  const max = track.scrollWidth - track.clientWidth;
  const left = track.scrollLeft;
  if (step <= 0 || max <= 1) return { count: 1, index: 0, atStart: true, atEnd: true };

  const count = Math.ceil(max / step - 0.01) + 1;
  const atEnd = left >= max - 1;
  const index = atEnd ? count - 1 : Math.min(count - 1, Math.round(left / step));
  return { count, index, atStart: left <= 1, atEnd };
}

function scrollBehavior(): ScrollBehavior {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
}

function PictureIcon() {
  // 44×36 outline picture icon (frame, sun, two hills), paths from the Figma SVG export.
  return (
    <svg
      viewBox="0 0 44 36"
      aria-hidden="true"
      focusable="false"
      className="h-9 w-11 fill-none stroke-border-subtle"
      strokeWidth="1.5"
    >
      <rect x="2" y="2" width="40" height="32" rx="5" />
      <circle cx="31" cy="11" r="3" />
      <path d="M3 26L14 15L28 30M25 25L31 19L42 30" strokeLinejoin="round" />
    </svg>
  );
}

// Arrow icons from the Figma SVG export, drawn in the 56×56 button box.
const ARROW_PATHS = {
  previous:
    "M36.99 29.148H22.02L29.56 36.246L28.15 37.676L18.79 28.654V27.51L28.15 18.514L29.53 19.918L21.94 27.094H36.99V29.148Z",
  next: "M18.97 29.148V27.094H34.03L26.44 19.918L27.81 18.514L37.17 27.51V28.654L27.81 37.676L26.41 36.246L33.95 29.148H18.97Z",
} as const;

function ArrowIcon({ direction }: { direction: keyof typeof ARROW_PATHS }) {
  // The button's 1px border sits inside its 56px box, so the icon is pulled out by 1px to keep
  // Figma's coordinates aligned with the button's outer edge.
  return (
    <svg
      viewBox="0 0 56 56"
      aria-hidden="true"
      focusable="false"
      className="-m-px size-14 shrink-0 fill-muted"
    >
      <path d={ARROW_PATHS[direction]} />
    </svg>
  );
}

type InstagramCarouselProps = {
  posts: InstagramPost[];
  placeholderLabel: string;
  swipeHint: string;
  previousLabel: string;
  nextLabel: string;
};

export default function InstagramCarousel({
  posts,
  placeholderLabel,
  swipeHint,
  previousLabel,
  nextLabel,
}: InstagramCarouselProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [state, setState] = useState<CarouselState>({
    count: 1,
    index: 0,
    atStart: true,
    atEnd: false,
  });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setState(measure(track)));
    };

    track.addEventListener("scroll", update, { passive: true });
    // Fires once on observe (initial measurement) and again whenever the track resizes.
    const observer = new ResizeObserver(update);
    observer.observe(track);

    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [posts.length]);

  const scrollByStep = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * getStep(track), behavior: scrollBehavior() });
  };

  const arrowClass =
    "flex size-14 items-center justify-center rounded-full border border-border-subtle bg-surface transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocean disabled:cursor-default disabled:opacity-40";

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <ul
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {posts.map((post) => (
          <li key={post.id} className="w-[80%] shrink-0 snap-start sm:w-[42%] lg:w-[400px]">
            <a
              href={post.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={post.alt}
              className="relative flex aspect-square flex-col items-center justify-center gap-4 overflow-hidden rounded-xl border border-border-subtle bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocean"
            >
              {post.image ? (
                <Image
                  src={post.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 400px, (min-width: 640px) 42vw, 80vw"
                  className="object-cover"
                />
              ) : (
                <>
                  <PictureIcon />
                  <span className="font-body text-base leading-6 text-muted">{placeholderLabel}</span>
                </>
              )}
            </a>
          </li>
        ))}
      </ul>

      {/* Touch-size screens (820 / 402 frames): swipe hint instead of controls. */}
      <p className="font-body text-base leading-6 text-muted lg:hidden">
        {swipeHint} <span aria-hidden="true">→</span>
      </p>

      {/* Desktop controls: progress + previous/next. */}
      <div className="hidden items-center justify-between gap-6 lg:flex">
        <div aria-hidden="true" className="flex gap-4">
          {Array.from({ length: state.count }, (_, i) => (
            <span key={i} className="flex h-11 w-12 items-center">
              <span
                className={`h-0.5 w-full transition-colors ${i === state.index ? "bg-ocean" : "bg-indigo"}`}
              />
            </span>
          ))}
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            aria-label={previousLabel}
            disabled={state.atStart}
            onClick={() => scrollByStep(-1)}
            className={arrowClass}
          >
            <ArrowIcon direction="previous" />
          </button>
          <button
            type="button"
            aria-label={nextLabel}
            disabled={state.atEnd}
            onClick={() => scrollByStep(1)}
            className={arrowClass}
          >
            <ArrowIcon direction="next" />
          </button>
        </div>
      </div>
    </div>
  );
}
