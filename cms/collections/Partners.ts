import { editorialCollection, orderField, slugField, validateUrl } from '../fields';

export const Partners = editorialCollection({
  slug: 'partners',
  labels: { singular: { vi: 'Đối tác', en: 'Partner' }, plural: { vi: 'Đối tác', en: 'Partners' } },
  admin: { group: { vi: 'Nội dung', en: 'Content' }, useAsTitle: 'name', defaultColumns: ['name', 'partnerType', 'order', '_status'] },
  defaultSort: 'order',
  fields: [
    { name: 'name', type: 'text', localized: true, required: true, maxLength: 200 },
    slugField('name'),
    {
      name: 'partnerType',
      type: 'select',
      required: true,
      defaultValue: 'partner',
      options: [
        { label: 'Client', value: 'client' },
        { label: 'Partner', value: 'partner' },
        { label: 'Donor / Funder', value: 'donor' },
        { label: 'Research institution', value: 'research' },
        { label: 'Government', value: 'government' },
      ],
    },
    { name: 'description', type: 'textarea', localized: true, maxLength: 600 },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    { name: 'website', type: 'text', validate: validateUrl },
    {
      name: 'approvedForPublicDisplay',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Confirm the partner agreed to have their name / logo shown.' },
    },
    orderField,
    { name: 'projects', type: 'join', collection: 'projects', on: 'partners' },
  ],
});
