import type { CSSProperties } from "react";

// The tab is built from two pieces so it can shrink without distorting:
// a flexible left part (rounded corner + top edge) and a fixed-width slant on the right.
//
// There are two sizes. Projects.tsx renders both and shows one with CSS:
// "compact" below lg (shorter tabs for phones and tablets), "full" from lg up (the desktop design).
const SIZES = {
  full: { height: 60, slant: 70, radius: 16 },
  compact: { height: 47, slant: 55, radius: 12 },
};
export type TabSize = keyof typeof SIZES;

// The fill runs 2px past the tab's bottom so it fully covers the panel's top border,
// even when the browser blurs edges at fractional pixel sizes. The outline stroke stops at the tab's real bottom.
const EXTRA = 2;

// The slant curve, drawn for any size. The original design's control points sit at x = 18 and 48 of 70; scale them to fit.
function slantPaths(height: number, slant: number) {
  const x = (n: number) => (n * slant) / 70;
  return {
    fill: `M0 0C${x(18)} 0 ${x(48)} ${height} ${slant} ${height}V${height + EXTRA}H0Z`,
    stroke: `M0 0.5C${x(18)} 0.5 ${x(48)} ${height - 0.5} ${slant} ${height - 0.5}`,
  };
}

// The active tab (when it isn't the first one) curves out at its bottom-left into the folder's top edge,
// like a browser tab, instead of cutting straight down. The flare sits just left of the tab, over its bottom corner.
const FLARE = 16;
// Fill: the area under the curve, plus a 1px strip over the tab's own left border, down past the bottom.
const FLARE_FILL = `M0 ${FLARE} A${FLARE} ${FLARE} 0 0 0 ${FLARE} 0 H${FLARE + 1} V${FLARE + EXTRA} H0Z`;
// Outline: from the folder's top border (y = 15.5) up to the tab's left border (x = 16.5).
const FLARE_STROKE = `M0 ${FLARE - 0.5} A${FLARE + 0.5} ${FLARE - 0.5} 0 0 0 ${FLARE + 0.5} 0`;

type TabShapeProps = {
  size: TabSize;
  // Tailwind display classes that decide at which screen sizes this shape shows, e.g. "flex lg:hidden".
  display: string;
  active: boolean;
  // How far this tab sits from the folder's left edge, as a CSS length (used to line up the gradient).
  offset: string;
  showFocus: boolean;
  // Draw the curved bottom-left flare. Only for the active tab, and not the first tab (it lines up with the folder edge).
  flareLeft: boolean;
};

export default function TabShape({ size, display, active, offset, showFocus, flareLeft }: TabShapeProps) {
  const { height, slant, radius } = SIZES[size];
  const paths = slantPaths(height, slant);

  // The active tab shows the slice of the folder gradient that sits under it.
  const gradient = "bg-linear-to-r from-folder-start via-background via-40% to-folder-end";
  const fill = active ? gradient : "bg-surface-muted";

  const leftStyle: CSSProperties = {
    borderTopLeftRadius: radius,
    ...(active && { backgroundSize: "100cqw 100%", backgroundPosition: `calc(-1 * ${offset}) 0` }),
  };
  const slantStyle: CSSProperties = {
    clipPath: `path("${paths.fill}")`,
    ...(active && {
      backgroundSize: "100cqw 100%",
      backgroundPosition: `calc(-1 * (${offset} + var(--tab-w) - ${slant}px)) 0`,
    }),
  };
  const flareStyle: CSSProperties = {
    left: -FLARE,
    top: height - FLARE,
    width: FLARE + 1,
    height: FLARE + EXTRA,
    clipPath: `path("${FLARE_FILL}")`,
    backgroundSize: "100cqw 100%",
    backgroundPosition: `calc(-1 * (${offset} - ${FLARE}px)) 0`,
  };
  const strokeColor = showFocus ? "stroke-border group-focus-visible:stroke-navy" : "stroke-border";

  return (
    <div aria-hidden="true" className={`absolute inset-x-0 top-0 ${display}`} style={{ height: height + EXTRA }}>
      <div className={`relative min-w-0 flex-1 ${fill}`} style={leftStyle}>
        {/* The outline is its own layer so it can stop where the flare curve begins.
            Covering the border up with the flare's fill instead leaves a faint line at some window widths. */}
        <div
          className={`absolute inset-x-0 top-0 border-t border-l border-border ${showFocus ? "group-focus-visible:border-navy" : ""}`}
          style={{ borderTopLeftRadius: radius, bottom: flareLeft ? FLARE + EXTRA : 0 }}
        />
      </div>
      {flareLeft && (
        <>
          <div className={`absolute ${gradient}`} style={flareStyle} />
          <svg
            className="absolute overflow-visible"
            style={{ left: -FLARE, top: height - FLARE }}
            width={FLARE + 1}
            height={FLARE}
            viewBox={`0 0 ${FLARE + 1} ${FLARE}`}
            fill="none"
          >
            <path d={FLARE_STROKE} className={strokeColor} />
          </svg>
        </>
      )}
      <div className="relative h-full shrink-0" style={{ width: slant }}>
        <div className={`absolute inset-0 ${fill}`} style={slantStyle} />
        <svg
          className="absolute top-0 left-0 overflow-visible"
          width={slant}
          height={height}
          viewBox={`0 0 ${slant} ${height}`}
          fill="none"
        >
          <path d={paths.stroke} className={strokeColor} />
        </svg>
      </div>
    </div>
  );
}
