import { editorialCollection, slugField } from '../fields';

/** Slugs used by the insight tabs (/insights/news, /insights/articles, /insights/publications). */
export const INSIGHT_RESERVED_SLUGS = ['news', 'articles', 'publications'];

export const Insights = editorialCollection({
  slug: 'insights',
  labels: { singular: { vi: 'Bài viết', en: 'Insight' }, plural: { vi: 'Góc nhìn & Tin tức', en: 'Insights' } },
  admin: { group: { vi: 'Nội dung', en: 'Content' }, useAsTitle: 'title', defaultColumns: ['title', 'category', 'publishedAt', '_status', 'archived'] },
  defaultSort: '-publishedAt',
  fields: [
    { name: 'title', type: 'text', localized: true, required: true, maxLength: 250 },
    slugField('title', INSIGHT_RESERVED_SLUGS),
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'news',
      index: true,
      options: [
        { label: 'News & Updates', value: 'news' },
        { label: 'Insights & Articles', value: 'articles' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'publishedAt',
      type: 'date',
      index: true,
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } },
      hooks: {
        beforeChange: [({ value, siblingData }) => value || (siblingData?._status === 'published' ? new Date().toISOString() : value)],
      },
    },
    { name: 'excerpt', type: 'textarea', localized: true, required: true, maxLength: 400 },
    { name: 'content', type: 'richText', localized: true },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    { name: 'authors', type: 'relationship', relationTo: 'consultants', hasMany: true },
    { name: 'expertise', type: 'relationship', relationTo: 'expertise', hasMany: true },
    { name: 'relatedProjects', type: 'relationship', relationTo: 'projects', hasMany: true },
  ],
});
