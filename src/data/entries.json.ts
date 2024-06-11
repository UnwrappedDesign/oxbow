export interface Template {
  link: string;
  name: string;
  quantity: number;
  image: string;
}
const leftheroes: Template = {
  name: "Left Heroes",
  quantity: 20,
  link: "/playground/marketing/left-heroes",
  image: "leftheroes.png",
};
const centeredheroes: Template = {
  name: "Centered Heroes",
  quantity: 20,
  link: "/playground/marketing/centered-heroes",
  image: "centeredheroes.png",
};
const rightheroes: Template = {
  name: "Right Heroes",
  quantity: 20,
  link: "/playground/marketing/right-heroes",
  image: "rightheroes.png",
};
const features: Template = {
  name: "Features",
  quantity: 30,
  link: "/playground/marketing/features",
  image: "features.png",
};
const leftHeadings: Template = {
  name: "Left Headings",
  quantity: 20,
  link: "/playground/marketing/left-headings",
  image: "leftHeadings.png",
};
const centeredHeadings: Template = {
  name: "Centered Headings",
  quantity: 20,
  link: "/playground/marketing/centered-headings",
  image: "centeredHeadings.png",
};
const rightHeadings: Template = {
  name: "Right Headings",
  quantity: 20,
  link: "/playground/marketing/right-headings",
  image: "rightHeadings.png",
};
const grids: Template = {
  name: "Grids",
  quantity: 20,
  link: "/playground/marketing/grids",
  image: "grids.png",
};
const pricing: Template = {
  name: "Pricing",
  quantity: 20,
  link: "/playground/marketing/pricing",
  image: "pricing.png",
};
const faq: Template = {
  name: "Faqs",
  quantity: 20,
  link: "/playground/marketing/faq",
  image: "faq.png",
};
const team: Template = {
  name: "Team",
  quantity: 20,
  link: "/playground/marketing/team",
  image: "team.png",
};
const blogEntries: Template = {
  name: "Blog Entries",
  quantity: 10,
  link: "/playground/marketing/blog-entries",
  image: "blogEntries.png",
};
const blogContent: Template = {
  name: "Blog Content",
  quantity: 5,
  link: "/playground/marketing/blog-content",
  image: "blogContent.png",
};
export const general: Template[] = [leftheroes, centeredheroes, rightheroes, features, leftHeadings, centeredHeadings, rightHeadings, grids, pricing, faq, team, blogEntries, blogContent];
export const byName = { leftheroes, centeredheroes, rightheroes, features, leftHeadings, centeredHeadings, rightHeadings, grids, pricing, faq, team, blogEntries, blogContent };
export const allEntries = Object.values(byName);
