/* eslint-disable @next/next/no-img-element */
import { Reveal } from "@/components/ui/Reveal";

const icon = (slug: string) => `https://cdn.simpleicons.org/${slug}/71717a`;

export const skills: { name: string; icon: string }[] = [
  { name: "React", icon: icon("react") },
  { name: "Node.js", icon: icon("nodedotjs") },
  { name: "Tailwind", icon: icon("tailwindcss") },
  { name: "Shadcn UI", icon: icon("shadcnui") },
  { name: "Motion", icon: icon("framer") },
  { name: "JavaScript", icon: icon("javascript") },
  { name: "TypeScript", icon: icon("typescript") },
  { name: "Python", icon: icon("python") },
  { name: "C++", icon: icon("cplusplus") },
  { name: "SQL", icon: icon("mysql") },
  { name: "Git", icon: icon("git") },
  { name: "GitHub", icon: icon("github") },
];

export function SkillsGrid() {
  return (
    <Reveal stagger delay={60} className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
      {skills.map((skill, i) => (
        <span
          key={skill.name}
          style={{ "--i": i } as React.CSSProperties}
          className="group flex items-center gap-2.5 rounded-[8px] border border-zinc-200 bg-white px-3 py-2.5 text-[12.5px] text-zinc-700 hover:-translate-y-0.5 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-[#0b0b0c] dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
        >
          <img src={skill.icon} alt="" width={16} height={16} loading="lazy" decoding="async" className="h-4 w-4 opacity-75 transition-opacity group-hover:opacity-100" />
          {skill.name}
        </span>
      ))}
    </Reveal>
  );
}
