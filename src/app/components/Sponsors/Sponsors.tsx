import { SPONSORS } from "@/data/content";

// TODO: style to match Figma
export default function Sponsors() {
  return (
    <section id="sponsors" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
      <h2>Sponsors</h2>

      <ul className="flex flex-wrap gap-6">
        {SPONSORS.map((sponsor) => (
          <li key={sponsor.name} className="border px-4 py-2">
            {sponsor.name}
          </li>
        ))}
      </ul>
    </section>
  );
}
