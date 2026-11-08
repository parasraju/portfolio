import { npmPackages, projects } from "./projectsData";
import { Reveal } from "@/components/ui/Reveal";

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.419-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" />
    </svg>
  );
}

function ArrowUpRightIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 7h10v10" />
      <path d="M7 17 17 7" />
    </svg>
  );
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  );
}

function ProjectCard({ project, index }: { project: (typeof projects)[number]; index: number }) {
  return (
    <article style={{ "--i": index } as React.CSSProperties} className="group relative flex h-full flex-col rounded-[10px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0b0b0c] p-4 hover:-translate-y-0.5 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-[0_8px_24px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[7px] border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 font-mono text-[13px] font-bold text-zinc-700 dark:text-zinc-300">
            {project.name.charAt(0)}
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-[14px] font-semibold tracking-tight text-zinc-900 dark:text-white">
              <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-4 decoration-zinc-300 dark:decoration-zinc-700">
                {project.name}
              </a>
            </h3>
            <p className="truncate font-mono text-[10.5px] text-zinc-400 dark:text-zinc-500">
              parasraju/{project.repo}
            </p>
          </div>
        </div>
        {project.featured && (
          <span className="shrink-0 rounded-full border border-zinc-200 dark:border-zinc-800 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">
            Featured
          </span>
        )}
      </div>

      <p className="mt-3 line-clamp-3 text-[12.5px] leading-[1.6] text-zinc-600 dark:text-zinc-400">
        {project.description}
      </p>

      <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-3 text-[11px] text-zinc-500 dark:text-zinc-400">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: project.languageColor }} />
          {project.language}
        </span>
        <span className="inline-flex items-center gap-1">
          <StarIcon className="h-3 w-3" />
          {project.stars}
        </span>
        <span className="ml-auto inline-flex items-center gap-2">
          {project.npmUrl && (
            <a href={project.npmUrl} target="_blank" rel="noopener noreferrer" className="rounded-[4px] border border-zinc-200 dark:border-zinc-800 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-zinc-600 dark:text-zinc-400 transition-colors hover:border-zinc-300 hover:text-zinc-900 dark:hover:border-zinc-700 dark:hover:text-white">
              npm
            </a>
          )}
          <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" aria-label={`${project.name} on GitHub`} className="text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-white">
            <GitHubIcon className="h-3.5 w-3.5" />
          </a>
        </span>
      </div>
    </article>
  );
}

export function ProjectsSection() {
  return (
    <section id="projects" className="scroll-mt-24 py-6 border-t border-dashed border-zinc-200 dark:border-zinc-800">
      <Reveal className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-[18px] sm:text-[20px] font-bold tracking-tight text-zinc-900 dark:text-white">Projects</h2>
        <a href="https://github.com/parasraju?tab=repositories" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11.5px] font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
          View all on GitHub <ArrowUpRightIcon className="h-3 w-3" />
        </a>
      </Reveal>

      <Reveal stagger delay={80} className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {projects.map((project, i) => (
          <ProjectCard key={project.slug} project={project} index={i} />
        ))}
      </Reveal>

      <Reveal className="mt-8">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-[12px] font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
            npm packages
          </h3>
          <a href="https://www.npmjs.com/~parasraju" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11.5px] font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
            npm profile <ArrowUpRightIcon className="h-3 w-3" />
          </a>
        </div>

        <div className="mt-2 overflow-hidden rounded-[10px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0b0b0c]">
          {npmPackages.map((pkg) => (
            <a
              key={pkg.name}
              href={pkg.npmUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 border-b border-dashed border-zinc-200 px-3.5 py-3 transition-colors last:border-b-0 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900/60"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 font-mono text-[9px] font-bold uppercase text-[#cb3837]">
                npm
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="truncate font-mono text-[12px] font-semibold text-zinc-900 dark:text-white">{pkg.name}</span>
                  <span className="rounded-full border border-zinc-200 dark:border-zinc-800 px-1.5 py-0.5 font-mono text-[9.5px] text-zinc-500 dark:text-zinc-400">
                    v{pkg.version}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-[11.5px] text-zinc-500 dark:text-zinc-400">{pkg.description}</p>
              </div>
              <span className="hidden shrink-0 items-center gap-1 text-[10.5px] text-zinc-400 dark:text-zinc-500 sm:inline-flex">
                <DownloadIcon className="h-3 w-3" />
                {pkg.weeklyDownloads > 0 ? `${pkg.weeklyDownloads}/wk` : "new"}
              </span>
              <ArrowUpRightIcon className="h-3.5 w-3.5 shrink-0 text-zinc-300 transition-colors group-hover:text-zinc-700 dark:text-zinc-600 dark:group-hover:text-zinc-300" />
            </a>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
