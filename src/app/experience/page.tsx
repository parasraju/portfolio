import type { Metadata } from "next";
import { PageShell } from "@/components/ui/PageShell";
import { ExperienceAccordion } from "@/components/experiences/ExperienceAccordion";

export const metadata: Metadata = {
  title: "Experience — Paras Raju",
  description: "Where Paras Raju has worked and contributed.",
};

export default function ExperiencePage() {
  return (
    <PageShell eyebrow="Experience" title="Where I've worked" description="Roles, open-source contributions and what I shipped along the way.">
      <section className="py-6">
        <ExperienceAccordion defaultOpen />
      </section>
    </PageShell>
  );
}
