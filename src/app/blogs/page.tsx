import type { Metadata } from "next";
import { PageShell } from "@/components/ui/PageShell";
import { BlogList, SubstackNote } from "@/components/blog/BlogSection";
import { publication } from "@/components/blog/blogData";
import { ExternalLink } from "@/components/projects/ProjectsSection";

export const metadata: Metadata = {
  title: "Blogs — Paras Raju",
  description: "Essays and poems by Paras Raju.",
};

export default function BlogsPage() {
  return (
    <PageShell
      eyebrow="Writing"
      title="Blogs"
      focusScope
      description={
        <div className="space-y-3">
          <SubstackNote />
          <ExternalLink href={publication.archiveUrl}>Read the full archive on Substack</ExternalLink>
        </div>
      }
    >
      <section className="py-4">
        <BlogList large scoped={false} />
      </section>
    </PageShell>
  );
}
