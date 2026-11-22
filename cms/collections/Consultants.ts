import { editorialCollection, orderField, slugField } from '../fields';

export const Consultants = editorialCollection({
  slug: 'consultants',
  labels: { singular: { vi: 'Chuyên gia', en: 'Consultant' }, plural: { vi: 'Đội ngũ tư vấn', en: 'Consultants' } },
  admin: { group: { vi: 'Con người & Tổ chức', en: 'People & Organization' }, useAsTitle: 'name', defaultColumns: ['name', 'position', 'order', '_status'] },
  defaultSort: 'order',
  fields: [
    { name: 'name', type: 'text', required: true, maxLength: 120 },
    slugField('name'),
    { name: 'honorific', type: 'text', localized: true, maxLength: 40, admin: { description: 'e.g. TS., ThS., PGS.TS. / Dr., MSc.' } },
    { name: 'position', type: 'text', localized: true, required: true, maxLength: 160 },
    { name: 'summary', type: 'textarea', localized: true, maxLength: 500 },
    { name: 'biography', type: 'richText', localized: true },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    { name: 'expertise', type: 'relationship', relationTo: 'expertise', hasMany: true },
    { name: 'organizationUnit', type: 'relationship', relationTo: 'organization', admin: { position: 'sidebar' } },
    {
      name: 'email',
      type: 'email',
      admin: { description: 'Optional. Only shown publicly if "Show email" is ticked.' },
    },
    { name: 'showEmail', type: 'checkbox', defaultValue: false },
    orderField,
    { name: 'projects', type: 'join', collection: 'projects', on: 'consultants' },
  ],
  access: {},
  hooks: {
    afterRead: [
      ({ doc, req }) => {
        // Hide private e-mail addresses from anonymous visitors.
        if (!req.user && !doc.showEmail) {
          delete doc.email;
        }
        return doc;
      },
    ],
  },
});
