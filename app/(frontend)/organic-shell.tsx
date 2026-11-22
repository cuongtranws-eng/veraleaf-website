/**
 * Shared building blocks of the organic design (home page + sub pages):
 * header, footer, floating leaf and the sub-page hero.
 */
import type { ReactNode } from 'react';
import type { Lang } from './site-data';
import HtmlLang from './html-lang';
import s from './organic.module.css';

const U = (id: string, w = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

/** Illustrative photos (Unsplash). Replace with VeraLeaf photos when available. */
export const IMG: Record<string, string> = {
  hero: U('photo-1441974231531-c6227db76b6e'),
  'development-consulting': U('photo-1542601906990-b4d3fb778b09'),
  'scientific-research': U('photo-1466692476868-aef1dfb1e735'),
  environment: U('photo-1448375240586-882707db888b'),
  'climate-change': U('photo-1497435334941-8c899ee9e8e9'),
  'gis-remote-sensing': U('photo-1446776811953-b23d57bd21aa'),
  education: U('photo-1523348837708-15d4a09cfac2'),
  community: U('photo-1532996122724-e3c354a0b15b', 700),
  field: U('photo-1470071459604-3b5ec3a7fe05', 700),
  // per-section hero images
  about: U('photo-1542601906990-b4d3fb778b09'),
  expertise: U('photo-1448375240586-882707db888b'),
  projects: U('photo-1497435334941-8c899ee9e8e9'),
  insights: U('photo-1466692476868-aef1dfb1e735'),
  partners: U('photo-1470071459604-3b5ec3a7fe05'),
  contact: U('photo-1441974231531-c6227db76b6e'),
};

export function Leaf({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 120" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="leafG" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#3f9d3a" />
          <stop offset="1" stopColor="#b8ec5a" />
        </linearGradient>
      </defs>
      <path d="M104 14C58 12 18 40 16 98c46 6 86-24 88-84Z" fill="url(#leafG)" />
      <path d="M22 96C42 66 64 46 98 22" stroke="#e9ffd0" strokeOpacity=".7" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

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

/** Transparent header placed over a gradient hero. `path` is the current path without the language prefix. */
export function OrganicHeader({ lang, path = '', current }: { lang: Lang; path?: string; current?: string }) {
  const en = lang === 'en';
  const nav = navItems(lang);
  const suffix = path ? '/' + path : '';
  return (
    <header className={s.header}>
      <HtmlLang lang={lang} />
      <a href={`/${lang}`} className={s.logoChip} aria-label={en ? 'VeraLeaf – Home' : 'VeraLeaf – Trang chủ'}>
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
        <a className={`${s.pill} ${s.pillLime} ${s.headerCta}`} href={`/${lang}/contact`} aria-current={current === 'contact' ? 'page' : undefined}>
          {en ? 'Contact' : 'Liên hệ'}
        </a>
        <details className={s.mobileMenu}>
          <summary aria-label={en ? 'Open menu' : 'Mở menu'}>☰</summary>
          <div>
            <a href={`/${lang}`}>{en ? 'Home' : 'Trang chủ'}</a>
            {nav.map((n) => (
              <a key={n.slug} href={`/${lang}/${n.slug}`} aria-current={current === n.slug ? 'page' : undefined}>
                {n.label}
              </a>
            ))}
            <a href={`/${lang}/contact`}>{en ? 'Contact' : 'Liên hệ'}</a>
          </div>
        </details>
      </div>
    </header>
  );
}

export function OrganicFooter({ lang, tagline }: { lang: Lang; tagline?: string | null }) {
  const en = lang === 'en';
  return (
    <footer className={s.footer}>
      <div className={`${s.container} ${s.footerInner}`}>
        <div className={s.footerBrand}>
          <a href={`/${lang}`} className={s.logoChip}>
            <img src="/brand/veraleaf-logo.png" alt="VeraLeaf" width={480} height={226} />
          </a>
          {tagline && <span>{tagline}</span>}
        </div>
        <nav aria-label={en ? 'Footer navigation' : 'Điều hướng chân trang'}>
          {navItems(lang).map((n) => (
            <a key={n.slug} href={`/${lang}/${n.slug}`}>
              {n.label}
            </a>
          ))}
          <a href={`/${lang}/contact`}>{en ? 'Contact' : 'Liên hệ'}</a>
        </nav>
        <span>© 2026 VeraLeaf</span>
      </div>
    </footer>
  );
}

/** Gradient hero used at the top of every sub page. */
export function OrganicSubHero({
  lang,
  path,
  current,
  breadcrumb,
  kicker,
  title,
  text,
  image,
}: {
  lang: Lang;
  path: string;
  current: string;
  breadcrumb: ReactNode;
  kicker: string;
  title: string;
  text?: string | null;
  image?: string | null;
}) {
  return (
    <section className={`${s.hero} ${s.subHero}`}>
      <OrganicHeader lang={lang} path={path} current={current} />
      <div className={`${s.heroInner} ${image ? '' : s.heroInnerSingle}`}>
        <div className={s.heroText}>
          <nav className={s.crumbs} aria-label="Breadcrumb">
            {breadcrumb}
          </nav>
          <span className={s.rule} />
          <span className={s.kickerLight}>{kicker}</span>
          <h1>{title}</h1>
          {text && <p>{text}</p>}
        </div>
        {image && (
          <div className={s.heroVisual}>
            <div className={`${s.capsule} ${s.capsuleWide}`}>
              <img src={image} alt="" />
            </div>
            <Leaf className={`${s.leaf} ${s.leafA}`} />
          </div>
        )}
      </div>
      <Leaf className={`${s.leaf} ${s.leafC}`} />
      <svg className={s.wave} viewBox="0 0 1440 220" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 120C240 10 420 10 640 90s420 120 800-20V220H0Z" fill="#ffffff" />
      </svg>
    </section>
  );
}

export { s as organicStyles };
