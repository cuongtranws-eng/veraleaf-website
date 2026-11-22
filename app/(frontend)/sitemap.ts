import type { MetadataRoute } from 'next';
import { about, expertise as staticExpertise, insightTabs, projectTabs, type Lang } from './site-data';
import { getExpertiseList, getInsights, getProjects, getPublications } from './lib/cms';

const base = (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000').replace(/\/$/, '');
const LANGS: Lang[] = ['vi', 'en'];

// Regenerate at most once an hour.
export const revalidate = 3600;

/** sitemap.xml: static pages + published CMS content, in both languages (with hreflang alternates). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [exp, projects, insights, pubs] = await Promise.all([
    getExpertiseList('vi'),
    getProjects('vi', { limit: 500 }),
    getInsights('vi', { limit: 500 }),
    getPublications('vi', 500),
  ]);

  const paths: { path: string; lastModified?: string }[] = [
    { path: '' },
    { path: 'about' },
    ...about.map((a) => ({ path: `about/${a.slug}` })),
    { path: 'expertise' },
    ...(exp.length ? exp.map((e) => ({ path: `expertise/${e.slug}`, lastModified: e.updatedAt })) : staticExpertise.map((e) => ({ path: `expertise/${e.slug}` }))),
    { path: 'projects' },
    ...projectTabs.filter((t) => t.slug !== 'all').map((t) => ({ path: `projects/${t.slug}` })),
    ...projects.map((p) => ({ path: `projects/${p.slug}`, lastModified: p.updatedAt })),
    { path: 'insights' },
    ...insightTabs.map((t) => ({ path: `insights/${t.slug}` })),
    ...insights.map((i) => ({ path: `insights/${i.slug}`, lastModified: i.updatedAt })),
    ...pubs.map((p) => ({ path: `insights/${p.slug}`, lastModified: p.updatedAt })),
    { path: 'partners' },
    { path: 'contact' },
  ];

  const url = (lang: Lang, path: string) => `${base}/${lang}${path ? '/' + path : ''}`;
  return paths.flatMap(({ path, lastModified }) =>
    LANGS.map((lang) => ({
      url: url(lang, path),
      lastModified: lastModified ? new Date(lastModified) : undefined,
      changeFrequency: path === '' ? ('weekly' as const) : ('monthly' as const),
      priority: path === '' ? 1 : path.split('/').length === 1 ? 0.8 : 0.6,
      alternates: { languages: { vi: url('vi', path), en: url('en', path) } },
    })),
  );
}
