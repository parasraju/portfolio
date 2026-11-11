import type { Metadata } from "next";
import { SetupPage } from "@/components/setup/Development";
import { getSetupGroup } from "@/components/setup/setupData";

export const metadata: Metadata = {
  title: "Setup — Paras Raju",
  description: "Editor, apps and how everything fits together.",
};

export default function Page() {
  return <SetupPage group={getSetupGroup("setup")} />;
}
