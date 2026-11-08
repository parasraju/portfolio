export const sections = [
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "opensource", label: "Open Source" },
  { id: "skills", label: "Skills" },
  { id: "blogs", label: "Blog" },
] as const;

export type SectionId = (typeof sections)[number]["id"];
