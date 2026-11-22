import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import HomeGlass from '../home-glass';
import { getCompanyInfo } from '../lib/cms';
import type { Lang } from '../site-data';

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (lang !== 'vi' && lang !== 'en') return {};
  const en = lang === 'en';
  const company = await getCompanyInfo(lang);
  const description =
    company?.tagline && company?.aboutText
      ? `${company.tagline}. ${company.aboutText}`.slice(0, 300)
      : en
        ? 'VeraLeaf – climate and sustainable development consulting: emissions reduction, greenhouse gas inventory, Net Zero roadmaps and climate adaptation.'
        : 'VeraLeaf tư vấn giảm phát thải, kiểm kê khí nhà kính, lộ trình Net Zero và thích ứng biến đổi khí hậu cho doanh nghiệp và cộng đồng.';
  return {
    title: {
      absolute: en
        ? 'VeraLeaf – The trusted leaf | Climate & sustainable development consulting'
        : 'VeraLeaf – Chiếc lá tin cậy | Tư vấn khí hậu & phát triển bền vững',
    },
    description,
    alternates: { languages: { vi: '/vi', en: '/en' } },
    openGraph: { title: 'VeraLeaf', description, images: ['/brand/veraleaf-logo.png'], locale: en ? 'en_US' : 'vi_VN' },
  };
}

export default async function LangHome({ params }: Props) {
  const { lang } = await params;
  if (lang !== 'vi' && lang !== 'en') notFound();
  return <HomeGlass lang={lang as Lang} />;
}
