import { DISCORD_URL } from "@/data/content";

// TODO: style to match Figma
export default function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <p>Association for Computing Machinery at UF</p>
      <h1>UF ACM</h1>
      <p>
        A student community for anyone curious about computing. Come to our events, work on real
        projects and meet people who love tech as much as you do.
      </p>
      <div className="flex flex-col gap-4 sm:flex-row">
        {/* TODO: point to the events page once it exists */}
        <a href="#projects" className="border px-4 py-2 text-center">
          Explore Events
        </a>
        <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="bg-accent px-4 py-2 text-center text-accent-foreground">
          Join ACM
        </a>
      </div>
    </section>
  );
}
