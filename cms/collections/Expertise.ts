import { editorialCollection, orderField, slugField } from '../fields';

export const Expertise = editorialCollection({
  slug: 'expertise',
  labels: { singular: { vi: 'Lĩnh vực', en: 'Expertise area' }, plural: { vi: 'Lĩnh vực hoạt động', en: 'Expertise' } },
  admin: { group: { vi: 'Nội dung', en: 'Content' }, useAsTitle: 'title', defaultColumns: ['title', 'slug', 'order', '_status'] },
  defaultSort: 'order',
  fields: [
    { name: 'title', type: 'text', localized: true, required: true, maxLength: 120 },
    slugField('title'),
    {
      name: 'summary',
      type: 'textarea',
      localized: true,
      required: true,
      maxLength: 400,
      admin: { description: 'Short description shown on the home page and expertise cards.' },
    },
    { name: 'description', type: 'richText', localized: true, label: 'Approach and services' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    orderField,
    {
      name: 'relatedProjects',
      type: 'join',
      collection: 'projects',
      on: 'expertise',
      admin: { description: 'Projects tagged with this expertise area.' },
    },
  ],
});
