import type { CollectionConfig } from 'payload';
import { isAdmin, isStaff } from '../access';

/**
 * Enquiries submitted through the public contact form.
 * The public never talks to this collection directly: the website's server
 * action validates, rate-limits and then writes via the Local API.
 * Over REST/GraphQL only staff can read or update and only admins can create/delete.
 */
export const ContactMessages: CollectionConfig = {
  slug: 'contact-messages',
  labels: { singular: { vi: 'Tin nhắn liên hệ', en: 'Contact message' }, plural: { vi: 'Tin nhắn liên hệ', en: 'Contact messages' } },
  admin: {
    group: { vi: 'Quản trị', en: 'Administration' },
    useAsTitle: 'subject',
    defaultColumns: ['subject', 'name', 'email', 'status', 'createdAt'],
  },
  defaultSort: '-createdAt',
  access: {
    read: isStaff,
    create: isAdmin,
    update: isStaff,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      index: true,
      options: [
        { label: 'New', value: 'new' },
        { label: 'In progress', value: 'in-progress' },
        { label: 'Replied', value: 'replied' },
        { label: 'Archived', value: 'archived' },
        { label: 'Spam', value: 'spam' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'name', type: 'text', required: true, minLength: 2, maxLength: 120 },
    { name: 'email', type: 'email', required: true },
    { name: 'organization', type: 'text', maxLength: 200 },
    { name: 'phone', type: 'text', maxLength: 40 },
    { name: 'subject', type: 'text', required: true, minLength: 3, maxLength: 200 },
    { name: 'message', type: 'textarea', required: true, minLength: 10, maxLength: 5000 },
    {
      name: 'locale',
      type: 'select',
      options: [
        { label: 'Tiếng Việt', value: 'vi' },
        { label: 'English', value: 'en' },
      ],
      admin: { position: 'sidebar', readOnly: true },
    },
    { name: 'internalNotes', type: 'textarea', maxLength: 5000, admin: { description: 'Visible to staff only.' } },
  ],
};
