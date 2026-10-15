import Image from "next/image";
import { OFFICERS } from "@/data/content";

// TODO: style to match Figma
export default function Officers() {
  return (
    <section id="officers" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
      <h2>Meet the Officers</h2>

      <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
        {OFFICERS.map((officer, i) => (
          <div key={`${officer.role}-${i}`} className="border p-4">
            {officer.image ? (
              <Image src={officer.image} alt={officer.name} width={112} height={112} />
            ) : (
              // Placeholder until headshots are added
              <div className="h-28 w-28 bg-accent" />
            )}
            <h3>{officer.name}</h3>
            <p>{officer.role}</p>
            <div className="flex gap-4">
              {officer.github && (
                <a href={officer.github} target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              )}
              {officer.linkedin && (
                <a href={officer.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
