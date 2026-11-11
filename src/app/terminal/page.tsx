import type { Metadata } from "next";
import { SetupPage } from "@/components/setup/Development";
import { getSetupGroup } from "@/components/setup/setupData";

export const metadata: Metadata = {
  title: "Terminal — Paras Raju",
  description: "Agentic coding harnesses and the terminal I run them in.",
};

export default function Page() {
  return <SetupPage group={getSetupGroup("terminal")} />;
}
