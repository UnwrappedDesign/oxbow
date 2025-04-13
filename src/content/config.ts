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
export const collections = {
  simple: simple,
  sections: sections,
};
