import type { GlobalConfig } from 'payload';
import { isStaff } from '../access';
import { validateUrl } from '../fields';

/**
 * Company Information is a singleton (one record for the whole site),
 * so it is modelled as a Payload Global rather than a list collection.
 */
export const CompanyInformation: GlobalConfig = {
  slug: 'company-information',
  label: { vi: 'Thông tin công ty', en: 'Company Information' },
  admin: { group: { vi: 'Cài đặt', en: 'Settings' } },
  access: { read: () => true, update: isStaff },
  versions: { drafts: false, max: 20 },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: { vi: 'Thông tin chung', en: 'General' },
          fields: [
            { name: 'companyName', type: 'text', localized: true, required: true, defaultValue: 'Veraleaf', maxLength: 200 },
            {
              name: 'slogan',
              type: 'text',
              localized: true,
              maxLength: 80,
              admin: { description: 'Large heading on the home page hero, e.g. "In Leaf We Trust". The last word is highlighted.' },
            },
            {
              name: 'tagline',
              type: 'textarea',
              localized: true,
              maxLength: 300,
              admin: { description: 'Sentence under the slogan and in the footer, e.g. "Chiếc lá tin cậy – Vì một tương lai xanh và công bằng".' },
            },
            { name: 'legalName', type: 'text', localized: true, maxLength: 250 },
            { name: 'taxCode', type: 'text', maxLength: 40, label: 'Tax / business registration code' },
            { name: 'foundedYear', type: 'number', min: 1900, max: 2100 },
            {
              name: 'aboutText',
              type: 'textarea',
              localized: true,
              maxLength: 1200,
              admin: { description: 'Shown in the "About Veraleaf" section on the home page and the About overview.' },
            },
            {
              name: 'philosophyText',
              type: 'textarea',
              localized: true,
              maxLength: 400,
              admin: { description: 'Quote shown under "Our perspective" on the home page.' },
            },
            { name: 'mission', type: 'textarea', localized: true, maxLength: 1200 },
            { name: 'vision', type: 'textarea', localized: true, maxLength: 1200 },
            { name: 'generalInformation', type: 'richText', localized: true, label: 'General information page content' },
            {
              name: 'organizationNote',
              type: 'textarea',
              localized: true,
              maxLength: 600,
              admin: { description: 'Optional note under the organisational chart.' },
            },
          ],
        },
        {
          label: { vi: 'Liên hệ', en: 'Contact' },
          fields: [
            { name: 'email', type: 'email' },
            { name: 'phone', type: 'text', maxLength: 40 },
            { name: 'phone2', type: 'text', maxLength: 40, label: 'Second phone' },
            { name: 'address', type: 'textarea', localized: true, maxLength: 400 },
            { name: 'officeHours', type: 'text', localized: true, maxLength: 200 },
            { name: 'mapUrl', type: 'text', validate: validateUrl, label: 'Map link' },
            {
              name: 'socialLinks',
              type: 'array',
              maxRows: 10,
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  required: true,
                  options: ['facebook', 'linkedin', 'youtube', 'zalo', 'x', 'website'].map((v) => ({ label: v, value: v })),
                },
                { name: 'url', type: 'text', required: true, validate: validateUrl },
              ],
            },
          ],
        },
      ],
    },
  ],
};
