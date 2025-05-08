import type { UserRecord } from 'firebase-admin/auth';
import type { AstroGlobal } from 'astro';

/**
 * Get the user's preferred theme color from custom claims or cookies
 * @param user Firebase user record
 * @param defaultTheme Default theme color if user has no preference
 * @param Astro Optional Astro global to check cookies
 * @returns Theme color name (lowercase)
 */
export function getUserThemeColor(user: UserRecord | null, defaultTheme = 'blue', Astro?: AstroGlobal): string {
  // First check user's custom claims if available
  if (user && user.customClaims && user.customClaims.themeColor) {
    return user.customClaims.themeColor as string;
  }

  // For server components, we can check for cookies as fallback
  if (Astro) {
    const themeCookie = Astro.cookies.get('oxbow_theme_color');
    if (themeCookie?.value) {
      return themeCookie.value.toLowerCase();
    }
  }
  
  // Default fallback
  return defaultTheme;
} 