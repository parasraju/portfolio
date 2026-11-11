import type { Metadata } from "next";
import { SetupPage } from "@/components/setup/Development";
import { getSetupGroup } from "@/components/setup/setupData";

export const metadata: Metadata = {
  title: "Gear — Paras Raju",
  description: "The hardware I build everything on.",
};

export default function Page() {
  return <SetupPage group={getSetupGroup("gear")} />;
}
