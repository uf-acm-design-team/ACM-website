import Image from "next/image";
import type { Officer } from "@/data/officers";

type OfficerCardProps = {
  officer: Officer;
};

const CARD = "flex h-[138px] items-center gap-5 rounded-xl border border-border bg-background p-4";
// Only cards with a LinkedIn are links, so only they get hover and focus styles.
const LINK_CARD = `${CARD} transition-colors hover:border-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy`;

export default function OfficerCard({ officer }: OfficerCardProps) {
  const content = (
    <>
      <div className="relative size-26 shrink-0 overflow-hidden rounded-lg bg-surface-tint">
        {officer.image && (
          // The name is right next to the photo, so the photo doesn't need its own alt text.
          <Image src={officer.image} alt="" fill sizes="104px" className="object-cover" />
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h4 className="font-display text-[22px] leading-7 tracking-[-0.01em] text-navy">{officer.name}</h4>
        <p className="text-[15px] leading-[22px] text-muted">{officer.role}</p>
        {officer.internship && <p className="text-sm font-medium text-accent">{officer.internship}</p>}
      </div>
    </>
  );

  if (officer.linkedin) {
    return (
      <a
        href={officer.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${officer.name} on LinkedIn`}
        className={LINK_CARD}
      >
        {content}
      </a>
    );
  }

  return <div className={CARD}>{content}</div>;
}
