export type SetupItem = {
  name: string;
  detail?: string;
  url?: string;
};

export type SetupGroup = {
  slug: "terminal" | "gear" | "setup";
  title: string;
  heading: string;
  blurb: string;
  items: SetupItem[];
};

export const setupGroups: SetupGroup[] = [
  {
    slug: "terminal",
    title: "Terminal",
    heading: "My terminal",
    blurb: "Shell, prompt, fonts and the command-line tools I use every day.",
    items: [],
  },
  {
    slug: "gear",
    title: "Gear",
    heading: "My gear",
    blurb: "The hardware on and around my desk.",
    items: [],
  },
  {
    slug: "setup",
    title: "Setup",
    heading: "My setup",
    blurb: "Editor, apps and the way everything fits together.",
    items: [],
  },
];

export const getSetupGroup = (slug: SetupGroup["slug"]) => setupGroups.find((group) => group.slug === slug)!;
