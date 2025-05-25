import type { UserRecord } from "firebase-admin/auth";

/**
 * Determines if a user can see the code for a given component
 * @param user - The authenticated user (null if not logged in)
 * @param isFreeComponent - Whether this component is marked as free
 * @returns boolean indicating if the user can see the code
 */
export function canSeeCode(user: UserRecord | null, isFreeComponent: boolean = false): boolean {
  return user !== null || isFreeComponent;
}

/**
 * Determines if CSS obfuscation should be skipped for a given path
 * @param pathname - The request pathname
 * @param mode - The current environment mode
 * @param isFreeComponent - Whether this component is marked as free (optional, defaults to checking if it's component 01)
 * @returns boolean indicating if CSS obfuscation should be skipped
 */
export function shouldSkipCSSObfuscation(pathname: string, mode: string, isFreeComponent?: boolean): boolean {
  // Skip obfuscation in development mode
  if (mode === "development") {
    return true;
  }
  
  // Skip obfuscation for non-iframe paths
  if (!pathname.startsWith("/iframe/")) {
    return true;
  }
  
  // If isFreeComponent is explicitly provided, use it
  if (isFreeComponent === true) {
    return true;
  }
  
  return false;
}