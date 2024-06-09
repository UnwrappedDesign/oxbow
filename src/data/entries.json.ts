export interface Template {
  link: string;
  name: string;
  quantity: number;
  image: string;
}
const leftHeros: Template = {
  name: "Left Heroes",
  quantity: 20,
  link: "/components/left-heroes",
  image: "leftHeros.png",
};
const centeredHeros: Template = {
  name: "Centered Heroes",
  quantity: 20,
  link: "/components/centered-heroes",
  image: "centeredHeros.png",
};
const rightHeros: Template = {
  name: "Right Heroes",
  quantity: 20,
  link: "/components/right-heroes",
  image: "rightHeros.png",
};
const features: Template = {
  name: "Features",
  quantity: 30,
  link: "/components/features",
  image: "features.png",
};
const leftHeadings: Template = {
  name: "Left Headings",
  quantity: 20,
  link: "/components/left-headings",
  image: "leftHeadings.png",
};
const centeredHeadings: Template = {
  name: "Centered Headings",
  quantity: 20,
  link: "/components/centered-headings",
  image: "centeredHeadings.png",
};
const rightHeadings: Template = {
  name: "Right Headings",
  quantity: 20,
  link: "/components/right-headings",
  image: "rightHeadings.png",
};
const grids: Template = {
  name: "Grids",
  quantity: 20,
  link: "/components/grids",
  image: "grids.png",
};
const pricing: Template = {
  name: "Pricing",
  quantity: 20,
  link: "/components/pricing",
  image: "pricing.png",
};
const faq: Template = {
  name: "Faqs",
  quantity: 20,
  link: "/components/faq",
  image: "faq.png",
};
const team: Template = {
  name: "Team",
  quantity: 20,
  link: "/components/team",
  image: "team.png",
};
const blogEntries: Template = {
  name: "Blog Entries",
  quantity: 10,
  link: "/components/blog",
  image: "blogEntries.png",
};
const blogContent: Template = {
  name: "Blog Content",
  quantity: 5,
  link: "/components/blog",
  image: "blogContent.png",
};
export const general: Template[] = [leftHeros, centeredHeros, rightHeros, features, leftHeadings, centeredHeadings, rightHeadings, grids, pricing, faq, team, blogEntries, blogContent];
export const byName = { leftHeros, centeredHeros, rightHeros, features, leftHeadings, centeredHeadings, rightHeadings, grids, pricing, faq, team, blogEntries, blogContent };
export const allEntries = Object.values(byName);
