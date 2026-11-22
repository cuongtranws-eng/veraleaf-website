/**
 * Imports brand & contact content from the previous website (veraleaf.com.vn)
 * into Company Information (vi + en).
 *
 * Only fills fields that are empty or still contain the prototype/seed text,
 * so anything an editor has already entered is never overwritten.
 *
 * Run: npm run import:legacy
 */
import { getPayload } from 'payload';
import config from '../payload.config';

const payload = await getPayload({ config });

// Text that came from the v0.2 prototype / seed script and may be replaced.
const PROTOTYPE_TEXT = new Set([
  'Veraleaf hoạt động trong các lĩnh vực tư vấn phát triển, nghiên cứu khoa học, môi trường, biến đổi khí hậu, GIS & viễn thám và giáo dục. Chúng tôi hướng đến cách tiếp cận liên ngành, dựa trên bằng chứng và gắn với nhu cầu thực tiễn.',
  'Từ những câu hỏi đúng đến những giải pháp phù hợp — bằng nghiên cứu, hợp tác và hành động có trách nhiệm.',
  'Veraleaf works across development consulting, scientific research, environment, climate change, GIS & remote sensing, and education. Our approach is interdisciplinary, evidence-based, and grounded in real-world needs.',
  'From asking the right questions to designing relevant solutions — through research, collaboration and responsible action.',
]);

const legacy = {
  vi: {
    companyName: 'VeraLeaf',
    slogan: 'In Leaf We Trust',
    tagline: 'Chiếc lá tin cậy – Vì một tương lai xanh và công bằng',
    aboutText:
      'VeraLeaf là tổ chức tư vấn chuyên sâu trong lĩnh vực khí hậu và phát triển bền vững, với sứ mệnh đồng hành cùng doanh nghiệp và cộng đồng trong quá trình chuyển đổi xanh, giảm phát thải và thích ứng với biến đổi khí hậu. Chúng tôi là tập hợp các nhà khoa học trẻ, năng động, với nền tảng học thuật chuyên sâu trong các lĩnh vực biến đổi khí hậu và phát triển bền vững, kết hợp cùng kinh nghiệm thực tiễn phong phú từ nhiều dự án địa phương đến quốc tế.',
    philosophyText:
      'Tên gọi Vera Leaf – chiếc lá của sự chính trực – thể hiện tinh thần mà chúng tôi theo đuổi: minh bạch, công bằng và bền vững cho hành tinh.',
    address: 'Số 1D ngõ 165 đường Giáp Bát, Phường Tương Mai, Thành phố Hà Nội',
  },
  // English versions are translations of the Vietnamese copy — please review.
  en: {
    companyName: 'VeraLeaf',
    slogan: 'In Leaf We Trust',
    tagline: 'The trusted leaf – for a green and fair future',
    aboutText:
      'VeraLeaf is a specialist consultancy in climate and sustainable development. Our mission is to support businesses and communities through the green transition, emissions reduction and climate change adaptation. We are a team of young, dynamic scientists with strong academic backgrounds in climate change and sustainable development, combined with extensive practical experience from local to international projects.',
    philosophyText:
      'The name Vera Leaf – the leaf of integrity – reflects the spirit we pursue: transparency, fairness and sustainability for the planet.',
    address: 'No. 1D, Lane 165 Giap Bat Street, Tuong Mai Ward, Hanoi, Vietnam',
  },
};
const contact = {
  email: 'veraleaf.registry@gmail.com',
  phone: '0866 852 863',
  phone2: '0362 156 333',
  socialLinks: [{ platform: 'facebook' as const, url: 'https://www.facebook.com/profile.php?id=61575101017653' }],
};

const replaceable = (v: unknown) => v === null || v === undefined || v === '' || (typeof v === 'string' && PROTOTYPE_TEXT.has(v)) || v === 'Veraleaf';

for (const locale of ['vi', 'en'] as const) {
  const current = (await payload.findGlobal({ slug: 'company-information', locale, fallbackLocale: false, depth: 0 })) as unknown as Record<string, unknown>;
  const data: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(legacy[locale])) {
    if (replaceable(current[key])) data[key] = value;
  }
  if (locale === 'vi') {
    if (!current.email) data.email = contact.email;
    if (!current.phone) data.phone = contact.phone;
    if (!current.phone2) data.phone2 = contact.phone2;
    if (!Array.isArray(current.socialLinks) || current.socialLinks.length === 0) data.socialLinks = contact.socialLinks;
  }
  if (Object.keys(data).length) {
    await payload.updateGlobal({ slug: 'company-information', locale, data: data as never });
    payload.logger.info(`[${locale}] updated: ${Object.keys(data).join(', ')}`);
  } else {
    payload.logger.info(`[${locale}] nothing to update (fields already filled)`);
  }
}

payload.logger.info('Legacy content import complete.');
process.exit(0);
