import { PROJECTS } from "@/data/content";

// TODO: style to match Figma
export default function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
      <h2>Projects &amp; Student Work</h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {PROJECTS.map((project) => (
          <div key={project.title} className="border p-4">
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <ul className="flex flex-wrap gap-2">
              {project.tech.map((tech) => (
                <li key={tech} className="bg-accent px-2 text-accent-foreground">
                  {tech}
                </li>
              ))}
            </ul>
            {project.href && (
              <a href={project.href} target="_blank" rel="noopener noreferrer">
                View project
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
