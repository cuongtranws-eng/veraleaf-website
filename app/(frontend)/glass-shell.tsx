/**
 * Shared pieces of the dark "frosted glass" theme: fixed background, header, footer,
 * sub-page hero and small icons. Used by the home page and every sub page.
 */
import type { CSSProperties, ReactNode } from 'react';
import type { Lang } from './site-data';
import HtmlLang from './html-lang';
import Reveal from './reveal';
import s from './glass.module.css';

const U = (id: string, w = 1600) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=78`;

/** Illustrative photos (Unsplash). Replace with VeraLeaf photos when available. */
export const PHOTO: Record<string, string> = {
  fern: U('photo-1497250681960-ef046c08a56e', 2000),
  foliage: U('photo-1491147334573-44cbb4602074', 1800),
  leaves: U('photo-1518531933037-91b2f5f229cc', 1800),
  jungle: U('photo-1470058869958-2a77ade41c02', 1400),
  forest: U('photo-1425913397330-cf8af2ff40a1', 1800),
  handsFern: U('photo-1542601906990-b4d3fb778b09', 1400),
  darkFern: U('photo-1516528387618-afa90b13e000', 1800),
  mistyPines: U('photo-1502252430442-aac78f397426', 1800),
  // expertise
  'development-consulting': U('photo-1542601906990-b4d3fb778b09', 800),
  'project-assessment': U('photo-1466692476868-aef1dfb1e735', 800),
  'environmental-consulting': U('photo-1448375240586-882707db888b', 800),
  'ghg-inventory': U('photo-1497435334941-8c899ee9e8e9', 800),
  'gis-remote-sensing': U('photo-1446776811953-b23d57bd21aa', 800),
  'education-consulting': U('photo-1523348837708-15d4a09cfac2', 800),
};

/** Background photo of each sub-page hero. */
export const SECTION_PHOTO: Record<string, string> = {
  about: PHOTO.jungle,
  expertise: PHOTO.leaves,
  projects: PHOTO.forest,
  insights: PHOTO.fern,
  partners: PHOTO.foliage,
  contact: PHOTO.fern,
};

/** Background photo behind the content panel of each sub page (always different from its hero). */
export const CONTENT_PHOTO: Record<string, string> = {
  about: PHOTO.mistyPines,
  expertise: PHOTO.darkFern,
  projects: PHOTO.foliage,
  insights: PHOTO.leaves,
  partners: PHOTO.mistyPines,
  contact: PHOTO.darkFern,
};

export const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
export const LeafIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
    <path d="M20 4C11 4 5 9 5 17c0 1 .1 2 .3 3C13 19 20 13 20 4Z" />
    <path d="M5.5 19.5C9 15 12 12 16 9" />
  </svg>
);

/** Inline style helper for staggered reveal delays. */
export const delay = (seconds: number) => ({ '--d': `${seconds}s` }) as CSSProperties;

export function navItems(lang: Lang) {
  const en = lang === 'en';
  return [
    { slug: 'about', label: en ? 'About' : 'Giới thiệu' },
    { slug: 'expertise', label: en ? 'Expertise' : 'Lĩnh vực' },
    { slug: 'projects', label: en ? 'Projects' : 'Dự án' },
    { slug: 'insights', label: en ? 'Insights' : 'Góc nhìn' },
    { slug: 'partners', label: en ? 'Partners' : 'Đối tác' },
  ];
}

/** Page wrapper: fixed photo background + centred frame. */
export function GlassPage({ lang, photo = PHOTO.fern, children }: { lang: Lang; photo?: string; children: ReactNode }) {
  return (
    <div className={s.page}>
      <HtmlLang lang={lang} />
      <Reveal />
      <div className={s.bg} aria-hidden="true">
        <img src={photo} alt="" />
      </div>
      <div className={s.frame}>{children}</div>
    </div>
  );
}

export function GlassHeader({ lang, path = '', current }: { lang: Lang; path?: string; current?: string }) {
  const en = lang === 'en';
  const suffix = path ? '/' + path : '';
  const nav = navItems(lang);
  return (
    <header className={s.header}>
      <a href={`/${lang}`} className={s.logo} aria-label={en ? 'VeraLeaf – Home' : 'VeraLeaf – Trang chủ'}>
        <img src="/brand/veraleaf-logo.png" alt="VeraLeaf" width={480} height={226} />
      </a>
      <nav className={s.nav} aria-label={en ? 'Main navigation' : 'Điều hướng chính'}>
        {nav.map((n) => (
          <a key={n.slug} href={`/${lang}/${n.slug}`} aria-current={current === n.slug ? 'page' : undefined}>
            {n.label}
          </a>
        ))}
      </nav>
      <div className={s.headerRight}>
        <span className={s.lang}>
          <a href={`/vi${suffix}`} hrefLang="vi" aria-current={!en ? 'true' : undefined}>
            VN
          </a>
          <a href={`/en${suffix}`} hrefLang="en" aria-current={en ? 'true' : undefined}>
            EN
          </a>
        </span>
        <a className={`${s.pill} ${s.pillOutline} ${s.headerCta}`} href={`/${lang}/contact`} aria-current={current === 'contact' ? 'page' : undefined}>
          {en ? 'Contact' : 'Liên hệ'}
        </a>
        <details className={s.menu}>
          <summary aria-label={en ? 'Open menu' : 'Mở menu'}>☰</summary>
          <div>
            <a href={`/${lang}`}>{en ? 'Home' : 'Trang chủ'}</a>
            {nav.map((n) => (
              <a key={n.slug} href={`/${lang}/${n.slug}`} aria-current={current === n.slug ? 'page' : undefined}>
                {n.label}
              </a>
            ))}
            <a href={`/${lang}/contact`} aria-current={current === 'contact' ? 'page' : undefined}>
              {en ? 'Contact' : 'Liên hệ'}
            </a>
          </div>
        </details>
      </div>
    </header>
  );
}

export function GlassFooter({ lang }: { lang: Lang }) {
  const en = lang === 'en';
  return (
    <footer className={s.footer}>
      <nav aria-label={en ? 'Footer navigation' : 'Điều hướng chân trang'}>
        {navItems(lang).map((n) => (
          <a key={n.slug} href={`/${lang}/${n.slug}`}>
            {n.label}
          </a>
        ))}
        <a href={`/${lang}/contact`}>{en ? 'Contact' : 'Liên hệ'}</a>
      </nav>
      <div className={s.footerEnd}>
        <span>© 2026 VeraLeaf</span>
        <a href={`/${lang}`} className={s.logo} aria-label="VeraLeaf">
          <img src="/brand/veraleaf-logo.png" alt="" width={480} height={226} />
        </a>
      </div>
    </footer>
  );
}

export function GlassSubHero({
  photo,
  breadcrumb,
  kicker,
  title,
  text,
}: {
  photo: string;
  breadcrumb: ReactNode;
  kicker: string;
  title: string;
  text?: string | null;
}) {
  return (
    <section className={`${s.panel} ${s.subHero}`}>
      <div className={s.panelBg} aria-hidden="true">
        <img src={photo} alt="" />
      </div>
      <div className={s.inner}>
        <nav className={s.crumbs} aria-label="Breadcrumb" data-reveal="">
          {breadcrumb}
        </nav>
        <span className={s.kicker} data-reveal="" style={delay(0.05)}>
          {kicker}
        </span>
        <h1 className={s.subTitle} data-reveal="" style={delay(0.12)}>
          {title}
        </h1>
        {text && (
          <p className={s.lede} data-reveal="" style={delay(0.2)}>
            {text}
          </p>
        )}
      </div>
    </section>
  );
}

export { s as glassStyles };
