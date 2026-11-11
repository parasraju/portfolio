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
  { href: "/setup/", label: "Development", description: "Terminal, gear and setup" },
  { href: "/books/", label: "Books", description: "On my shelf" },
  { href: "/movies/", label: "Movies", description: "Films I love" },
] as const;

export type SectionId = (typeof sections)[number]["id"];
