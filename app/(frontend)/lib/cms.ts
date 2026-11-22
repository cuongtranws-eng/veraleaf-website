/**
 * Server-side data access for the public website.
 *
 * - Uses the Payload Local API with `overrideAccess: false`, so the public
 *   access rules apply: only published, non-archived content is returned.
 * - Every call degrades gracefully: if the database is not configured or not
 *   reachable, or the CMS has no content yet, callers receive `null` / `[]`
 *   and the pages fall back to the original static copy. The visual design
 *   therefore never depends on the CMS being populated.
 */
import { getPayload, type Payload, type Where } from 'payload';
import config from '@payload-config';
import type {
  CompanyInformation,
  Consultant,
  Expertise,
  Insight,
  Media,
  Organization,
  Partner,
  Project,
  Publication,
} from '@/payload-types';
import type { Lang } from '../site-data';

export const cmsConfigured = Boolean(process.env.DATABASE_URL && process.env.PAYLOAD_SECRET);

let warned = false;
async function client(): Promise<Payload | null> {
  if (!cmsConfigured) return null;
  try {
    return await getPayload({ config });
  } catch (error) {
    if (!warned) {
      console.error('[cms] Payload could not be initialised — falling back to static content.', error);
      warned = true;
    }
    return null;
  }
}

async function safe<T>(fallback: T, run: (payload: Payload) => Promise<T>): Promise<T> {
  const payload = await client();
  if (!payload) return fallback;
  try {
    return await run(payload);
  } catch (error) {
    console.error('[cms] query failed — falling back to static content.', error);
    return fallback;
  }
}

const base = (lang: Lang) => ({ locale: lang, fallbackLocale: 'vi' as const, overrideAccess: false, draft: false });

export function mediaUrl(value: unknown, size?: 'thumbnail' | 'card' | 'hero'): string | null {
  if (!value || typeof value !== 'object') return null;
  const m = value as Media;
  const sized = size ? m.sizes?.[size]?.url : null;
  return sized || m.url || null;
}

export function isDoc<T extends { id: number | string }>(value: unknown): value is T {
  return Boolean(value && typeof value === 'object' && 'id' in (value as object));
}

/* ------------------------------------------------------------------ */

export const getCompanyInfo = (lang: Lang) =>
  safe<CompanyInformation | null>(null, (p) =>
    p.findGlobal({ slug: 'company-information', depth: 0, ...base(lang) }),
  );

export const getExpertiseList = (lang: Lang) =>
  safe<Expertise[]>([], async (p) =>
    (await p.find({ collection: 'expertise', sort: 'order', limit: 50, depth: 1, ...base(lang) })).docs,
  );

export const getExpertiseBySlug = (lang: Lang, slug: string) =>
  safe<Expertise | null>(null, async (p) => {
    const r = await p.find({
      collection: 'expertise',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 1,
      ...base(lang),
    });
    return r.docs[0] ?? null;
  });

export const getConsultants = (lang: Lang) =>
  safe<Consultant[]>([], async (p) =>
    (await p.find({ collection: 'consultants', sort: 'order', limit: 200, depth: 1, ...base(lang) })).docs,
  );

export const getOrganizationUnits = (lang: Lang) =>
  safe<Organization[]>([], async (p) =>
    (await p.find({ collection: 'organization', sort: 'order', limit: 200, depth: 1, ...base(lang) })).docs,
  );

export const getProjects = (lang: Lang, opts: { status?: 'ongoing' | 'completed'; expertiseId?: number | string; featured?: boolean; limit?: number } = {}) =>
  safe<Project[]>([], async (p) => {
    const and: Where[] = [];
    if (opts.status) and.push({ projectStatus: { equals: opts.status } });
    if (opts.expertiseId !== undefined) and.push({ expertise: { contains: opts.expertiseId } });
    if (opts.featured) and.push({ featured: { equals: true } });
    return (
      await p.find({
        collection: 'projects',
        where: and.length ? { and } : undefined,
        sort: '-startDate',
        limit: opts.limit ?? 100,
        depth: 1,
        ...base(lang),
      })
    ).docs;
  });

export const getProjectBySlug = (lang: Lang, slug: string) =>
  safe<Project | null>(null, async (p) => {
    const r = await p.find({ collection: 'projects', where: { slug: { equals: slug } }, limit: 1, depth: 1, ...base(lang) });
    return r.docs[0] ?? null;
  });

export const getInsights = (lang: Lang, opts: { category?: 'news' | 'articles'; limit?: number } = {}) =>
  safe<Insight[]>([], async (p) =>
    (
      await p.find({
        collection: 'insights',
        where: opts.category ? { category: { equals: opts.category } } : undefined,
        sort: '-publishedAt',
        limit: opts.limit ?? 50,
        depth: 1,
        ...base(lang),
      })
    ).docs,
  );

export const getInsightBySlug = (lang: Lang, slug: string) =>
  safe<Insight | null>(null, async (p) => {
    const r = await p.find({ collection: 'insights', where: { slug: { equals: slug } }, limit: 1, depth: 1, ...base(lang) });
    return r.docs[0] ?? null;
  });

export const getPublications = (lang: Lang, limit = 50) =>
  safe<Publication[]>([], async (p) =>
    (await p.find({ collection: 'publications', sort: '-year', limit, depth: 1, ...base(lang) })).docs,
  );

export const getPublicationBySlug = (lang: Lang, slug: string) =>
  safe<Publication | null>(null, async (p) => {
    const r = await p.find({ collection: 'publications', where: { slug: { equals: slug } }, limit: 1, depth: 1, ...base(lang) });
    return r.docs[0] ?? null;
  });

export const getPartners = (lang: Lang) =>
  safe<Partner[]>([], async (p) =>
    (
      await p.find({
        collection: 'partners',
        where: { approvedForPublicDisplay: { equals: true } },
        sort: 'order',
        limit: 200,
        depth: 1,
        ...base(lang),
      })
    ).docs,
  );

/** Store a validated public enquiry. Called only from the contact server action. */
export async function createContactMessage(data: {
  name: string;
  email: string;
  organization?: string;
  phone?: string;
  subject: string;
  message: string;
  locale: Lang;
}): Promise<boolean> {
  const payload = await client();
  if (!payload) return false;
  // overrideAccess is required because the collection does not allow public create
  // over REST/GraphQL; all validation happens in the server action before this call.
  await payload.create({ collection: 'contact-messages', data: { ...data, status: 'new' }, overrideAccess: true });
  return true;
}
