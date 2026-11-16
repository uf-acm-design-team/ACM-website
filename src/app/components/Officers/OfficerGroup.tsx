import type { ReactNode } from "react";
import type { Officer } from "@/data/officers";
import OfficerCard from "./OfficerCard";

type OfficerGroupProps = {
  label: string;
  officers: Officer[];
  // Shown instead of the cards when the list is empty (optional).
  empty?: ReactNode;
};

// One group of the board: a "line, name, line" divider, then a centered row of cards.
// Used for the Executive board, the Operations team, and whichever team the filter selects.
export default function OfficerGroup({ label, officers, empty }: OfficerGroupProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <span aria-hidden="true" className="h-px flex-1 bg-border" />
        <h3 className="text-center font-display text-[26px] leading-[34px] tracking-[-0.01em] text-navy">{label}</h3>
        <span aria-hidden="true" className="h-px flex-1 bg-border" />
      </div>

      {officers.length > 0 ? (
        // Three cards per row on desktop (24px gaps), two on tablets, one on phones.
        <ul className="flex flex-wrap justify-center gap-6">
          {officers.map((officer) => (
            <li key={officer.id} className="w-full md:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]">
              <OfficerCard officer={officer} />
            </li>
          ))}
        </ul>
      ) : (
        empty
      )}
    </div>
  );
}
