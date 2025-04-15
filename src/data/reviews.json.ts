export interface Template {
  name: string;
  work: string;
  text: string;
  image: string;
}
const ianHawes: Template = {
  name: "Ian Hawes",
  work: "Founder of immitranslate.com",
  text: "Always impressed with the designs of @michael_andreuzza and the components he produces. This is another kit worthy of a purchase. Congrats on the launch!",
  image: "/reviews/ianHawes.jpg",
};
const alexHughes: Template = {
  name: "Alex Hughes",
  work: "letslooping.com",
  text: "Anything Michael does is bound to be great, I would highly recommend; this looks like a killer set of components",
  image: "/reviews/alexhughes.jpg",
};

const eelco: Template = {
  name: "Eelco Wiersma",
  work: "Creator of saas-ui.dev",
  text: "Pretty amazing library 👏",
  image: "/reviews/eelco.jpg",
};

const carl: Template = {
  name: "Carl Poppa",
  work: "maynuu.com",
  text: "Anything made by these guys is guaranteed style! quality! excellence!",
  image: "/reviews/carlPoppa.png",
};
const alin: Template = {
  name: "Alin Simion",
  work: "Software Engineer",
  text: "I think this is an instant buy for me 👏 Congrats!",
  image: "/reviews/alinSimion.jpg",
};
const jonSullivan: Template = {
  name: "Jon sullivan",
  work: "Software Engineer",
  text: "That new set of UI components, Oxbow, is absolutely killer. I looked through quite a few (though there are just so dang many!) and really love them",
  image: "/reviews/jonSullivan.jpg",
};

const rhys: Template = {
  name: "Rhys Jones",
  work: "Professor at Harvard University",
  text: "Pretty jazzed to get stuck in with Oxbow! I've also purchased Lexington themes in the past for Astro, and as always, the quality of work is top-notch. Thank you for creating such amazing products. It helps tremendously with solo dev work!",
  image: "/reviews/rhys.avif",
};
const mubs: Template = {
  name: "Mubs",
  work: "mubashariqbal.com",
  text: "Purchased a license for Oxbow UI (oxbowui.com) by @michaelandreuzza.com will be using it for parts if not all of the project.  Only $67 right now, seems like real bargain. Will be starting with a simple landing page, while I build out the functionality.",
  image: "/reviews/mubs.jpg",
};

export const byName = {
  rhys,
  ianHawes,
  mubs,
  jonSullivan,
  alexHughes,
  carl,
  eelco,
  alin,
};
export const reviews = Object.values(byName);
