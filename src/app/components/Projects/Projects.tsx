import type { Project } from "@/data/projects";

type ProjectsProps = {
  projects: Project[];
};

// TODO: style to match Figma
export default function Projects({ projects }: ProjectsProps) {
  return (
    <section id="projects" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
      <h2>Projects</h2>
      <p>Projects from the UF ACM design teams.</p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div key={project.id} className="border p-4">
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            {project.tech && (
              <ul className="flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <li key={tech} className="bg-accent px-2 text-accent-foreground">
                    {tech}
                  </li>
                ))}
              </ul>
            )}
            {project.websiteHref && (
              <a href={project.websiteHref} target="_blank" rel="noopener noreferrer">
                Visit website
              </a>
            )}
            {project.teamHref && (
              <a href={project.teamHref} target="_blank" rel="noopener noreferrer">
                Meet the team
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
