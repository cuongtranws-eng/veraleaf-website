import path from 'path';
import { fileURLToPath } from 'url';
import type { CollectionConfig } from 'payload';
import { isAdmin, isStaff } from '../access';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: { vi: 'Tệp', en: 'Media' }, plural: { vi: 'Thư viện ảnh & tệp', en: 'Media' } },
  admin: { group: { vi: 'Nội dung', en: 'Content' }, useAsTitle: 'filename', defaultColumns: ['filename', 'alt', 'mimeType', 'updatedAt'] },
  access: {
    // Uploaded files are referenced by public pages, so they are publicly readable.
    read: () => true,
    create: isStaff,
    update: isStaff,
    delete: isAdmin,
  },
  upload: {
    staticDir: path.resolve(dirname, '../../media'),
    // SVG is intentionally not allowed: SVG files served from this origin can carry scripts (XSS).
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'application/pdf'],
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 800, height: 600, position: 'centre' },
      { name: 'hero', width: 1920, withoutEnlargement: true },
    ],
    adminThumbnail: 'thumbnail',
    focalPoint: true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      localized: true,
      required: true,
      maxLength: 250,
      admin: { description: 'Describe the image for screen readers (required for accessibility).' },
    },
    { name: 'caption', type: 'text', localized: true, maxLength: 300 },
    { name: 'credit', type: 'text', maxLength: 200, admin: { description: 'Photographer / copyright holder.' } },
  ],
};
