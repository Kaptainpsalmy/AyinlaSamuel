import { defineConfig, defineCollection, s } from "velite";
import rehypePrettyCode from "rehype-pretty-code";

// Projects: each MDX is a case study. Schema mirrors plans/phase3.md.
const projects = defineCollection({
  name: "Project",
  pattern: "projects/**/*.mdx",
  schema: s
    .object({
      slug: s.path(),
      title: s.string(),
      tagline: s.string(),
      type: s.enum(["client", "side", "final-year", "personal"]),
      categories: s.array(s.string()).default([]),
      stack: s.array(s.string()).default([]),
      year: s.string(),
      role: s.string(),
      duration: s.string().optional(),
      status: s.enum(["live", "internal", "archived"]).default("archived"),
      featured: s.boolean().default(false),
      order: s.number().default(100),
      links: s
        .object({
          live: s.string().optional(),
          repo: s.string().optional(),
          docs: s.string().optional(),
        })
        .default({}),
      screenshots: s.array(s.string()).default([]),
      evidence: s
        .object({
          swagger: s.string().optional(),
          transcript: s.string().optional(),
          benchmark: s.array(s.string()).optional(),
          verified: s.string().optional(),
        })
        .optional(),
      problem: s.string().optional(),
      solution: s.string().optional(),
      verify: s.boolean().default(false),
      body: s.mdx(),
    })
    .transform((data) => { const slug = data.slug.replace(/^projects\//, ""); return { ...data, slug, url: `/projects/${slug}` }; }),
});

// Notes: blog / case-study reflections.
const notes = defineCollection({
  name: "Note",
  pattern: "notes/**/*.mdx",
  schema: s
    .object({
      slug: s.path(),
      title: s.string(),
      excerpt: s.string(),
      date: s.isodate(),
      tags: s.array(s.string()).default([]),
      verify: s.boolean().default(false),
      metadata: s.metadata(),
      body: s.mdx(),
    })
    .transform((data) => { const slug = data.slug.replace(/^notes\//, ""); return { ...data, slug, url: `/notes/${slug}` }; }),
});

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/velite",
    base: "/velite/",
    clean: true,
  },
  collections: { projects, notes },
  mdx: {
    gfm: true,
    rehypePlugins: [
      [
        rehypePrettyCode,
        {
          theme: { dark: "github-dark", light: "github-light" },
          keepBackground: false,
        },
      ],
    ],
  },
});
