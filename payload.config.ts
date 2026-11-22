import path from 'path';
import { fileURLToPath } from 'url';
import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { nodemailerAdapter } from '@payloadcms/email-nodemailer';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { en } from '@payloadcms/translations/languages/en';
import { vi } from '@payloadcms/translations/languages/vi';
import sharp from 'sharp';

import { Users } from './cms/collections/Users';
import { Media } from './cms/collections/Media';
import { Organization } from './cms/collections/Organization';
import { Consultants } from './cms/collections/Consultants';
import { Expertise } from './cms/collections/Expertise';
import { Projects } from './cms/collections/Projects';
import { Insights } from './cms/collections/Insights';
import { Publications } from './cms/collections/Publications';
import { Partners } from './cms/collections/Partners';
import { ContactMessages } from './cms/collections/ContactMessages';
import { CompanyInformation } from './cms/globals/CompanyInformation';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// All credentials come from the environment (see .env.example). Nothing is hardcoded.
const secret = process.env.PAYLOAD_SECRET || '';
if (process.env.NODE_ENV === 'production' && secret && secret.length < 32) {
  throw new Error('PAYLOAD_SECRET is too short. Use at least 32 random characters in production.');
}
const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
const allowedOrigins = [serverURL, ...(process.env.PAYLOAD_ALLOWED_ORIGINS || '').split(',')]
  .map((o) => o.trim())
  .filter(Boolean);

export default buildConfig({
  serverURL,
  secret,
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: ' — VeraLeaf CMS',
      description: 'VeraLeaf website content management',
      icons: [{ rel: 'icon', type: 'image/png', url: '/brand/veraleaf-logo.png' }],
    },
    dateFormat: 'dd/MM/yyyy',
    // Dark botanical theme to match the website (colours in app/(payload)/custom.css)
    theme: 'dark',
    components: {
      graphics: {
        Logo: '/cms/admin/Logo#Logo',
        Icon: '/cms/admin/Icon#Icon',
      },
      beforeLogin: ['/cms/admin/BeforeLogin#BeforeLogin'],
      beforeDashboard: ['/cms/admin/BeforeDashboard#BeforeDashboard'],
    },
  },
  collections: [Expertise, Projects, Insights, Publications, Partners, Media, Consultants, Organization, ContactMessages, Users],
  globals: [CompanyInformation],
  localization: {
    locales: [
      { label: 'Tiếng Việt', code: 'vi' },
      { label: 'English', code: 'en' },
    ],
    defaultLocale: 'vi',
    fallback: true,
  },
  // Admin UI in Vietnamese by default; each user can switch to English under Account.
  i18n: { supportedLanguages: { vi, en }, fallbackLanguage: 'vi' },
  editor: lexicalEditor(),
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || '' },
    migrationDir: path.resolve(dirname, 'migrations'),
    // In development the schema is pushed automatically; production uses migrations only.
    push: process.env.PAYLOAD_DB_PUSH === 'false' ? false : undefined,
  }),
  sharp,
  // Outgoing e-mail (password reset, account emails). Enabled only when SMTP_HOST is set;
  // otherwise Payload just logs e-mails to the server console.
  email: process.env.SMTP_HOST
    ? nodemailerAdapter({
        defaultFromAddress: process.env.SMTP_FROM_ADDRESS || process.env.SMTP_USER || '',
        defaultFromName: process.env.SMTP_FROM_NAME || 'VeraLeaf CMS',
        transportOptions: {
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT || 587),
          secure: process.env.SMTP_SECURE === 'true', // true for port 465
          auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
        },
      })
    : undefined,
  cors: allowedOrigins,
  csrf: allowedOrigins,
  upload: { limits: { fileSize: 15 * 1024 * 1024 } },
  graphQL: { disablePlaygroundInProduction: true },
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  telemetry: false,
});
