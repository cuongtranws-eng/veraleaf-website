import type { CollectionConfig } from 'payload';
import { ROLES, hasRole, isAdmin, isAdminField, isAdminOrSelf } from '../access';

const isProd = process.env.NODE_ENV === 'production';

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: { vi: 'Người dùng', en: 'User' }, plural: { vi: 'Người dùng', en: 'Users' } },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'roles', 'updatedAt'],
    group: { vi: 'Quản trị', en: 'Administration' },
  },
  auth: {
    tokenExpiration: 60 * 60 * 8, // 8 hours
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000, // 15 minutes
    cookies: { secure: isProd, sameSite: 'Lax' },
  },
  access: {
    // Only users holding a role may open /admin.
    admin: ({ req: { user } }) => hasRole(user as never, 'admin', 'editor'),
    create: isAdmin,
    read: isAdminOrSelf,
    update: isAdminOrSelf,
    delete: isAdmin,
    unlock: isAdmin,
  },
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        // The very first account (created through /admin/create-first-user) becomes an admin.
        if (operation === 'create') {
          const { totalDocs } = await req.payload.count({ collection: 'users', overrideAccess: true, req });
          if (totalDocs === 0) data.roles = ['admin'];
        }
        return data;
      },
    ],
    beforeDelete: [
      async ({ id, req }) => {
        // Never allow the last administrator to be removed.
        const admins = await req.payload.find({
          collection: 'users',
          where: { roles: { contains: 'admin' } },
          limit: 2,
          depth: 0,
          overrideAccess: true,
          req,
        });
        if (admins.totalDocs <= 1 && admins.docs.some((u) => u.id === id)) {
          throw new Error('Cannot delete the last administrator.');
        }
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text', required: true, maxLength: 120 },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: ['editor'],
      saveToJWT: true,
      options: ROLES.map((r) => ({ label: r === 'admin' ? 'Administrator' : 'Editor', value: r })),
      access: { create: isAdminField, update: isAdminField },
      admin: {
        position: 'sidebar',
        description: 'Administrators manage users and settings. Editors manage website content.',
      },
    },
  ],
};
