export const ACCESS_ERROR = 'Access restricted. Please login using your official domain email.';

export function isAuthorizedEmail(email?: string | null): boolean {
  if (typeof email !== 'string') return false;
  const normalized = email.trim().toLowerCase();
  const at = normalized.indexOf('@');
  return at > 0 && at === normalized.lastIndexOf('@') && normalized.slice(at + 1) === 'hbplus.fit';
}
