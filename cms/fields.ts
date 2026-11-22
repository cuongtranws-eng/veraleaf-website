import type { CollectionConfig, Field, TextFieldSingleValidation } from 'payload';
import { isAdmin, isStaff, publishedOrStaff } from './access';

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Turn a (possibly Vietnamese) title into a URL-safe slug. */
export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96);
}

/**
 * Non-localized, unique slug used in public URLs (/vi/... and /en/... share it).
 * Auto-generated from `sourceField` when left empty.
 * `reserved` lists slugs that collide with existing static routes/tabs.
 */
export function slugField(sourceField = 'title', reserved: string[] = []): Field {
  const validate: TextFieldSingleValidation = (value) => {
    if (!value) return true; // filled by the hook below
    if (!SLUG_PATTERN.test(value)) return 'Use lowercase letters, numbers and single hyphens only (e.g. "climate-risk-study").';
    if (reserved.includes(value)) return `"${value}" is reserved by the website navigation. Choose another slug.`;
    return true;
  };
  return {
    name: 'slug',
    type: 'text',
    index: true,
    unique: true,
    maxLength: 96,
    validate,
    admin: {
      position: 'sidebar',
      description: 'URL segment. Leave empty to generate it from the title.',
    },
    hooks: {
      beforeValidate: [
        ({ value, data, originalDoc }) => {
          if (typeof value === 'string' && value.trim()) return slugify(value);
          const source = data?.[sourceField] ?? originalDoc?.[sourceField];
          // Localized fields arrive as a string for the current locale.
          if (typeof source === 'string' && source.trim()) {
            const generated = slugify(source);
            return reserved.includes(generated) ? `${generated}-1` : generated;
          }
          return value;
        },
      ],
    },
  };
}

export const archivedField: Field = {
  name: 'archived',
  type: 'checkbox',
  defaultValue: false,
  index: true,
  label: 'Archived',
  admin: {
    position: 'sidebar',
    description: 'Archived content stays in the CMS but is hidden from the public website.',
  },
};

export const orderField: Field = {
  name: 'order',
  type: 'number',
  defaultValue: 100,
  admin: { position: 'sidebar', description: 'Lower numbers are shown first.' },
};

/**
 * Shared configuration for editorial collections:
 * draft / published workflow (Payload versions), an "archived" flag,
 * public read of published content only, staff-only writes, admin-only delete.
 */
export function editorialCollection(
  config: Omit<CollectionConfig, 'access' | 'versions'> & { access?: CollectionConfig['access'] },
): CollectionConfig {
  return {
    ...config,
    access: {
      read: publishedOrStaff,
      create: isStaff,
      update: isStaff,
      delete: isAdmin,
      readVersions: isStaff,
      ...config.access,
    },
    versions: { drafts: { autosave: false }, maxPerDoc: 25 },
    fields: [...config.fields, archivedField],
  };
}

export function validateUrl(value: unknown): true | string {
  if (value === null || value === undefined || value === '') return true;
  if (typeof value !== 'string') return 'Invalid URL';
  try {
    const u = new URL(value);
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return 'URL must start with http:// or https://';
    return true;
  } catch {
    return 'Enter a full URL, e.g. https://example.org';
  }
}
