import { defineCollection, z } from "astro:content";
const simple = defineCollection({
  schema: z.object({
    page: z.string().optional(),
  }),
});
const sections = defineCollection({
  schema: z.object({
    pageName: z.string().optional(),
    description: z.string().optional(),
  }),
});

const documentation = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    order: z.number().optional(),
    category: z.string().optional(),
    pinned: z.boolean().optional(),
  }),
});
export const collections = {
  simple: simple,
  sections: sections,
  // Changelog entries: each file represents one date's changes
  // Changelog entries: freeform body content under frontmatter
  changelog: defineCollection({
    schema: z
      .object({
        title: z.string(),
        date: z.string().refine((d) => !isNaN(Date.parse(d)), {
          message: "Invalid date format",
        }),
      })
      .passthrough(),
  }),
  documentation,
};
