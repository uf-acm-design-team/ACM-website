const TAB_PATH = "M0 56V16C0 5.33 5.33 0 16 0H266C284 0 314 56 336 56Z";

type TabShapeProps = {
  active: boolean;
  offset: number;
};

export default function TabShape({ active, offset }: TabShapeProps) {
  return (
    <>
      {active && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-r from-folder-start via-background via-40% to-folder-end"
          style={{
            clipPath: `path("${TAB_PATH}")`,
            backgroundSize: "100cqw 100%",
            backgroundPosition: `${-offset}px 0`,
          }}
        />
      )}
      <svg className="absolute inset-0 overflow-visible" width="336" height="56" viewBox="0 0 336 56" fill="none" aria-hidden="true">
        {!active && <path d={TAB_PATH} className="fill-surface-muted" />}
        <path
          d="M0.5 56V16C0.5 5.6 5.6 0.5 16 0.5H266C284 0.5 314 55.5 336 55.5"
          className="stroke-border group-focus-visible:stroke-navy group-focus-visible:stroke-2"
        />
      </svg>
    </>
  );
}
