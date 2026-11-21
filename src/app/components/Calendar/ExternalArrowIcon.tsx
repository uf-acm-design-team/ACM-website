// The ↗ "opens elsewhere" arrow from the Figma text link, drawn in currentColor.
export default function ExternalArrowIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
    >
      <path d="M3.33 12.67L12.67 3.33M12.67 12.67V3.33H3.33" />
    </svg>
  );
}
