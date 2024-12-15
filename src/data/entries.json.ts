export interface Template {
  link: string;
  name: string;
  image: string;
  tags: string[];
}
// Define the templates in a structured array format
const templates: { [key: string]: Template[] } = {
  // Page sections
  pageSections: [
    { 
      name: "Hero Sections",
      link: "/playground/marketing/hero",
      image: "heros.png",
      tags: ["header", "hero", "hero section", "main image", "top section", "introductory section", "welcome section", "main header"],
    },
    {
      name: "Bento Grids",
      link: "/playground/marketing/bento-grids",
      image: "bento.png",
      tags: ["bento grids", "grid layout", "grid system", "responsive grid", "flexible grid", "adaptive grid", "fluid grid", "responsive design", "web design", "user interface", "UI design", "interface design", "graphic design", "visual design"],
    },
    { 
      name: "Features Sections", 
      link: "/playground/marketing/features", 
      image: "features.png",
      tags: ["features", "feature section", "benefits", "key features", "highlights", "main features", "what we offer", "services", "capabilities", "advantages", "functionalities", "static"],
    },
    { 
      name: "Timeline Sections", 
      link: "/playground/marketing/timeline", 
      image: "timeline.png",
      tags: ["UI timeline", "event timeline", "chronological order", "milestone tracking", "timeline visualization", "historical data", "project timeline", "timeline component", "interactive timeline", "time-based features"],
    },
    { 
      name: "Steps Sections", 
      link: "/playground/marketing/steps", 
      image: "steps.png",
      tags: ["steps", "step section", "step list", "step item", "step title", "step description", "step icon", "step link"],
    },
    { 
      name: "Pricing Sections", 
      link: "/playground/marketing/pricing", 
      image: "pricing.png",
      tags: ["pricing", "pricing section", "pricing table", "pricing card", "pricing title", "pricing description", "pricing price", "pricing features"],
    },
    { 
      name: "Faq Sections", 
      link: "/playground/marketing/faq", 
      image: "faq.png",
      tags: ["faq", "faq section", "faq list", "faq item", "faq question", "faq answer", "faq icon", "faq link"],
    },
    { 
      name: "Team Sections", 
      link: "/playground/marketing/team", 
      image: "team.png",
      tags: ["team", "team section", "team list", "team item", "team name", "team role", "team image", "team link"],
    },
    { 
      name: "Blog Entries", 
      link: "/playground/marketing/blog-entries", 
      image: "blogEntries.png",
      tags: ["blog", "blog section", "blog entry", "blog title", "blog description", "blog image", "blog link"],
    },
    { 
      name: "Blog Content", 
      link: "/playground/marketing/blog-content", 
      image: "blogContent.png",
      tags: ["blog", "blog section", "blog post", "blog title", "blog content", "blog image", "blog link"],
    },
    { 
      name: "Testimonials", 
      link: "/playground/marketing/testimonials", 
      image: "testimonials.png",
      tags: ["testimonials", "testimonial section", "testimonial list", "testimonial item", "testimonial name", "testimonial role", "testimonial image", "testimonial link"],
    },
    { 
      name: "Logo Clouds", 
      link: "/playground/marketing/logo-clouds", 
      image: "logoclouds.png",
      tags: ["logo clouds", "logo section", "logo list", "logo item", "logo image", "logo link"],
    },
    { 
      name: "Stats Sections", 
      link: "/playground/marketing/stats",
      image: "stats.png", 
      tags: ["stats", "stat section", "stat list", "stat item", "stat title", "stat value", "stat icon", "stat link"] 
    },
    { 
      name: "Footers", 
      link: "/playground/marketing/footers", 
      image: "footers.png",
      tags: ["footer", "footer section", "footer list", "footer item", "footer title", "footer description", "footer link"] 
    },
    { 
      name: "Status Sections", 
      link: "/playground/marketing/status", 
      image: "status.png",
      tags: ["status", "status section", "status list", "status item", "status title", "status description", "status icon", "status link"] 
    },
    { 
      name: "Contact Sections", 
      link: "/playground/marketing/contact", 
      image: "contact.png",
      tags: ["contact", "contact section", "contact form", "contact title", "contact description", "contact image", "contact link"] 
    },
    { 
      name: "Newsletter Call to Action", 
      link: "/playground/marketing/cta-newsletter", 
      image: "newsletter.png",
      tags: ["newsletter", "newsletter section", "newsletter form", "newsletter title", "newsletter description", "newsletter image", "newsletter link"] 
    },
    { 
      name: "Call to Actions", 
      link: "/playground/marketing/cta", 
      image: "cta.png",
      tags: ["call to action", "call to action section", "call to action content", "call to action image", "call to action link"] 
    },
    { 
      name: "Gallery", 
      link: "/playground/marketing/gallery", 
      image: "gallery.png",
      tags: ["gallery", "gallery section", "gallery content", "gallery image", "gallery link"] 
    },
  ],
  // Page Examples
  pageExamples: [
    { 
      name: "Landing Pages", 
      link: "/playground/marketing/landing-pages", 
      image: "landingPages.png",
      tags: ["landing page", "landing page section", "landing page content", "landing page image", "landing page link"],
    },
    { 
      name: "Pricing Pages", 
      link: "/playground/marketing/pricing-pages", 
      image: "pricingPages.png",
      tags: ["pricing page", "pricing page section", "pricing page content", "pricing page image", "pricing page link"],
    },
  ],
  
  // Navigation
  navigation: [
    { 
      name: "Navbars", 
      link: "/playground/application/navbars", 
      image: "navbars.png",
      tags: ["navbar", "navbar section", "navbar content", "navbar image", "navbar link"],
    },
    { 
      name: "Flyout menus", 
      link: "/playground/application/flyouts", 
      image: "flyouts.png",
      tags: ["flyout menu", "flyout menu section", "flyout menu content", "flyout menu image", "flyout menu link"],
    },
    { 
      name: "Sidebars", 
      link: "/playground/application/sidebars", 
      image: "sidebars.png",
      tags: ["sidebar", "sidebar section", "sidebar content", "sidebar image", "sidebar link"],
    },
    { 
      name: "Vertical navigation", 
      link: "/playground/application/verticalnav", 
      image: "verticalnav.png",
      tags: ["vertical navigation", "vertical navigation section", "vertical navigation content", "vertical navigation image", "vertical navigation link"],
    },
    { 
      name: "Breadcrumbs", 
      link: "/playground/application/breadcrumbs", 
      image: "breadcrumbs.png",
      tags: ["breadcrumb", "breadcrumb section", "breadcrumb content", "breadcrumb image", "breadcrumb link"],
    },
    { 
      name: "Pagination", 
      link: "/playground/application/pagination", 
      image: "pagination.png",
      tags: ["pagination", "pagination section", "pagination content", "pagination image", "pagination link"] 
    },
    { 
      name: "Tabs", 
      link: "/playground/application/tabs", 
      image: "tabs.png",
      tags: ["tab", "tab section", "tab content", "tab image", "tab link"] 
    },
    { 
      name: "Command Bar", 
      link: "/playground/application/commandbar", 
      image: "commandbar.png",
      tags: ["command bar", "command bar section", "command bar content", "command bar image", "command bar link"] 
    },
  ],
  // Overlays
  overlay: [
    { 
      name: "Modals", 
      link: "/playground/application/modals", 
      image: "modals.png",
      tags: ["modal", "modal section", "modal content", "modal image", "modal link"] 
    },
    { 
      name: "Slideover", 
      link: "/playground/application/slideover", 
      image: "slideover.png",
      tags: ["slideover", "slideover section", "slideover content", "slideover image", "slideover link"] 
    },
    { 
      name: "Notifications", 
      link: "/playground/application/notifications", 
      image: "notifications.png",
      tags: ["notification", "notification section", "notification content", "notification image", "notification link"] 
    },
    { 
      name: "Alerts", 
      link: "/playground/application/alerts", 
      image: "alerts.png",
      tags: ["alerts", "alerts section", "alerts content", "alerts image", "alerts link"] 
    },
  ],
  // Forms
  forms: [
    { 
      name: "Sign Up", 
      link: "/playground/application/sign-up", 
      image: "signUp.png",
      tags: ["sign up", "sign up section", "sign up content", "sign up image", "sign up link"] 
    },
    { 
      name: "Sign In", 
      link: "/playground/application/sign-in", 
      image: "signIn.png",
      tags: ["sign in", "sign in section", "sign in content", "sign in image", "sign in link"] 
    },
    { 
      name: "Form Layouts", 
      link: "/playground/application/formlayouts", 
      image: "formlayouts.png",
      tags: ["form layout", "form layout section", "form layout content", "form layout image", "form layout link"] 
    },
    /* { 
      name: "Inputs", 
      link: "/playground/application/inputs", 
      image: "inputs.png",
      tags: ["input", "input section", "input content", "input image", "input link"] 
    },
    { 
      name: "Textarea", 
      link: "/playground/application/textarea", 
      image: "textarea.png",
      tags: ["textarea", "textarea section", "textarea content", "textarea image", "textarea link"] 
    },
    { 
      name: "Checkboxes", 
      link: "/playground/application/checkboxes", 
      image: "checkboxes.png",
      tags: ["checkbox", "checkbox section", "checkbox content", "checkbox image", "checkbox link"] 
    },
    { 
      name: "Toggles", 
      link: "/playground/application/toggles", 
      image: "toggles.png",
      tags: ["toggle", "toggle section", "toggle content", "toggle image", "toggle link"] 
    },
    { 
      name: "Selects", 
      link: "/playground/application/selects", 
      image: "selects.png",
      tags: ["select", "select section", "select content", "select image", "select link"] 
    },
    { 
      name: "Radio Groups", 
      link: "/playground/application/radiogroups", 
      image: "radiogroups.png",
      tags: ["radio group", "radio group section", "radio group content", "radio group image", "radio group link"] 
    }, */
  ],
  // Elements
  elements: [
    { 
      name: "Typography", 
      link: "/playground/application/typography", 
      image: "type.png",
      tags: ["typography", "typography section", "typography content", "typography image", "typography link"],
    },
    { 
      name: "Buttons", 
      link: "/playground/application/buttons", 
      image: "buttons.png",
      tags: ["button", "button section", "button content", "button image", "button link"],
    },
    { 
      name: "Empty states", 
      link: "/playground/application/emptyStates", 
      image: "emptystates.png",
      tags: ["empty state", "empty state section", "empty state content", "empty state image", "empty state link"],
    },
    { 
      name: "Avatars", 
      link: "/playground/application/avatars", 
      image: "avatars.png",
      tags: ["avatar", "avatar section", "avatar content", "avatar image", "avatar link"],
    },
    { 
      name: "Tables", 
      link: "/playground/application/tables", 
      image: "tables.png",
      tags: ["table", "table section", "table content", "table image", "table link"],
    },
  ],
};

// Export sections
export const { pageSections, pageExamples, navigation, overlay, forms, elements, } = templates;

// Export all entries by name
export const byName = {
  // Marketing
  pageSections: Object.fromEntries(pageSections.map(template => [template.name, template])),
  pageExamples: Object.fromEntries(pageExamples.map(template => [template.name, template])),
  // Application
  navigation: Object.fromEntries(navigation.map(template => [template.name, template])),
  forms: Object.fromEntries(forms.map(template => [template.name, template])),
  overlay: Object.fromEntries(overlay.map(template => [template.name, template])),
  elements: Object.fromEntries(elements.map(template => [template.name, template])),
};

export const allEntries = Object.values(byName).flatMap(category => Object.values(category));
