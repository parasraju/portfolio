export type BlogPost = {
  title: string;
  excerpt: string;
  url: string;
  published: string;
  readTime: number;
  cover?: string;
  tags: string[];
};

export const publication = {
  name: "Paras",
  handle: "skepticmonk",
  url: "https://skepticmonk.substack.com",
  archiveUrl: "https://skepticmonk.substack.com/archive",
};

export const blogPosts: BlogPost[] = [
  {
    title: "Thoughts of you",
    excerpt: "Whenever sadness finds me,",
    url: "https://skepticmonk.substack.com/p/thoughts-of-you",
    published: "2026-11-04",
    readTime: 1,
    cover:
      "https://substack-post-media.s3.amazonaws.com/public/images/2f7028f0-f911-4c9c-ad56-8c268a904bd2_1200x675.jpeg",
    tags: ["Poetry"],
  },
  {
    title: "Departure",
    excerpt: "These minor wonders of world",
    url: "https://skepticmonk.substack.com/p/departure",
    published: "2026-11-04",
    readTime: 1,
    cover:
      "https://substack-post-media.s3.amazonaws.com/public/images/eea2a752-bcb7-43d5-b9a1-b5d3c7268b6f_1200x400.jpeg",
    tags: ["Poetry"],
  },
  {
    title: "Fighting Dogs",
    excerpt:
      "I must have been nine or ten, somewhere in the fourth or fifth standard, when my village still felt larger than the world itself.",
    url: "https://skepticmonk.substack.com/p/fighting-dogs",
    published: "2026-07-02",
    readTime: 12,
    cover:
      "https://substackcdn.com/image/fetch/$s_!tm-1!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F28f6ea1b-32c6-4ece-8f2d-7178efebfc13_1280x720.png",
    tags: ["Essay"],
  },
  {
    title: "The Weight of Small Houses",
    excerpt: "Whenever I visit my village, I find myself stopping in front of our old house.",
    url: "https://skepticmonk.substack.com/p/the-weight-of-small-houses",
    published: "2026-06-27",
    readTime: 8,
    cover:
      "https://substackcdn.com/image/fetch/$s_!NCkP!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F953458c1-ef11-4aee-9923-fd2647a38968_736x552.jpeg",
    tags: ["Essay"],
  },
];
