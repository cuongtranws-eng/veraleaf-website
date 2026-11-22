/**
 * Seeds a sample organisation chart for a limited liability company (Công ty TNHH):
 * Members' Council → Director → 3 departments. Skips if units already exist.
 * Run: npx payload run ./scripts/seed-organization.ts
 */
import { getPayload } from 'payload';
import config from '../payload.config';

const payload = await getPayload({ config });

const existing = await payload.count({ collection: 'organization', overrideAccess: true });
if (existing.totalDocs > 0) {
  payload.logger.info(`Organization already has ${existing.totalDocs} unit(s) — nothing seeded.`);
  process.exit(0);
}

type Unit = { vi: string; en: string; descVi?: string; descEn?: string };
async function create(u: Unit, order: number, parent?: number) {
  const doc = await payload.create({
    collection: 'organization',
    locale: 'vi',
    data: { name: u.vi, description: u.descVi, order, parent, _status: 'published' },
  });
  await payload.update({ collection: 'organization', id: doc.id, locale: 'en', data: { name: u.en, description: u.descEn, _status: 'published' } });
  payload.logger.info(`Created: ${u.vi}`);
  return doc.id;
}

const council = await create({ vi: 'Hội đồng thành viên', en: "Members' Council" }, 10);
const director = await create({ vi: 'Giám đốc', en: 'Director' }, 20, council);
await create(
  {
    vi: 'Phòng Hành chính tổng hợp',
    en: 'General Administration Department',
    descVi: 'Hành chính, nhân sự, kế toán – tài chính và hỗ trợ vận hành chung của công ty.',
    descEn: 'Administration, human resources, accounting and finance, and general operational support.',
  },
  30,
  director,
);
await create(
  {
    vi: 'Phòng Môi trường và Biến đổi khí hậu',
    en: 'Environment & Climate Change Department',
    descVi: 'Tư vấn môi trường, kiểm kê khí nhà kính, GIS – viễn thám và các dự án thích ứng với biến đổi khí hậu.',
    descEn: 'Environmental consulting, greenhouse gas inventories, GIS & remote sensing and climate adaptation projects.',
  },
  40,
  director,
);
await create(
  {
    vi: 'Phòng Giáo dục',
    en: 'Education Department',
    descVi: 'Nghiên cứu, đánh giá và tư vấn các chương trình giáo dục, đào tạo và truyền thông nâng cao nhận thức.',
    descEn: 'Research, evaluation and advice on education, training and awareness-raising programmes.',
  },
  50,
  director,
);
process.exit(0);
