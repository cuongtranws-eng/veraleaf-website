/**
 * Home page — dark botanical "frosted glass" theme.
 * Text comes from the CMS (Company Information, Expertise) with static fallbacks.
 * Previous designs are kept in home-organic.tsx and home-client.tsx (not used).
 */
import { getCompanyInfo, getExpertiseList, mediaUrl } from './lib/cms';
import { expertise as staticExpertise, type Lang } from './site-data';
import { Arrow, GlassFooter, GlassHeader, GlassPage, LeafIcon, PHOTO, delay, glassStyles as s } from './glass-shell';

export default async function HomeGlass({ lang }: { lang: Lang }) {
  const en = lang === 'en';
  const L = (path = '') => `/${lang}${path ? '/' + path : ''}`;
  const [company, cmsExpertise] = await Promise.all([getCompanyInfo(lang), getExpertiseList(lang)]);

  const slogan = company?.slogan || 'In Leaf We Trust';
  const words = slogan.trim().split(/\s+/);
  const last = words.pop();
  const tagline = company?.tagline || (en ? 'The trusted leaf – for a green and fair future' : 'Chiếc lá tin cậy – Vì một tương lai xanh và công bằng');

  const areas = (cmsExpertise.length
    ? cmsExpertise.map((e) => ({ slug: e.slug || String(e.id), title: e.title, summary: e.summary, image: mediaUrl(e.image, 'card') }))
    : staticExpertise.map((e) => ({ slug: e.slug, title: e[lang], summary: (en ? e.descriptionEn : e.descriptionVi) || '', image: null as string | null }))
  ).map((a) => ({ ...a, image: a.image || PHOTO[a.slug] || PHOTO.leaves }));

  const values = en
    ? [
        ['Transparency', 'Methods, data and results presented clearly and open to verification.'],
        ['Fairness', 'Solutions that put communities and vulnerable groups at the centre.'],
        ['Sustainability', 'Long-term impact for people and the planet, not short-term fixes.'],
      ]
    : [
        ['Minh bạch', 'Phương pháp, dữ liệu và kết quả được trình bày rõ ràng, có thể kiểm chứng.'],
        ['Công bằng', 'Giải pháp đặt cộng đồng và các nhóm dễ bị tổn thương vào trung tâm.'],
        ['Bền vững', 'Hướng tới tác động lâu dài cho con người và hành tinh.'],
      ];

  return (
    <GlassPage lang={lang}>
      <GlassHeader lang={lang} />

      {/* ---------- HERO ---------- */}
      <section className={`${s.panel} ${s.hero}`}>
        <div className={s.panelBg} aria-hidden="true">
          <img src={PHOTO.fern} alt="" />
        </div>
        <div className={s.inner}>
          <div>
            <span className={s.kicker} data-reveal="">
              VeraLeaf · {en ? 'Climate & sustainability' : 'Khí hậu & phát triển bền vững'}
            </span>
            <h1 className={s.title} data-reveal="" style={delay(0.1)}>
              {words.join(' ')} <em>{last}</em>
            </h1>
            <p className={s.lede} data-reveal="" style={delay(0.2)}>
              {tagline}
            </p>
            <div className={s.actions} data-reveal="" style={delay(0.3)}>
              <a className={`${s.pill} ${s.pillLight}`} href={L('expertise')}>
                {en ? 'Explore our work' : 'Khám phá lĩnh vực'} <Arrow />
              </a>
              <a className={`${s.pill} ${s.pillOutline}`} href="#contact">
                {en ? 'Get in touch' : 'Kết nối với chúng tôi'}
              </a>
            </div>
          </div>
          <div className={`${s.glassBox} ${s.heroCard}`} data-reveal="" style={delay(0.4)}>
            <figure>
              <img src={PHOTO.jungle} alt={en ? 'Lush tropical plants' : 'Thảm thực vật nhiệt đới'} />
            </figure>
            <p>{en ? 'Climate solutions grounded in science and community.' : 'Giải pháp khí hậu dựa trên khoa học và cộng đồng.'}</p>
            <a className={`${s.pill} ${s.pillLight}`} href={L('about')}>
              {en ? 'About VeraLeaf' : 'Về VeraLeaf'} <Arrow />
            </a>
          </div>
        </div>
      </section>

      {/* ---------- ABOUT ---------- */}
      <section className={`${s.panel} ${s.panelDark}`}>
        <div className={s.panelBg} aria-hidden="true">
          <img src={PHOTO.leaves} alt="" />
        </div>
        <div className={`${s.inner} ${s.aboutGrid}`}>
          <div>
            <h2 className={s.h2} data-reveal="">
              {en ? 'Partnering on the green transition for businesses and communities' : 'Đồng hành cùng doanh nghiệp và cộng đồng trên hành trình chuyển đổi xanh'}
            </h2>
            {company?.philosophyText && (
              <p className={s.quoteSmall} data-reveal="" style={delay(0.08)}>
                “{company.philosophyText}”
              </p>
            )}
          </div>
          <div className={s.media} data-reveal="" style={delay(0.1)}>
            <img src={PHOTO.handsFern} alt={en ? 'Hands holding a young fern' : 'Đôi tay nâng niu mầm dương xỉ'} loading="lazy" />
            <span className={s.badge}>
              <LeafIcon />
            </span>
          </div>
        </div>
      </section>

      {/* ---------- VALUES ---------- */}
      <section className={`${s.panel} ${s.panelDark}`}>
        <div className={s.panelBg} aria-hidden="true">
          <img src={PHOTO.foliage} alt="" loading="lazy" />
        </div>
        <div className={s.inner}>
          <div className={s.center}>
            <span className={s.kicker} data-reveal="">
              {en ? 'What we stand for' : 'Giá trị cốt lõi'}
            </span>
            <h2 className={s.h2} data-reveal="" style={delay(0.1)}>
              {en ? 'Three values behind every project we take on' : 'Ba giá trị chúng tôi theo đuổi trong mọi dự án'}
            </h2>
          </div>
          <div className={s.values}>
            {values.map(([title, text], i) => (
              <article key={title} className={`${s.glassBox} ${s.valueCard} ${s.sheen}`} data-reveal="" style={delay(i * 0.12)}>
                <span className={s.num}>{i + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- EXPERTISE ---------- */}
      <section className={`${s.panel} ${s.panelDark}`}>
        <div className={s.panelBg} aria-hidden="true">
          <img src={PHOTO.forest} alt="" loading="lazy" />
        </div>
        <div className={s.inner}>
          <div className={s.headRow}>
            <div>
              <span className={s.kicker} data-reveal="">
                {en ? 'Expertise' : 'Lĩnh vực hoạt động'}
              </span>
              <h2 className={s.h2} data-reveal="" style={{ ...delay(0.08), marginBottom: 0 }}>
                {en ? 'Interdisciplinary, evidence-based' : 'Liên ngành, dựa trên bằng chứng'}
              </h2>
            </div>
            <p data-reveal="" style={delay(0.15)}>
              {en
                ? 'Research capability combined with practical experience from local to international projects.'
                : 'Năng lực nghiên cứu kết hợp kinh nghiệm thực tiễn từ các dự án địa phương đến quốc tế.'}
            </p>
          </div>
          <div className={s.expGrid}>
            {areas.map((a, i) => (
              <a key={a.slug} href={L('expertise/' + a.slug)} className={`${s.glassBox} ${s.expCard} ${s.sheen}`} data-reveal="" style={delay((i % 3) * 0.1)}>
                <figure>
                  <img src={a.image} alt="" loading="lazy" />
                </figure>
                <div className={s.expBody}>
                  <small>{String(i + 1).padStart(2, '0')}</small>
                  <h3>{a.title}</h3>
                  <p>{a.summary}</p>
                  <span className={s.arrow}>
                    <Arrow />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CONTACT ---------- */}
      <section className={`${s.panel} ${s.panelBright}`} id="contact">
        <div className={s.panelBg} aria-hidden="true">
          <img src={PHOTO.darkFern} alt="" loading="lazy" />
        </div>
        <div className={`${s.inner} ${s.contactGrid}`}>
          <div>
            <h2 className={s.title} style={{ fontSize: 'clamp(36px, 4.6vw, 64px)' }} data-reveal="">
              {en ? 'Let’s discuss your project?' : 'Cùng thảo luận về dự án của bạn?'}
            </h2>
            <p className={s.lede} data-reveal="" style={delay(0.1)}>
              {en ? 'Get in touch with us' : 'Liên hệ với chúng tôi'}
            </p>
          </div>
          <div className={`${s.glassBox} ${s.contactCard}`} data-reveal="" style={delay(0.15)}>
            <div className={s.contactList}>
              {company?.email && (
                <a href={`mailto:${company.email}`}>
                  <b>Email</b>
                  {company.email}
                </a>
              )}
              {[company?.phone, company?.phone2]
                .filter((p): p is string => Boolean(p))
                .map((p, i) => (
                  <a key={p} href={`tel:${p.replace(/[^+\d]/g, '')}`}>
                    <b>{i === 0 ? (en ? 'Phone' : 'Điện thoại') : ''}</b>
                    {p}
                  </a>
                ))}
              {company?.address && (
                <span>
                  <b>{en ? 'Address' : 'Địa chỉ'}</b>
                  {company.address}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <GlassFooter lang={lang} />
    </GlassPage>
  );
}
