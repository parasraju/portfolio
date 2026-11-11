export const sections = [
  { id: "experience", label: "Experience" },
  { id: "opensource", label: "Open Source" },
  { id: "blogs", label: "Blog" },
  { id: "development", label: "Development" },
  { id: "personal", label: "Personal" },
] as const;

export const pages = [
  { href: "/work/", label: "Work", description: "Projects, npm packages and skills" },
  { href: "/blogs/", label: "Blogs", description: "Essays and poems" },
  { href: "/experience/", label: "Experience", description: "Roles and contributions" },
  { href: "/terminal/", label: "Terminal", description: "Development · agentic harnesses and terminal" },
  { href: "/gear/", label: "Gear", description: "Development · hardware" },
  { href: "/setup/", label: "Setup", description: "Development · editor, notes and AI tools" },
  { href: "/books/", label: "Books", description: "On my shelf" },
  { href: "/movies/", label: "Movies", description: "Films I love" },
] as const;

export type SectionId = (typeof sections)[number]["id"];
