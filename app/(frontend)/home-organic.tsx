/**
 * Home page: organic green-gradient layout (capsule images, wave dividers, floating leaves).
 * All text comes from the CMS (Company Information, Expertise) with static fallbacks.
 * The previous home design is kept in home-client.tsx (not used) for easy rollback.
 */
import { getCompanyInfo, getExpertiseList, mediaUrl } from './lib/cms';
import { expertise as staticExpertise, type Lang } from './site-data';
import { IMG, Leaf, OrganicFooter, OrganicHeader } from './organic-shell';
import s from './organic.module.css';

const FALLBACK = [IMG.environment, IMG['climate-change'], IMG['scientific-research'], IMG.education];

export default async function OrganicHome({ lang }: { lang: Lang }) {
  const en = lang === 'en';
  const L = (path = '') => `/${lang}${path ? '/' + path : ''}`;

  const [company, cmsExpertise] = await Promise.all([getCompanyInfo(lang), getExpertiseList(lang)]);

  const slogan = company?.slogan || 'In Leaf We Trust';
  const words = slogan.split(/\s+/);
  const cut = Math.ceil(words.length / 2);
  const tagline = company?.tagline || (en ? 'The trusted leaf – for a green and fair future' : 'Chiếc lá tin cậy – Vì một tương lai xanh và công bằng');
  const about =
    company?.aboutText ||
    (en
      ? 'VeraLeaf is a specialist consultancy in climate and sustainable development.'
      : 'VeraLeaf là tổ chức tư vấn chuyên sâu trong lĩnh vực khí hậu và phát triển bền vững.');
  const philosophy = company?.philosophyText;

  const areas = (cmsExpertise.length
    ? cmsExpertise.map((e) => ({ slug: e.slug || String(e.id), title: e.title, summary: e.summary, image: mediaUrl(e.image, 'card') }))
    : staticExpertise.map((e) => ({ slug: e.slug, title: e[lang], summary: (en ? e.descriptionEn : e.descriptionVi) || '', image: null as string | null }))
  ).map((a, i) => ({ ...a, image: a.image || IMG[a.slug] || FALLBACK[i % FALLBACK.length] }));

  return (
    <div className={s.page}>
      {/* ---------------- HERO ---------------- */}
      <section className={s.hero}>
        <OrganicHeader lang={lang} />

        <div className={s.heroInner}>
          <div className={s.heroText}>
            <span className={s.rule} />
            <h1>
              {words.slice(0, cut).join(' ')}
              <br />
              {words.slice(cut).join(' ')}
            </h1>
            <p>{tagline}</p>
            <div className={s.actions}>
              <a className={`${s.pill} ${s.pillLime}`} href={L('expertise')}>
                {en ? 'Explore our work' : 'Khám phá thêm'}
              </a>
              <a className={`${s.pill} ${s.pillGhost}`} href={L('contact')}>
                {en ? 'Get in touch' : 'Kết nối với chúng tôi'}
              </a>
            </div>
          </div>
          <div className={s.heroVisual}>
            <div className={s.capsule}>
              <img src={IMG.hero} alt={en ? 'Sunlit forest path' : 'Lối đi trong rừng xanh'} />
            </div>
            <Leaf className={`${s.leaf} ${s.leafA}`} />
            <Leaf className={`${s.leaf} ${s.leafB}`} />
          </div>
        </div>
        <Leaf className={`${s.leaf} ${s.leafC}`} />

        <svg className={s.wave} viewBox="0 0 1440 220" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 120C240 10 420 10 640 90s420 120 800-20V220H0Z" fill="#ffffff" />
        </svg>
      </section>

      {/* ---------------- EXPERTISE ---------------- */}
      <section className={s.section} id="expertise">
        <div className={s.container}>
          <div className={s.sectionHead}>
            <span className={s.kicker}>{en ? 'What we do' : 'Lĩnh vực hoạt động'}</span>
            <h2>{en ? 'Expertise for a greener future' : 'Chuyên môn cho một tương lai xanh'}</h2>
          </div>
          <div className={s.cards}>
            {areas.map((a, i) => {
              const variant = i % 3;
              if (variant === 0) {
                return (
                  <a key={a.slug} href={L('expertise/' + a.slug)} className={`${s.card} ${s.cardImage}`}>
                    <img src={a.image} alt="" loading="lazy" />
                    <div className={s.cardImageText}>
                      <span className={s.rule} />
                      <h3>{a.title}</h3>
                      <span className={`${s.pill} ${s.pillLime} ${s.pillSm}`}>{en ? 'Learn more' : 'Xem thêm'}</span>
                    </div>
                  </a>
                );
              }
              return (
                <a key={a.slug} href={L('expertise/' + a.slug)} className={`${s.card} ${variant === 1 ? s.cardGreen : s.cardWhite}`}>
                  <div className={s.cardThumb}>
                    <img src={a.image} alt="" loading="lazy" />
                  </div>
                  <span className={s.rule} />
                  <h3>{a.title}</h3>
                  <p>{a.summary}</p>
                  <span className={`${s.pill} ${variant === 1 ? s.pillLime : s.pillGreen} ${s.pillSm}`}>{en ? 'Learn more' : 'Xem thêm'}</span>
                </a>
              );
            })}
          </div>
        </div>
        <Leaf className={`${s.leaf} ${s.leafD}`} />
      </section>

      {/* ---------------- ABOUT (split block) ---------------- */}
      <section className={s.section}>
        <div className={s.container}>
          <div className={s.split}>
            <div className={s.splitText}>
              <span className={s.rule} />
              <span className={s.kickerLight}>{en ? 'About VeraLeaf' : 'Về VeraLeaf'}</span>
              <h2>{en ? 'Science-driven, community-minded.' : 'Dựa trên khoa học, vì cộng đồng.'}</h2>
              <p>{about}</p>
              <a className={`${s.pill} ${s.pillLime}`} href={L('about')}>
                {en ? 'About us' : 'Giới thiệu về chúng tôi'}
              </a>
            </div>
            <div className={s.splitVisual}>
              <div className={`${s.capsule} ${s.capsuleSm}`}>
                <img src={IMG.community} alt={en ? 'Waste sorting bins' : 'Thùng phân loại rác'} loading="lazy" />
              </div>
              <div className={`${s.capsule} ${s.capsuleSm} ${s.capsuleOffset}`}>
                <img src={IMG.field} alt={en ? 'Green landscape' : 'Cảnh quan xanh'} loading="lazy" />
              </div>
            </div>
          </div>
          {philosophy && (
            <blockquote className={s.quote}>
              <Leaf className={s.quoteLeaf} />
              <p>“{philosophy}”</p>
            </blockquote>
          )}
        </div>
      </section>

      {/* ---------------- CTA band ---------------- */}
      <section className={s.section}>
        <div className={s.container}>
          <div className={s.band}>
            <div>
              <span className={s.rule} />
              <h2>{en ? 'Turning knowledge into action.' : 'Tri thức được chuyển thành hành động.'}</h2>
              <p>
                {en
                  ? 'Explore our projects, field insights and publications on climate and sustainable development.'
                  : 'Khám phá các dự án, góc nhìn thực tiễn và ấn phẩm về khí hậu và phát triển bền vững.'}
              </p>
            </div>
            <div className={s.actions}>
              <a className={`${s.pill} ${s.pillWhite}`} href={L('projects')}>
                {en ? 'Projects' : 'Dự án'}
              </a>
              <a className={`${s.pill} ${s.pillGhost}`} href={L('insights')}>
                {en ? 'Insights' : 'Góc nhìn'}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- CONTACT ---------------- */}
      <section className={s.contact}>
        <svg className={s.waveTop} viewBox="0 0 1440 160" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 60C300 160 560 160 820 90S1220 0 1440 70V0H0Z" fill="#ffffff" />
        </svg>
        <div className={`${s.container} ${s.contactInner}`}>
          <div className={s.contactText}>
            <span className={s.rule} />
            <h2>{en ? 'Let’s grow something meaningful together.' : 'Cùng nhau gieo những hạt mầm ý nghĩa.'}</h2>
            <p>{tagline}</p>
          </div>
          <div className={s.contactCard}>
            {company?.address && (
              <p>
                <strong>{en ? 'Address' : 'Địa chỉ'}</strong>
                <span>{company.address}</span>
              </p>
            )}
            {company?.email && (
              <p>
                <strong>Email</strong>
                <a href={`mailto:${company.email}`}>{company.email}</a>
              </p>
            )}
            {company?.phone && (
              <p>
                <strong>{en ? 'Phone' : 'Điện thoại'}</strong>
                <a href={`tel:${company.phone.replace(/[^+\d]/g, '')}`}>{company.phone}</a>
              </p>
            )}
            <a className={`${s.pill} ${s.pillGreen}`} href={L('contact')}>
              {en ? 'Send us a message' : 'Gửi tin nhắn cho chúng tôi'}
            </a>
          </div>
        </div>
        <Leaf className={`${s.leaf} ${s.leafE}`} />
      </section>

      <OrganicFooter lang={lang} />
    </div>
  );
}
