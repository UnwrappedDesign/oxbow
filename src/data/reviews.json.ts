export interface Template {
  name: string;
  work: string;
  text: string;
  image: string;
};
const ianHawes: Template = {
  name: "Ian Hawes",
  work: "founder of immitranslate.com",
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
  name: "maynuu.com",
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

export const byName = {
  alexHughes,
  ianHawes,
  carl,
  eelco,
  alin,

};
export const reviews = Object.values(byName);
