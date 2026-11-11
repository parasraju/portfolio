export type SetupItem = {
  name: string;
  detail?: string;
  url?: string;
};

export type SetupGroup = {
  id: "terminal" | "gear" | "setup";
  title: string;
  command: string;
  blurb: string;
  items: SetupItem[];
};

export const setupGroups: SetupGroup[] = [
  {
    id: "terminal",
    title: "Terminal",
    command: "cat ~/.config/terminal",
    blurb: "Shell, prompt, fonts and the CLI tools I live in.",
    items: [],
  },
  {
    id: "gear",
    title: "Gear",
    command: "ls ~/gear",
    blurb: "The hardware on and around my desk.",
    items: [],
  },
  {
    id: "setup",
    title: "Setup",
    command: "tree ~/setup",
    blurb: "Editor, apps and the way everything fits together.",
    items: [],
  },
];
