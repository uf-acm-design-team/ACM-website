import ExternalArrowIcon from "./ExternalArrowIcon";

type CalendarFootnoteProps = {
  link: { label: string; href: string | null };
  newTabLabel: string;
};

export default function CalendarFootnote({ link, newTabLabel }: CalendarFootnoteProps) {
  if (!link.href) return null;

  return (
    <div className="flex justify-end">
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 rounded-sm text-base font-medium leading-6 text-muted transition-colors hover:text-indigo focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent active:text-violet motion-reduce:transition-none"
      >
        {link.label}
        <ExternalArrowIcon />
        <span className="sr-only">{newTabLabel}</span>
      </a>
    </div>
  );
}
