export type SetupIcon = "laptop" | "mouse" | "code" | "notes" | "browser" | "agent" | "terminal";

export type SetupSpec = {
  label: string;
  value: string;
};

export type SetupItem = {
  name: string;
  detail?: string;
  url?: string;
  specs?: SetupSpec[];
};

export type SetupSection = {
  title: string;
  icon?: SetupIcon;
  items: SetupItem[];
};

export type SetupGroup = {
  slug: "terminal" | "gear" | "setup";
  title: string;
  heading: string;
  blurb: string;
  note?: string;
  sections: SetupSection[];
  comingSoon?: { title: string; text: string };
};

export const setupGroups: SetupGroup[] = [
  {
    slug: "terminal",
    title: "Terminal",
    heading: "My terminal",
    blurb: "The agentic coding harnesses I run and the terminal I run them in.",
    sections: [
      {
        title: "Agentic coding harnesses",
        icon: "agent",
        items: [
          {
            name: "JCode",
            detail:
              "A high-performance coding-agent harness written in Rust, built for heavy multi-agent workflows — light enough on memory to keep many agent sessions running at once.",
            url: "https://github.com/1jehuang/jcode",
          },
          {
            name: "OpenCode",
            detail: "An open-source agentic coding harness for the terminal that works with whichever model provider I point it at.",
            url: "https://opencode.ai",
          },
        ],
      },
      {
        title: "Terminal emulator",
        icon: "terminal",
        items: [
          {
            name: "Alacritty",
            detail: "A GPU-accelerated terminal emulator — fast, minimal and configured from a single file.",
            url: "https://alacritty.org",
          },
        ],
      },
    ],
    comingSoon: { title: "Skills", text: "I'll be adding my skills soon." },
  },
  {
    slug: "gear",
    title: "Gear",
    heading: "My gear",
    blurb: "The hardware I build everything on.",
    sections: [
      {
        title: "Laptop",
        icon: "laptop",
        items: [
          {
            name: "HP EliteBook",
            specs: [
              { label: "Processor", value: "Intel Core i5 (8th gen)" },
              { label: "RAM", value: "8 GB" },
              { label: "Storage", value: "256 GB" },
            ],
          },
        ],
      },
      {
        title: "Mouse",
        icon: "mouse",
        items: [
          {
            name: "Logitech G203 LIGHTSYNC",
            specs: [{ label: "Type", value: "Wired gaming mouse" }],
          },
        ],
      },
    ],
  },
  {
    slug: "setup",
    title: "Setup",
    heading: "My setup",
    blurb: "Editor, notes, browser and the agentic tools in my workflow.",
    note: "I love exploring and using open-source projects, especially because I work with relatively low-end hardware.",
    sections: [
      {
        title: "Code editor",
        icon: "code",
        items: [{ name: "Zed", detail: "Fast, open-source editor written in Rust.", url: "https://zed.dev" }],
      },
      {
        title: "Note taking",
        icon: "notes",
        items: [{ name: "Obsidian", detail: "Local Markdown notes, linked together.", url: "https://obsidian.md" }],
      },
      {
        title: "Browser",
        icon: "browser",
        items: [{ name: "Helium Browser", detail: "Private, open-source Chromium-based browser.", url: "https://helium.computer" }],
      },
      {
        title: "Agentic coding tools",
        icon: "agent",
        items: [
          { name: "Cursor", detail: "AI-first code editor.", url: "https://cursor.com" },
          { name: "Google Antigravity", detail: "Google's agent-first development platform.", url: "https://antigravity.google" },
          { name: "OpenCode", detail: "Open-source coding agent for the terminal.", url: "https://opencode.ai" },
        ],
      },
    ],
  },
];

export const getSetupGroup = (slug: SetupGroup["slug"]) => setupGroups.find((group) => group.slug === slug)!;
