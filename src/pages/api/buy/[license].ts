import type { APIRoute } from "astro";

const individualLicenseUrl = import.meta.env.PRODUCT_INDIVIDUAL_LICENSE_URL;
const teamLicenseUrl = import.meta.env.PRODUCT_TEAM_LICENSE_URL;

const fallbackUrl = '/404';

export const GET: APIRoute = async ({ params, redirect }) => {
  switch (params.license) {
    case "individual":
      return redirect(individualLicenseUrl || fallbackUrl)
    case "team":
      return redirect(teamLicenseUrl || fallbackUrl)
    default:
      return redirect(fallbackUrl)
  }
}