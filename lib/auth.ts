// Hardcoded admin credentials, as requested. Not suitable for production use.
export const ADMIN_USERNAME = "admin";
export const ADMIN_PASSWORD = "12345";

export const SESSION_COOKIE = "admin_session";
export const SESSION_TOKEN = "sunday-admin-session-v1";

export function isValidSession(value: string | undefined): boolean {
  return value === SESSION_TOKEN;
}
