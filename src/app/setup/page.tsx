import type { Metadata } from "next";
import { SetupPage } from "@/components/setup/Development";
import { getSetupGroup } from "@/components/setup/setupData";

export const metadata: Metadata = {
  title: "Setup — Paras Raju",
  description: "Editor, notes, browser and agentic coding tools.",
};

export default function Page() {
  return <SetupPage group={getSetupGroup("setup")} />;
}
