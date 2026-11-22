import { editorialCollection, slugField, validateUrl } from '../fields';
import { INSIGHT_RESERVED_SLUGS } from './Insights';

export const Publications = editorialCollection({
  slug: 'publications',
  labels: { singular: { vi: 'Ấn phẩm', en: 'Publication' }, plural: { vi: 'Ấn phẩm', en: 'Publications' } },
  admin: { group: { vi: 'Nội dung', en: 'Content' }, useAsTitle: 'title', defaultColumns: ['title', 'publicationType', 'year', '_status', 'archived'] },
  defaultSort: '-year',
  fields: [
    { name: 'title', type: 'text', localized: true, required: true, maxLength: 300 },
    slugField('title', INSIGHT_RESERVED_SLUGS),
    {
      name: 'publicationType',
      type: 'select',
      required: true,
      defaultValue: 'report',
      options: [
        { label: 'Research report', value: 'report' },
        { label: 'Journal article', value: 'article' },
        { label: 'Book / chapter', value: 'book' },
        { label: 'Policy brief', value: 'brief' },
        { label: 'Conference paper', value: 'conference' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'year',
      type: 'number',
      required: true,
      min: 1990,
      max: 2100,
      admin: { position: 'sidebar' },
    },
    { name: 'abstract', type: 'textarea', localized: true, required: true, maxLength: 2000 },
    { name: 'authors', type: 'relationship', relationTo: 'consultants', hasMany: true, label: 'Veraleaf authors' },
    { name: 'externalAuthors', type: 'text', maxLength: 500, admin: { description: 'Other authors, comma separated.' } },
    { name: 'publisher', type: 'text', localized: true, maxLength: 250, admin: { description: 'Journal, publisher or organisation.' } },
    { name: 'doi', type: 'text', maxLength: 200, label: 'DOI' },
    { name: 'externalUrl', type: 'text', validate: validateUrl, label: 'External link' },
    { name: 'file', type: 'upload', relationTo: 'media', admin: { description: 'PDF of the publication (optional).' } },
    { name: 'expertise', type: 'relationship', relationTo: 'expertise', hasMany: true },
    { name: 'relatedProjects', type: 'relationship', relationTo: 'projects', hasMany: true },
  ],
});
