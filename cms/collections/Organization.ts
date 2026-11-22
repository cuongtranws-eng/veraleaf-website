import { editorialCollection, orderField } from '../fields';

/**
 * Units of the organisational chart (board, departments, specialist teams).
 * Units with no parent form the top level of the chart.
 */
export const Organization = editorialCollection({
  slug: 'organization',
  labels: { singular: { vi: 'Đơn vị', en: 'Organization unit' }, plural: { vi: 'Sơ đồ tổ chức', en: 'Organization' } },
  admin: {
    group: { vi: 'Con người & Tổ chức', en: 'People & Organization' },
    useAsTitle: 'name',
    defaultColumns: ['name', 'parent', 'order', '_status'],
    description: 'Units of the organisational chart. Units without a parent are shown at the top level.',
  },
  defaultSort: 'order',
  fields: [
    { name: 'name', type: 'text', localized: true, required: true, maxLength: 160 },
    { name: 'description', type: 'textarea', localized: true, maxLength: 600 },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'organization',
      admin: { position: 'sidebar' },
      validate: (value: unknown, { id }: { id?: string | number }) => {
        if (value && id !== undefined && String(value) === String(id)) return 'A unit cannot be its own parent.';
        return true;
      },
    },
    { name: 'head', type: 'relationship', relationTo: 'consultants', admin: { description: 'Person leading this unit.' } },
    orderField,
  ],
});
