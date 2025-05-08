import type { APIRoute } from "astro";
import { getAuth } from "firebase-admin/auth";
import { app } from "@/firebase/server";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const auth = getAuth(app);

  // Check if user is authenticated
  if (!cookies.has("__session")) {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const sessionCookie = cookies.get("__session").value;
    const decodedCookie = await auth.verifySessionCookie(sessionCookie);
    const uid = decodedCookie.uid;

    // Get the theme color from the request body
    const { themeColor } = await request.json();
    
    if (!themeColor) {
      return new Response(
        JSON.stringify({ error: "Theme color is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Get current custom claims
    const user = await auth.getUser(uid);
    const currentClaims = user.customClaims || {};

    // Update custom claims with theme color preference
    await auth.setCustomUserClaims(uid, {
      ...currentClaims,
      themeColor: themeColor.toLowerCase()
    });

    return new Response(
      JSON.stringify({ success: true, themeColor }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error updating theme preference:", error);
    return new Response(
      JSON.stringify({ error: "Failed to update theme preference" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}; 