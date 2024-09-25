export interface Template {
  link: string;
  name: string;
  image: string;
}

// Define the templates in a structured array format
const templates: { [key: string]: Template[] } = {
  // Page sections
  pageSections: [
    { name: "Hero Sections", link: "/playground/marketing/hero", image: "heros.png" },
    { name: "Features Sections", link: "/playground/marketing/features", image: "features.png" },
    { name: "Timeline Sections", link: "/playground/marketing/timeline", image: "timeline.png" },
    { name: "Steps Sections", link: "/playground/marketing/steps", image: "steps.png" },
    { name: "Pricing Sections", link: "/playground/marketing/pricing", image: "pricing.png" },
    { name: "Faq Sections", link: "/playground/marketing/faq", image: "faq.png" },
    { name: "Team Sections", link: "/playground/marketing/team", image: "team.png" },
    { name: "Blog Entries", link: "/playground/marketing/blog-entries", image: "blogEntries.png" },
    { name: "Blog Content", link: "/playground/marketing/blog-content", image: "blogContent.png" },
    { name: "Testimonials", link: "/playground/marketing/testimonials", image: "testimonials.png" },
    { name: "Logo Clouds", link: "/playground/marketing/logo-clouds", image: "logoclouds.png" },
    { name: "Stats Sections", link: "/playground/marketing/stats", image: "stats.png" },
    { name: "Footers", link: "/playground/marketing/footers", image: "footers.png" },
    { name: "Status Sections", link: "/playground/marketing/status", image: "status.png" },
    { name: "Contact Sections", link: "/playground/marketing/contact", image: "contact.png" },
    { name: "Newsletter Call to Action", link: "/playground/marketing/cta-newsletter", image: "newsletter.png" },
    { name: "Call to Actions", link: "/playground/marketing/cta", image: "cta.png" },
  ],
  // Page Examples
   pageExamples: [
     { name: "Landing Pages", link: "/playground/marketing/landing-pages", image: "landingPages.png" },
     { name: "Pricing Pages", link: "/playground/marketing/pricing-pages", image: "pricingPages.png" },
     ],
  // Elements
  elements: [
    { name: "Buttons", link: "/playground/application/buttons", image: "buttons.png" },
    { name: "Badges", link: "/playground/application/badges", image: "badges.png" },
    { name: "Banners", link: "/playground/application/banners", image: "banners.png" },
    { name: "Alerts", link: "/playground/application/alerts", image: "alerts.png" },
    { name: "Emptystates", link: "/playground/application/emptyStates", image: "emptystates.png" },
    { name: "Avatars", link: "/playground/application/avatars", image: "avatars.png" },
    { name: "Tables", link: "/playground/application/tables", image: "tables.png" },
  ],
  // Navigation
  navigation: [
    { name: "Navbars", link: "/playground/application/navbars", image: "navbars.png" },
    { name: "Flyout menus", link: "/playground/application/flyouts", image: "flyouts.png" },
    { name: "Sidebars", link: "/playground/application/sidebars", image: "sidebars.png" },
    { name: "Vertical navigation", link: "/playground/application/verticalnav", image: "verticalnav.png" },
    { name: "Breadcrumbs", link: "/playground/application/breadcrumbs", image: "breadcrumbs.png" },
    { name: "Pagination", link: "/playground/application/pagination", image: "pagination.png" },
    { name: "Tabs", link: "/playground/application/tabs", image: "tabs.png" },
    { name: "Command Bar", link: "/playground/application/commandbar", image: "commandbar.png" },
  ],
  // Overlays
  overlay: [
    { name: "Modals", link: "/playground/application/modals", image: "modals.png" },
    { name: "Slideover", link: "/playground/application/slideover", image: "slideover.png" },
    { name: "Notifications", link: "/playground/application/notifications", image: "notifications.png" },
  ],
  // Forms
  forms: [
    { name: "Sign Up", link: "/playground/application/sign-up", image: "signUp.png" },
    { name: "Sign In", link: "/playground/application/sign-in", image: "signIn.png" },
    { name: "Form Layouts", link: "/playground/application/formlayouts", image: "formlayouts.png" },
    { name: "Inputs", link: "/playground/application/inputs", image: "inputs.png" },
    { name: "Textarea", link: "/playground/application/textarea", image: "textarea.png" },
    { name: "Checkboxes", link: "/playground/application/checkboxes", image: "checkboxes.png" },
    { name: "Toggles", link: "/playground/application/toggles", image: "toggles.png" },
    { name: "Selects", link: "/playground/application/selects", image: "selects.png" },
    { name: "Radio Groups", link: "/playground/application/radiogroups", image: "radiogroups.png" },
  ],
};

// Export sections
export const { pageSections, pageExamples, elements, navigation, overlay, forms } = templates;

// Export all entries by name
export const byName = {
  // Marketing
  pageSections: Object.fromEntries(pageSections.map(template => [template.name, template])),
  pageExamples: Object.fromEntries(pageSections.map(template => [template.name, template])),
  // Application
  elements: Object.fromEntries(elements.map(template => [template.name, template])),
  navigation: Object.fromEntries(navigation.map(template => [template.name, template])),
  overlay: Object.fromEntries(overlay.map(template => [template.name, template])),
  forms: Object.fromEntries(forms.map(template => [template.name, template])),
};

export const allEntries = Object.values(byName).flatMap(category => Object.values(category));
