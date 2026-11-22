/**
 * Seeds the CMS with the content that is currently hard-coded in the website
 * (six expertise areas + home page "About" copy), in Vietnamese and English.
 * It never invents projects, people or partners.
 *
 * Optionally creates the first administrator from SEED_ADMIN_EMAIL /
 * SEED_ADMIN_PASSWORD (environment only — never commit them).
 *
 * Run: npm run seed     (safe to run more than once)
 */
import { getPayload } from 'payload';
import config from '../payload.config';
import { expertise } from '../app/(frontend)/site-data';

const payload = await getPayload({ config });

// 1. Optional first admin
const adminEmail = process.env.SEED_ADMIN_EMAIL;
const adminPassword = process.env.SEED_ADMIN_PASSWORD;
if (adminEmail && adminPassword) {
  if (adminPassword.length < 12) throw new Error('SEED_ADMIN_PASSWORD must be at least 12 characters.');
  const existing = await payload.find({ collection: 'users', where: { email: { equals: adminEmail } }, limit: 1 });
  if (!existing.docs.length) {
    await payload.create({ collection: 'users', data: { email: adminEmail, password: adminPassword, name: 'Administrator', roles: ['admin'] } });
    payload.logger.info(`Created admin user ${adminEmail}`);
  }
}

// 2. Expertise areas (published), vi first then en
for (const [i, e] of expertise.entries()) {
  const found = await payload.find({ collection: 'expertise', where: { slug: { equals: e.slug } }, limit: 1, draft: true });
  if (found.docs.length) continue;
  const doc = await payload.create({
    collection: 'expertise',
    locale: 'vi',
    data: { title: e.vi, slug: e.slug, summary: e.descriptionVi || '', order: (i + 1) * 10, _status: 'published' },
  });
  await payload.update({
    collection: 'expertise',
    id: doc.id,
    locale: 'en',
    data: { title: e.en, summary: e.descriptionEn || '', _status: 'published' },
  });
  payload.logger.info(`Seeded expertise: ${e.slug}`);
}

// 3. Company information (only fills empty fields)
const company = await payload.findGlobal({ slug: 'company-information', locale: 'vi' });
if (!company.aboutText) {
  await payload.updateGlobal({
    slug: 'company-information',
    locale: 'vi',
    data: {
      companyName: 'Veraleaf',
      aboutText:
        'Veraleaf hoạt động trong các lĩnh vực tư vấn phát triển, nghiên cứu khoa học, môi trường, biến đổi khí hậu, GIS & viễn thám và giáo dục. Chúng tôi hướng đến cách tiếp cận liên ngành, dựa trên bằng chứng và gắn với nhu cầu thực tiễn.',
      philosophyText: 'Từ những câu hỏi đúng đến những giải pháp phù hợp — bằng nghiên cứu, hợp tác và hành động có trách nhiệm.',
    },
  });
  await payload.updateGlobal({
    slug: 'company-information',
    locale: 'en',
    data: {
      companyName: 'Veraleaf',
      aboutText:
        'Veraleaf works across development consulting, scientific research, environment, climate change, GIS & remote sensing, and education. Our approach is interdisciplinary, evidence-based, and grounded in real-world needs.',
      philosophyText: 'From asking the right questions to designing relevant solutions — through research, collaboration and responsible action.',
    },
  });
  payload.logger.info('Seeded company information');
}

payload.logger.info('Seed complete.');
process.exit(0);
