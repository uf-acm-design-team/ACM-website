import Image from "next/image";
import type { AboutContent, AboutLabelId } from "@/data/about";
// Exported from Figma ("Fishbowl / Dimensional, matte shading", Consolidated Final / Light).
// It is a design asset, so its illustration colors live in the file rather than as tokens.
import fishbowl from "./fishbowl.svg";

/*
 * Desktop (xl+) values come from the Figma frame "ACM — Consolidated Final / Light":
 * a 1148×400 row = left column 320 · gap 48 · bowl 412×400 · gap 48 · right column 320.
 * Columns are vertically centered with 48px between labels → titles at y 78 and 236.
 * The row is fixed-size at xl (1280 − 2×64 = 1152 ≥ 1148), so positions are exact px.
 */
const LABEL_POSITION: Record<AboutLabelId, string> = {
  guide: "xl:left-0 xl:top-[78px]",
  prepare: "xl:left-0 xl:top-[236px]",
  engage: "xl:left-[828px] xl:top-[78px]",
  location: "xl:left-[828px] xl:top-[236px]",
};

// Figma sets the long "Malachowsky Hall · Room 2100" title smaller (22px) than the others (26px).
const TITLE_SIZE: Record<AboutLabelId, string> = {
  guide: "xl:text-[26px]",
  prepare: "xl:text-[26px]",
  engage: "xl:text-[26px]",
  location: "",
};

/*
 * Connectors in row coordinates (viewBox 0 0 1148 400), matching Figma's connector
 * bounding boxes. `start` = small dot by the label (r 2.5), `end` = dot on the bowl (r 3.5).
 */
const CONNECTORS: Record<
  AboutLabelId,
  { d: string; start: [number, number]; end: [number, number] }
> = {
  guide: {
    d: "M247 201.5C295.7 192.6 344.4 192.6 393.1 201.5",
    start: [247, 201.5],
    end: [393.1, 201.5],
  },
  prepare: {
    d: "M227 335.5C213.35 388.01 330 388.01 395.15 335.5",
    start: [227, 335.5],
    end: [395.15, 335.5],
  },
  engage: {
    d: "M804 140C792 142 780 152 773 164",
    start: [804, 140],
    end: [773, 164],
  },
  location: {
    d: "M804 288C780 288 752 326.55 732.42 318.5",
    start: [804, 288],
    end: [732.42, 318.5],
  },
};

type AboutProps = {
  content: AboutContent;
};

export default function About({ content }: AboutProps) {
  const { heading, body, bowlAlt, labels } = content;

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="scroll-mt-20 px-6 pt-8 pb-12 sm:px-10 sm:pt-10 xl:px-16 xl:pt-24 xl:pb-24"
    >
      <div className="mx-auto max-w-[1312px]">
        <h2
          id="about-heading"
          className="font-display text-[40px] leading-[46px] font-medium tracking-[-2px] text-navy xl:text-center xl:text-[52px] xl:leading-[60px] xl:tracking-[-0.02em]"
        >
          {heading}
        </h2>
        <p className="mx-auto mt-8 text-center font-body text-base leading-6 text-muted xl:mt-5 xl:max-w-[820px] xl:text-[20px] xl:leading-[30px]">
          {body}
        </p>

        {/* Bowl + labels. Stacked below xl; a fixed 1148×400 row at xl+. */}
        <div className="relative mt-10 sm:mt-9 xl:mx-auto xl:mt-16 xl:h-[400px] xl:w-[1148px]">
          <svg
            viewBox="0 0 1148 400"
            aria-hidden="true"
            focusable="false"
            className="pointer-events-none absolute inset-0 hidden h-full w-full overflow-visible opacity-[0.48] xl:block"
          >
            {labels.map(({ id }) => {
              const c = CONNECTORS[id];
              return (
                <g key={id} className="fill-indigo stroke-indigo">
                  <path
                    d={c.d}
                    fill="none"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeDasharray="3 4"
                  />
                  <circle cx={c.start[0]} cy={c.start[1]} r="2.5" stroke="none" />
                  <circle cx={c.end[0]} cy={c.end[1]} r="3.5" stroke="none" />
                </g>
              );
            })}
          </svg>

          {/* 412×400 bowl box. The exported SVG is 491×456 with the box at (39.35, 17.39),
              so the image is oversized and offset to put the bowl exactly on this box. */}
          <div className="relative mx-auto aspect-[412/400] w-[300px] max-w-full sm:w-[344px] xl:absolute xl:top-0 xl:left-[368px] xl:w-[412px]">
            <Image
              src={fishbowl}
              alt={bowlAlt}
              unoptimized
              className="absolute top-[-4.348%] left-[-9.551%] h-auto w-[119.17%] max-w-none"
            />
          </div>

          <ul className="mt-12 grid grid-cols-1 gap-y-7 sm:grid-cols-2 sm:gap-x-6 xl:mt-0 xl:block">
            {labels.map(({ id, title, description }) => (
              <li key={id} className={`xl:absolute xl:w-[320px] ${LABEL_POSITION[id]}`}>
                <h3
                  className={`font-display text-[22px] leading-[30px] font-medium text-navy xl:tracking-[-0.01em] ${TITLE_SIZE[id]}`}
                >
                  {title}
                </h3>
                <p className="mt-2 font-body text-base leading-6 text-muted">{description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
