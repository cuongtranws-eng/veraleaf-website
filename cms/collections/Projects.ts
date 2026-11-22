import { editorialCollection, slugField } from '../fields';

/** Slugs used by the project tabs (/projects/all, /projects/ongoing, /projects/completed). */
export const PROJECT_RESERVED_SLUGS = ['all', 'ongoing', 'completed'];

export const Projects = editorialCollection({
  slug: 'projects',
  labels: { singular: { vi: 'Dự án', en: 'Project' }, plural: { vi: 'Dự án', en: 'Projects' } },
  admin: {
    group: { vi: 'Nội dung', en: 'Content' },
    useAsTitle: 'title',
    defaultColumns: ['title', 'projectStatus', 'startDate', '_status', 'archived'],
  },
  defaultSort: '-startDate',
  fields: [
    { name: 'title', type: 'text', localized: true, required: true, maxLength: 250 },
    slugField('title', PROJECT_RESERVED_SLUGS),
    {
      name: 'projectStatus',
      type: 'select',
      required: true,
      defaultValue: 'ongoing',
      index: true,
      options: [
        { label: 'Ongoing', value: 'ongoing' },
        { label: 'Completed', value: 'completed' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'summary', type: 'textarea', localized: true, required: true, maxLength: 600 },
    { name: 'content', type: 'richText', localized: true },
    { name: 'featuredImage', type: 'upload', relationTo: 'media' },
    {
      type: 'row',
      fields: [
        { name: 'startDate', type: 'date', admin: { date: { pickerAppearance: 'monthOnly', displayFormat: 'MM/yyyy' } } },
        {
          name: 'endDate',
          type: 'date',
          admin: { date: { pickerAppearance: 'monthOnly', displayFormat: 'MM/yyyy' } },
          validate: (value: unknown, { siblingData }: { siblingData: { startDate?: string } }) => {
            if (value && siblingData?.startDate && new Date(value as string) < new Date(siblingData.startDate)) {
              return 'End date must be after the start date.';
            }
            return true;
          },
        },
      ],
    },
    { name: 'location', type: 'text', localized: true, maxLength: 200 },
    { name: 'client', type: 'text', localized: true, maxLength: 200, admin: { description: 'Client / commissioning organisation.' } },
    { name: 'expertise', type: 'relationship', relationTo: 'expertise', hasMany: true, index: true },
    { name: 'consultants', type: 'relationship', relationTo: 'consultants', hasMany: true, label: 'Project team' },
    { name: 'partners', type: 'relationship', relationTo: 'partners', hasMany: true },
    { name: 'featured', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar', description: 'Highlight on the home page.' } },
  ],
});
