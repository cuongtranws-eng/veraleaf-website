import type { Access, FieldAccess, Where } from 'payload';

export const ROLES = ['admin', 'editor'] as const;
export type Role = (typeof ROLES)[number];

type MaybeUser = { id?: string | number; roles?: Role[] | null; collection?: string } | null | undefined;

export function hasRole(user: MaybeUser, ...roles: Role[]): boolean {
  if (!user || user.collection !== 'users') return false;
  return Array.isArray(user.roles) && user.roles.some((r) => roles.includes(r));
}

/** Only administrators. */
export const isAdmin: Access = ({ req: { user } }) => hasRole(user as MaybeUser, 'admin');

/** Administrators and editors (staff). */
export const isStaff: Access = ({ req: { user } }) => hasRole(user as MaybeUser, 'admin', 'editor');

export const isAdminField: FieldAccess = ({ req: { user } }) => hasRole(user as MaybeUser, 'admin');

/** Admins see every user; any other signed-in user only sees / edits themself. */
export const isAdminOrSelf: Access = ({ req: { user } }) => {
  if (hasRole(user as MaybeUser, 'admin')) return true;
  if (user) return { id: { equals: user.id } };
  return false;
};

/** Constraint applied to anonymous (public website) reads of editorial content. */
export const publicContentWhere: Where = {
  and: [{ _status: { equals: 'published' } }, { archived: { not_equals: true } }],
};

/**
 * Staff can read everything (drafts, archived). The public can only read
 * published, non-archived documents.
 */
export const publishedOrStaff: Access = ({ req: { user } }) => {
  if (hasRole(user as MaybeUser, 'admin', 'editor')) return true;
  return publicContentWhere;
};
