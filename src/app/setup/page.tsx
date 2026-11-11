import type { Metadata } from "next";
import { PageShell } from "@/components/ui/PageShell";
import { Reveal } from "@/components/ui/Reveal";
import { SetupWindow } from "@/components/setup/Terminal";
import { setupGroups } from "@/components/setup/setupData";

export const metadata: Metadata = {
  title: "Development — Paras Raju",
  description: "Terminal, gear and setup.",
};

export default function SetupPage() {
  return (
    <PageShell eyebrow="Development" title="Terminal, gear & setup" description="The tools behind the work — my terminal, the hardware on my desk and how it all fits together.">
      <Reveal stagger delay={60} className="space-y-4 py-7">
        {setupGroups.map((group, i) => (
          <div key={group.id} style={{ "--i": i } as React.CSSProperties}>
            <SetupWindow group={group} />
          </div>
        ))}
      </Reveal>
    </PageShell>
  );
}
