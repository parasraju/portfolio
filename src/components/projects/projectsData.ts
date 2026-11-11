export type Project = {
  name: string;
  slug: string;
  description: string;
  language: string;
  languageColor: string;
  stars: number;
  repo: string;
  repoUrl: string;
  npmUrl?: string;
  featured?: boolean;
  tags: string[];
};

export type NpmPackage = {
  name: string;
  version: string;
  description: string;
  npmUrl: string;
  repoUrl: string;
};

const gh = (repo: string) => `https://github.com/parasraju/${repo}`;
const npm = (name: string) => `https://www.npmjs.com/package/${name}`;

export const projects: Project[] = [
  {
    name: "HexLens",
    slug: "hexlens",
    description:
      "Open-source binary intelligence and reverse-engineering framework for inspecting, diffing, and understanding compiled artifacts.",
    language: "TypeScript",
    languageColor: "#3178c6",
    stars: 0,
    repo: "hexlens",
    repoUrl: gh("hexlens"),
    npmUrl: npm("hexlens"),
    featured: true,
    tags: ["Reverse engineering", "CLI", "Developer tools"],
  },
  {
    name: "API Instructor",
    slug: "leakedapis",
    description:
      "Scans GitHub for exposed API keys and surfaces results in a live dashboard — built to catch leaks before someone else does.",
    language: "Python",
    languageColor: "#3572A5",
    stars: 5,
    repo: "LeakedAPIs",
    repoUrl: gh("LeakedAPIs"),
    featured: true,
    tags: ["Security", "GitHub API", "Dashboard"],
  },
  {
    name: "Locus",
    slug: "locus",
    description:
      "A calm, local-first Markdown knowledge workspace — plain .md files, live preview, wikilinks, callouts, KaTeX, Mermaid, and a keyboard-first workflow.",
    language: "TypeScript",
    languageColor: "#3178c6",
    stars: 0,
    repo: "locus",
    repoUrl: gh("locus"),
    featured: true,
    tags: ["Markdown", "Local-first", "Knowledge base"],
  },
  {
    name: "Plumber",
    slug: "plumber",
    description:
      "CI/CD pipeline linter that flags hardcoded secrets, leaked credentials, and dead code — with fixes written in plain English.",
    language: "Python",
    languageColor: "#3572A5",
    stars: 0,
    repo: "plumber",
    repoUrl: gh("plumber"),
    npmUrl: npm("plumber-linter"),
    featured: true,
    tags: ["CI/CD", "Security", "Linter"],
  },
  {
    name: "Kinder",
    slug: "kinder",
    description:
      "A quiet, private workspace for API discovery, credential vaulting, and secret hygiene.",
    language: "TypeScript",
    languageColor: "#3178c6",
    stars: 0,
    repo: "kinder",
    repoUrl: gh("kinder"),
    tags: ["Privacy", "Vault", "Developer tools"],
  },
  {
    name: "Eureka",
    slug: "eureka",
    description:
      "AI creative benchmark finder — discovers and runs creativity benchmarks against large language models.",
    language: "Python",
    languageColor: "#3572A5",
    stars: 0,
    repo: "eureka",
    repoUrl: gh("eureka"),
    tags: ["AI", "Benchmarks", "LLM"],
  },
  {
    name: "DomainDigger",
    slug: "domaindigger",
    description: "Domain reconnaissance made simple.",
    language: "Python",
    languageColor: "#3572A5",
    stars: 1,
    repo: "domaindigger",
    repoUrl: gh("domaindigger"),
    tags: ["Recon", "DNS", "CLI"],
  },
  {
    name: "ScholarDex",
    slug: "scholardex",
    description:
      "AI-powered research paper search and summarization CLI — Google Scholar, arXiv, Semantic Scholar, Crossref, plus Gemini summaries.",
    language: "Python",
    languageColor: "#3572A5",
    stars: 1,
    repo: "scholarDex",
    repoUrl: gh("scholarDex"),
    tags: ["Research", "AI", "CLI"],
  },
];

export const npmPackages: NpmPackage[] = [
  {
    name: "hexlens",
    version: "0.3.1",
    description: "Open-source binary intelligence and reverse-engineering framework.",
    npmUrl: npm("hexlens"),
    repoUrl: gh("hexlens"),
  },
  {
    name: "plumber-linter",
    version: "1.1.2",
    description:
      "CI/CD pipeline linter that flags hardcoded secrets, leaked credentials, and dead code.",
    npmUrl: npm("plumber-linter"),
    repoUrl: gh("plumber"),
  },
  {
    name: "@parasraju/plumber-mcp",
    version: "1.0.0",
    description:
      "Plumber as an MCP server — let your AI coding agent scan repos for leaked secrets and dead code.",
    npmUrl: npm("@parasraju/plumber-mcp"),
    repoUrl: gh("plumber"),
  },
  {
    name: "environmental-peek",
    version: "0.2.1",
    description: "Safely inspect your .env files without leaking secrets.",
    npmUrl: npm("environmental-peek"),
    repoUrl: gh("environmental-peek"),
  },
  {
    name: "react-dismiss",
    version: "0.1.1",
    description:
      "A tiny React hook for dismissing UI when users interact outside or press Escape.",
    npmUrl: npm("react-dismiss"),
    repoUrl: gh("react-dismiss"),
  },
];
