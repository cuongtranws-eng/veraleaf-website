import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { RichText } from '@payloadcms/richtext-lexical/react';
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical';
import { CONTENT_PHOTO, GlassFooter, GlassHeader, GlassPage, GlassSubHero, PHOTO, SECTION_PHOTO, glassStyles } from '../../../glass-shell';
import { Entry, Lang, about, expertise, insightTabs, menus, projectTabs, url } from '../../../site-data';
import {
  getCompanyInfo,
  getConsultants,
  getExpertiseBySlug,
  getExpertiseList,
  getInsightBySlug,
  getInsights,
  getOrganizationUnits,
  getPartners,
  getProjectBySlug,
  getProjects,
  getPublicationBySlug,
  getPublications,
  isDoc,
  mediaUrl,
} from '../../../lib/cms';
import type { Consultant, Expertise, Insight, Organization, Partner, Project, Publication } from '@/payload-types';

type Params = { lang: string; section: string; slug?: string[] };

const hasRich = (v: unknown): v is SerializedEditorState =>
  Boolean(v && typeof v === 'object' && (v as SerializedEditorState).root?.children?.length);

const Rich = ({ data }: { data: unknown }) =>
  hasRich(data) ? (
    <div className="rich-content">
      <RichText data={data} disableContainer />
    </div>
  ) : null;

const docs = <T extends { id: number | string }>(v: unknown): T[] => (Array.isArray(v) ? v.filter(isDoc<T>) : []);

function period(lang: Lang, start?: string | null, end?: string | null) {
  const fmt = (d: string) => new Date(d).toLocaleDateString(lang === 'en' ? 'en-GB' : 'vi-VN', { month: '2-digit', year: 'numeric' });
  if (!start && !end) return null;
  return `${start ? fmt(start) : '…'} – ${end ? fmt(end) : lang === 'en' ? 'present' : 'nay'}`;
}
const fullDate = (lang: Lang, d?: string | null) =>
  d ? new Date(d).toLocaleDateString(lang === 'en' ? 'en-GB' : 'vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : null;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const p = await params;
  if (p.lang !== 'vi' && p.lang !== 'en') return {};
  const lang = p.lang as Lang;
  const menu = menus.find((m) => m.slug === p.section);
  if (!menu) return {};
  const slug = p.slug?.[0];
  const known = [...about, ...expertise, ...projectTabs, ...insightTabs].find((o) => o.slug === slug);
  let title: string = known?.[lang] || '';
  let description: string | undefined;
  if (slug && !known) {
    const doc =
      p.section === 'projects'
        ? await getProjectBySlug(lang, slug)
        : p.section === 'insights'
          ? (await getInsightBySlug(lang, slug)) || (await getPublicationBySlug(lang, slug))
          : p.section === 'expertise'
            ? await getExpertiseBySlug(lang, slug)
            : null;
    if (doc) {
      title = doc.title;
      const d = doc as { summary?: string; excerpt?: string; abstract?: string };
      description = d.summary || d.excerpt || d.abstract;
    }
  }
  return {
    title: title ? `${title} – ${menu[lang]}` : menu[lang],
    description: description?.slice(0, 300),
    alternates: { languages: { vi: `/vi/${[p.section, slug].filter(Boolean).join('/')}`, en: `/en/${[p.section, slug].filter(Boolean).join('/')}` } },
  };
}

export default async function ContentPage({ params }: { params: Promise<Params> }) {
  const p = await params;
  if (p.lang !== 'vi' && p.lang !== 'en') notFound();
  const lang = p.lang as Lang;
  const en = lang === 'en';
  const section = p.section;
  const slug = p.slug?.[0];
  if (p.slug && p.slug.length > 1) notFound();
  const menu = menus.find((m) => m.slug === section);
  if (!menu || !section) notFound();

  // Expertise drives both the navigation and the expertise pages. Static list is the fallback.
  const cmsExpertise = await getExpertiseList(lang);
  const expertiseEntries: Entry[] = cmsExpertise.length
    ? cmsExpertise.map((e) => ({ slug: e.slug || String(e.id), vi: e.title, en: e.title, descriptionVi: e.summary, descriptionEn: e.summary }))
    : expertise;

  const options =
    section === 'about' ? about : section === 'expertise' ? expertiseEntries : section === 'projects' ? projectTabs : section === 'insights' ? insightTabs : [];
  const selected = options.find((i) => i.slug === slug);

  // Detail pages for CMS documents: /projects/<slug>, /insights/<slug>.
  let project: Project | null = null;
  let insight: Insight | null = null;
  let publication: Publication | null = null;
  if (slug && !selected) {
    if (section === 'projects') project = await getProjectBySlug(lang, slug);
    else if (section === 'insights') {
      insight = await getInsightBySlug(lang, slug);
      if (!insight) publication = await getPublicationBySlug(lang, slug);
    }
    if (!project && !insight && !publication) notFound();
  }
  const detail = project || insight || publication;

  const company = await getCompanyInfo(lang);

  const title = detail?.title || selected?.[lang] || menu[lang];
  const intro =
    section === 'about'
      ? en
        ? 'Learn more about Veraleaf, how we work and the people behind our research.'
        : 'Tìm hiểu về Veraleaf, cách chúng tôi làm việc và đội ngũ chuyên gia.'
      : section === 'expertise'
        ? en
          ? 'Explore our interdisciplinary expertise, grounded in research and practical experience.'
          : 'Khám phá các lĩnh vực chuyên môn dựa trên nghiên cứu và kinh nghiệm thực tiễn.'
        : section === 'projects'
          ? en
            ? 'An overview of Veraleaf projects. Project profiles will be published once approved.'
            : 'Tổng hợp các dự án của Veraleaf. Hồ sơ dự án sẽ được đăng tải sau khi xác nhận nội dung.'
          : section === 'insights'
            ? en
              ? 'Research, field insights and publications from Veraleaf.'
              : 'Các nghiên cứu, bài viết chuyên môn và ấn phẩm từ Veraleaf.'
            : section === 'partners'
              ? en
                ? 'Our collaboration network will be updated here.'
                : 'Thông tin mạng lưới đối tác sẽ được cập nhật tại đây.'
              : en
                ? 'Connect with Veraleaf.'
                : 'Kết nối với Veraleaf.';
  const heroText =
    project?.summary || insight?.excerpt || (publication ? publication.publisher || String(publication.year) : null) || selected?.[en ? 'descriptionEn' : 'descriptionVi'] || intro;

  const content = await renderContent();

  const cmsExpertiseDoc = section === 'expertise' && selected ? cmsExpertise.find((e) => e.slug === selected.slug) : undefined;
  const heroImage =
    mediaUrl(project?.featuredImage, 'hero') ||
    mediaUrl(insight?.coverImage, 'hero') ||
    mediaUrl(cmsExpertiseDoc?.image, 'hero') ||
    (section === 'expertise' && selected ? PHOTO[selected.slug] : null) ||
    SECTION_PHOTO[section] ||
    PHOTO.fern;

  return (
    <GlassPage lang={lang} photo={SECTION_PHOTO[section] || PHOTO.fern}>
      <GlassHeader lang={lang} path={[section, slug].filter(Boolean).join('/')} current={section} />
      <main className="subpage glass">
        <GlassSubHero
          photo={heroImage}
          kicker={`VeraLeaf · ${menu[lang]}`}
          title={title}
          text={heroText}
          breadcrumb={
            <>
              <Link href={url(lang, '')}>{en ? 'Home' : 'Trang chủ'}</Link>
              <span aria-hidden="true">/</span>
              {slug ? (
                <>
                  <Link href={url(lang, section)}>{menu[lang]}</Link>
                  <span aria-hidden="true">/</span>
                </>
              ) : null}
              <span aria-current="page">{title}</span>
            </>
          }
        />
        <section className={`section ${glassStyles.panel} ${glassStyles.panelDark} ${glassStyles.content}`}>
          <div className={glassStyles.panelBg} aria-hidden="true">
            <img src={CONTENT_PHOTO[section] || PHOTO.mistyPines} alt="" loading="lazy" />
          </div>
          <div className="shell sublayout">
            {options.length > 0 && (
              <aside className="subnav">
                <strong>{menu[lang]}</strong>
                <Link className={!slug ? 'current' : ''} href={url(lang, section)}>
                  {en ? 'Overview' : 'Tổng quan'}
                </Link>
                {options.map((o) => (
                  <Link className={slug === o.slug ? 'current' : ''} href={url(lang, section, o.slug)} key={o.slug}>
                    {o[lang]}
                  </Link>
                ))}
              </aside>
            )}
            <div className="subcontent">{content}</div>
          </div>
        </section>
      </main>
      <GlassFooter lang={lang} />
    </GlassPage>
  );

  /* ---------------------------------------------------------------- */

  async function renderContent() {
    /* ---------- Expertise ---------- */
    if (section === 'expertise' && !slug) {
      const total = String(expertiseEntries.length).padStart(2, '0');
      return (
        <>
          <h2>{en ? 'Our areas of expertise' : 'Các lĩnh vực hoạt động'}</h2>
          <div className="detail-grid">
            {expertiseEntries.map((e, i) => (
              <Link className="detail-card" href={url(lang, section, e.slug)} key={e.slug}>
                <span>
                  {String(i + 1).padStart(2, '0')} / {total} ↗
                </span>
                <h3>{e[lang]}</h3>
                <p>{e[en ? 'descriptionEn' : 'descriptionVi']}</p>
              </Link>
            ))}
          </div>
        </>
      );
    }
    if (section === 'expertise' && selected) {
      const doc: Expertise | null = cmsExpertise.length ? await getExpertiseBySlug(lang, selected.slug) : null;
      const related = doc ? await getProjects(lang, { expertiseId: doc.id, limit: 12 }) : [];
      return (
        <>
          <h2>{title}</h2>
          <p className="lead">{selected[en ? 'descriptionEn' : 'descriptionVi']}</p>
          <h3>{en ? 'Approach and services' : 'Phương pháp tiếp cận và dịch vụ'}</h3>
          {hasRich(doc?.description) ? (
            <Rich data={doc?.description} />
          ) : (
            <div className="placeholder">
              {en
                ? 'Detailed service descriptions and project references will be added here.'
                : 'Nội dung dịch vụ chi tiết và các dự án liên quan sẽ được cập nhật tại đây.'}
            </div>
          )}
          {related.length > 0 && (
            <>
              <h3>{en ? 'Related projects' : 'Dự án liên quan'}</h3>
              <ProjectCards items={related} />
            </>
          )}
        </>
      );
    }

    /* ---------- About ---------- */
    if (section === 'about' && !slug) {
      return (
        <>
          <h2>{en ? 'About Veraleaf' : 'Giới thiệu Veraleaf'}</h2>
          <p>
            {company?.aboutText ||
              (en
                ? 'Veraleaf works in development consulting, scientific research, environment, climate change, GIS and remote sensing, and education.'
                : 'Veraleaf hoạt động trong các lĩnh vực tư vấn phát triển, nghiên cứu khoa học, môi trường, biến đổi khí hậu, GIS và viễn thám, giáo dục.')}
          </p>
        </>
      );
    }
    if (section === 'about' && slug === 'general-information') {
      const hasCms = hasRich(company?.generalInformation) || company?.mission || company?.vision;
      return (
        <>
          <h2>{title}</h2>
          {hasRich(company?.generalInformation) ? (
            <Rich data={company?.generalInformation} />
          ) : (
            <p>
              {en
                ? 'Veraleaf is a consulting and research company whose areas of work include development, environment and education.'
                : 'Veraleaf là công ty hoạt động trong lĩnh vực tư vấn và nghiên cứu, với các mảng công việc về phát triển, môi trường và giáo dục.'}
            </p>
          )}
          {company?.mission && (
            <>
              <h3>{en ? 'Mission' : 'Sứ mệnh'}</h3>
              <p>{company.mission}</p>
            </>
          )}
          {company?.vision && (
            <>
              <h3>{en ? 'Vision' : 'Tầm nhìn'}</h3>
              <p>{company.vision}</p>
            </>
          )}
          {!hasCms && (
            <div className="placeholder">
              {en
                ? 'Mission, vision, corporate profile and legal details will be added after verification.'
                : 'Sứ mệnh, tầm nhìn, hồ sơ công ty và thông tin pháp lý sẽ được bổ sung sau khi xác minh.'}
            </div>
          )}
        </>
      );
    }
    if (section === 'about' && slug === 'organizational-structure') {
      const units = await getOrganizationUnits(lang);
      if (!units.length) {
        return (
          <>
            <h2>{title}</h2>
            <div className="org-chart">
              <div>{en ? 'Company leadership' : 'Ban lãnh đạo'}</div>
              <span>↓</span>
              <div>{en ? 'Specialist teams / Consultants' : 'Các nhóm chuyên môn / Tư vấn'}</div>
            </div>
            <p className="muted">
              {en
                ? 'Illustrative structure only. The official organisation chart will be uploaded later.'
                : 'Sơ đồ chỉ mang tính minh họa. Cơ cấu tổ chức chính thức sẽ được cập nhật sau.'}
            </p>
          </>
        );
      }
      return (
        <>
          <h2>{title}</h2>
          <OrgTree units={units} />
          {company?.organizationNote && <p className="muted">{company.organizationNote}</p>}
          {units.some((u) => u.description) && (
            <div className="detail-grid">
              {units.filter((u) => u.description).map((u) => (
                <div className="detail-card" key={u.id}>
                  {isDoc<Consultant>(u.head) && <span>{[u.head.honorific, u.head.name].filter(Boolean).join(' ')}</span>}
                  <h3>{u.name}</h3>
                  {u.description && <p>{u.description}</p>}
                </div>
              ))}
            </div>
          )}
        </>
      );
    }
    if (section === 'about' && slug === 'consultants') {
      const people = await getConsultants(lang);
      return (
        <>
          <h2>{title}</h2>
          {people.length ? (
            <div className="detail-grid">
              {people.map((c) => {
                const photo = mediaUrl(c.photo, 'card');
                return (
                  <div className="detail-card" key={c.id}>
                    {photo && <img src={photo} alt={isDoc<{ id: number; alt: string }>(c.photo) ? c.photo.alt : c.name} loading="lazy" />}
                    <span>{c.position}</span>
                    <h3>{[c.honorific, c.name].filter(Boolean).join(' ')}</h3>
                    {c.summary && <p>{c.summary}</p>}
                    {c.showEmail && c.email && (
                      <p>
                        <a href={`mailto:${c.email}`}>{c.email}</a>
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="placeholder">
              {en
                ? 'Consultant biographies and profile photos will be added after approval.'
                : 'Hồ sơ, ảnh và thông tin chuyên môn của đội ngũ tư vấn sẽ được cập nhật sau khi được phê duyệt.'}
            </div>
          )}
        </>
      );
    }

    /* ---------- Projects ---------- */
    if (section === 'projects' && project) {
      const team = docs<Consultant>(project.consultants);
      const partners = docs<Partner>(project.partners);
      const areas = docs<Expertise>(project.expertise);
      const img = mediaUrl(project.featuredImage, 'hero');
      return (
        <>
          <ProjectTabs current={null} />
          <h2>{project.title}</h2>
          <div className="meta-list">
            <span>{project.projectStatus === 'completed' ? (en ? 'Completed' : 'Đã hoàn thành') : en ? 'Ongoing' : 'Đang triển khai'}</span>
            {period(lang, project.startDate, project.endDate) && <span>{period(lang, project.startDate, project.endDate)}</span>}
            {project.location && <span>{project.location}</span>}
            {project.client && <span>{(en ? 'Client: ' : 'Khách hàng: ') + project.client}</span>}
          </div>
          {img && (
            <div className="rich-content">
              <img src={img} alt={isDoc<{ id: number; alt: string }>(project.featuredImage) ? project.featuredImage.alt : ''} />
            </div>
          )}
          {hasRich(project.content) ? <Rich data={project.content} /> : <p>{project.summary}</p>}
          {areas.length > 0 && (
            <>
              <h3>{en ? 'Expertise' : 'Lĩnh vực'}</h3>
              <div className="chip-list">
                {areas.map((a) => (
                  <Link className="chip" key={a.id} href={url(lang, 'expertise', a.slug || '')}>
                    {a.title}
                  </Link>
                ))}
              </div>
            </>
          )}
          {team.length > 0 && (
            <>
              <h3>{en ? 'Project team' : 'Nhóm dự án'}</h3>
              <div className="detail-grid">
                {team.map((c) => (
                  <div className="detail-card" key={c.id}>
                    <span>{c.position}</span>
                    <h3>{[c.honorific, c.name].filter(Boolean).join(' ')}</h3>
                  </div>
                ))}
              </div>
            </>
          )}
          {partners.length > 0 && (
            <>
              <h3>{en ? 'Partners' : 'Đối tác'}</h3>
              <PartnerCards items={partners} />
            </>
          )}
        </>
      );
    }
    if (section === 'projects') {
      const status = slug === 'ongoing' || slug === 'completed' ? slug : undefined;
      const items = await getProjects(lang, { status });
      return (
        <>
          <ProjectTabs current={slug || 'all'} />
          <h2>{title}</h2>
          {items.length ? (
            <ProjectCards items={items} />
          ) : (
            <div className="placeholder">
              {en
                ? 'No verified project profiles have been published yet. Projects will be filterable by status and expertise when content is available.'
                : 'Chưa có hồ sơ dự án được xác nhận để xuất bản. Khi có nội dung, dự án sẽ được lọc theo trạng thái và lĩnh vực chuyên môn.'}
            </div>
          )}
        </>
      );
    }

    /* ---------- Insights & publications ---------- */
    if (section === 'insights' && insight) {
      const authors = docs<Consultant>(insight.authors);
      const cover = mediaUrl(insight.coverImage, 'hero');
      return (
        <>
          <InsightTabs current={insight.category} />
          <h2>{insight.title}</h2>
          <div className="meta-list">
            <span>{insightTabs.find((t) => t.slug === insight!.category)?.[lang]}</span>
            {fullDate(lang, insight.publishedAt) && <span>{fullDate(lang, insight.publishedAt)}</span>}
            {authors.length > 0 && <span>{authors.map((a) => a.name).join(', ')}</span>}
          </div>
          {cover && (
            <div className="rich-content">
              <img src={cover} alt={isDoc<{ id: number; alt: string }>(insight.coverImage) ? insight.coverImage.alt : ''} />
            </div>
          )}
          {hasRich(insight.content) ? <Rich data={insight.content} /> : <p>{insight.excerpt}</p>}
        </>
      );
    }
    if (section === 'insights' && publication) {
      const authors = [...docs<Consultant>(publication.authors).map((a) => a.name), publication.externalAuthors].filter(Boolean);
      const fileUrl = mediaUrl(publication.file);
      return (
        <>
          <InsightTabs current="publications" />
          <h2>{publication.title}</h2>
          <div className="meta-list">
            <span>{publication.year}</span>
            {publication.publisher && <span>{publication.publisher}</span>}
            {authors.length > 0 && <span>{authors.join(', ')}</span>}
          </div>
          <p>{publication.abstract}</p>
          <div className="chip-list">
            {publication.externalUrl && (
              <a className="chip" href={publication.externalUrl} target="_blank" rel="noopener noreferrer">
                {en ? 'View publication' : 'Xem ấn phẩm'} ↗
              </a>
            )}
            {publication.doi && (
              <a className="chip" href={`https://doi.org/${encodeURI(publication.doi)}`} target="_blank" rel="noopener noreferrer">
                DOI: {publication.doi}
              </a>
            )}
            {fileUrl && (
              <a className="chip" href={fileUrl} target="_blank" rel="noopener noreferrer">
                {en ? 'Download PDF' : 'Tải PDF'} ↓
              </a>
            )}
          </div>
        </>
      );
    }
    if (section === 'insights') {
      const showPubs = !slug || slug === 'publications';
      const showInsights = slug !== 'publications';
      const [items, pubs] = await Promise.all([
        showInsights ? getInsights(lang, { category: slug === 'news' || slug === 'articles' ? slug : undefined }) : Promise.resolve([]),
        showPubs ? getPublications(lang) : Promise.resolve([]),
      ]);
      return (
        <>
          <InsightTabs current={slug || null} />
          <h2>{title}</h2>
          {items.length === 0 && pubs.length === 0 ? (
            <div className="placeholder">
              {en
                ? 'Articles, research and publications will appear here once approved.'
                : 'Các bài viết, nghiên cứu và ấn phẩm sẽ hiển thị tại đây sau khi được phê duyệt.'}
            </div>
          ) : (
            <>
              {items.length > 0 && (
                <div className="detail-grid">
                  {items.map((it) => {
                    const img = mediaUrl(it.coverImage, 'card');
                    return (
                      <Link className="detail-card" key={it.id} href={url(lang, 'insights', it.slug || '')}>
                        {img && <img src={img} alt="" loading="lazy" />}
                        <span>
                          {insightTabs.find((t) => t.slug === it.category)?.[lang]}
                          {fullDate(lang, it.publishedAt) ? ` · ${fullDate(lang, it.publishedAt)}` : ''} ↗
                        </span>
                        <h3>{it.title}</h3>
                        <p>{it.excerpt}</p>
                      </Link>
                    );
                  })}
                </div>
              )}
              {pubs.length > 0 && (
                <>
                  {items.length > 0 && <h3>{insightTabs[2][lang]}</h3>}
                  <div className="detail-grid">
                    {pubs.map((pub) => (
                      <Link className="detail-card" key={pub.id} href={url(lang, 'insights', pub.slug || '')}>
                        <span>
                          {pub.year}
                          {pub.publisher ? ` · ${pub.publisher}` : ''} ↗
                        </span>
                        <h3>{pub.title}</h3>
                        <p>{pub.abstract.length > 220 ? pub.abstract.slice(0, 220) + '…' : pub.abstract}</p>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </>
      );
    }

    /* ---------- Partners ---------- */
    if (section === 'partners') {
      const partners = await getPartners(lang);
      return (
        <>
          <h2>{title}</h2>
          {partners.length ? (
            <PartnerCards items={partners} />
          ) : (
            <div className="placeholder">
              {en ? 'Approved partner information and logos will appear here.' : 'Thông tin và logo đối tác được chấp thuận sẽ được hiển thị tại đây.'}
            </div>
          )}
        </>
      );
    }

    /* ---------- Contact ---------- */
    const phones = [company?.phone, company?.phone2].filter((p): p is string => Boolean(p));
    const hasDetails = company?.email || phones.length || company?.address;
    return (
      <>
        <h2>{title}</h2>
        {hasDetails && (
          <div className="contact-details">
            {company?.address && <span style={{ whiteSpace: 'pre-line' }}>{company.address}</span>}
            {company?.email && (
              <span>
                Email: <a href={`mailto:${company.email}`}>{company.email}</a>
              </span>
            )}
            {phones.length > 0 && (
              <span>
                {en ? 'Phone' : 'Điện thoại'}:{' '}
                {phones.map((p, i) => (
                  <span key={p}>
                    {i > 0 && ' · '}
                    <a href={`tel:${p.replace(/[^+\d]/g, '')}`}>{p}</a>
                  </span>
                ))}
              </span>
            )}
            {company?.officeHours && <span>{company.officeHours}</span>}
            {(company?.socialLinks || []).map((s) => (
              <span key={s.id || s.url}>
                {s.platform.charAt(0).toUpperCase() + s.platform.slice(1)}:{' '}
                <a href={s.url} target="_blank" rel="noopener noreferrer">
                  {s.platform === 'facebook' ? 'VeraLeaf' : s.url.replace(/^https?:\/\//, '')} ↗
                </a>
              </span>
            ))}
            {company?.mapUrl && (
              <a href={company.mapUrl} target="_blank" rel="noopener noreferrer">
                {en ? 'View map' : 'Xem bản đồ'} ↗
              </a>
            )}
          </div>
        )}
        {!hasDetails && (
          <div className="placeholder">
            {en
              ? 'Contact details will be added once the official details are confirmed.'
              : 'Thông tin liên hệ sẽ được bổ sung sau khi xác nhận thông tin chính thức.'}
          </div>
        )}
      </>
    );
  }

  /* ---------- Small presentational helpers (reuse existing CSS classes) ---------- */

  function ProjectTabs({ current }: { current: string | null }) {
    return (
      <div className="chip-list">
        {projectTabs.map((o) => (
          <Link key={o.slug} className={'chip ' + (current === o.slug ? 'current' : '')} href={url(lang, 'projects', o.slug)}>
            {o[lang]}
          </Link>
        ))}
      </div>
    );
  }

  function InsightTabs({ current }: { current: string | null }) {
    return (
      <div className="chip-list">
        {insightTabs.map((o) => (
          <Link key={o.slug} className={'chip ' + (current === o.slug ? 'current' : '')} href={url(lang, 'insights', o.slug)}>
            {o[lang]}
          </Link>
        ))}
      </div>
    );
  }

  function ProjectCards({ items }: { items: Project[] }) {
    return (
      <div className="detail-grid">
        {items.map((pr) => {
          const img = mediaUrl(pr.featuredImage, 'card');
          const when = period(lang, pr.startDate, pr.endDate);
          return (
            <Link className="detail-card" key={pr.id} href={url(lang, 'projects', pr.slug || '')}>
              {img && <img src={img} alt="" loading="lazy" />}
              <span>
                {pr.projectStatus === 'completed' ? (en ? 'Completed' : 'Đã hoàn thành') : en ? 'Ongoing' : 'Đang triển khai'}
                {when ? ` · ${when}` : ''} ↗
              </span>
              <h3>{pr.title}</h3>
              <p>{pr.summary}</p>
            </Link>
          );
        })}
      </div>
    );
  }

  function PartnerCards({ items }: { items: Partner[] }) {
    return (
      <div className="detail-grid">
        {items.map((pt) => {
          const logo = mediaUrl(pt.logo, 'thumbnail');
          const inner = (
            <>
              {logo && <img className="logo" src={logo} alt={pt.name} loading="lazy" />}
              <h3>
                {pt.name}
                {pt.website ? ' ↗' : ''}
              </h3>
              {pt.description && <p>{pt.description}</p>}
            </>
          );
          return pt.website ? (
            <a className="detail-card" key={pt.id} href={pt.website} target="_blank" rel="noopener noreferrer">
              {inner}
            </a>
          ) : (
            <div className="detail-card" key={pt.id}>
              {inner}
            </div>
          );
        })}
      </div>
    );
  }
}

/** Organisation chart drawn as a tree (boxes joined by connector lines), built from the CMS "parent" field. */
function OrgTree({ units }: { units: Organization[] }) {
  const parentId = (u: Organization) => (u.parent == null ? null : typeof u.parent === 'object' ? u.parent.id : u.parent);
  const ids = new Set(units.map((u) => u.id));
  const children = new Map<number | string, Organization[]>();
  for (const u of units) {
    const p = parentId(u);
    if (p !== null && ids.has(p)) children.set(p, [...(children.get(p) || []), u]);
  }
  const roots = units.filter((u) => parentId(u) === null || !ids.has(parentId(u)!));
  const render = (u: Organization, depth: number, seen: Set<number | string>) => {
    if (seen.has(u.id) || depth > 8) return null; // guard against loops
    const next = new Set(seen).add(u.id);
    const kids = children.get(u.id) || [];
    return (
      <li key={u.id}>
        <div className={'org-node' + (depth === 0 ? ' is-root' : kids.length ? '' : ' is-leaf')}>
          <strong>{u.name}</strong>
          {isDoc<Consultant>(u.head) && <small>{[u.head.honorific, u.head.name].filter(Boolean).join(' ')}</small>}
        </div>
        {kids.length > 0 && <ul>{kids.map((k) => render(k, depth + 1, next))}</ul>}
      </li>
    );
  };
  return (
    <div className="org-tree" role="tree">
      <ul>{roots.map((r) => render(r, 0, new Set()))}</ul>
    </div>
  );
}
