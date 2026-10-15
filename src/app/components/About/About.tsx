import { PILLARS } from "@/data/content";

// TODO: style to match Figma
export default function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
      <h2>About ACM</h2>
      <p>
        ACM is UF&apos;s chapter of the world&apos;s largest computing society. Whatever your
        major or experience level, there&apos;s a place for you here.
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {PILLARS.map((pillar) => (
          <div key={pillar.title} className="border p-4">
            <h3>{pillar.title}</h3>
            <p>{pillar.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
