import type { Metadata } from "next";
import { PageShell } from "@/components/ui/PageShell";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SeeAll";
import { ExternalLink, NpmPackageList, ProjectGrid } from "@/components/projects/ProjectsSection";
import { SkillsGrid } from "@/components/projects/Skills";

export const metadata: Metadata = {
  title: "Work — Paras Raju",
  description: "Projects, npm packages and the tools I build with.",
};

export default function WorkPage() {
  return (
    <PageShell eyebrow="Work" title="Things I've built" description="Open-source tools, security experiments and developer utilities — plus the packages I publish to npm and the stack I reach for.">
      <section id="projects" className="scroll-mt-24 py-7">
        <Reveal>
          <SectionHeading title="Projects" action={<ExternalLink href="https://github.com/parasraju?tab=repositories">View all on GitHub</ExternalLink>} />
        </Reveal>
        <ProjectGrid />
      </section>

      <section id="npm" className="scroll-mt-24 border-t border-dashed border-zinc-200 py-7 dark:border-zinc-800">
        <Reveal>
          <SectionHeading title="npm packages" action={<ExternalLink href="https://www.npmjs.com/~parasraju">npm profile</ExternalLink>} />
        </Reveal>
        <NpmPackageList />
      </section>

      <section id="skills" className="scroll-mt-24 border-t border-dashed border-zinc-200 py-7 dark:border-zinc-800">
        <Reveal>
          <SectionHeading title="Skills & Technologies" />
        </Reveal>
        <SkillsGrid />
      </section>
    </PageShell>
  );
}
