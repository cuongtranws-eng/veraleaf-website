'use client';
// NOTE: previous home page design — no longer rendered (replaced by home-organic.tsx).
// To roll back, render <Home initialLang={lang} cms={...}/> again in app/(frontend)/[lang]/page.tsx.

import { useEffect, useState } from 'react';
import SiteHeader from './site-header';
import { expertise as expertisePages, type Entry } from './site-data';

type Lang = 'vi' | 'en';
/** Optional CMS overrides. Anything missing falls back to the built-in copy below. */
export type HomeCms = {
  slogan?: string;
  tagline?: string;
  aboutText?: string;
  philosophyText?: string;
  email?: string;
  services?: { number: string; title: string; desc: string; slug: string }[];
  expertiseNav?: Entry[];
  insightCards?: { category: string; title: string; href: string; image: string | null; date: string }[];
};
const data = {
  vi: {
    nav: ['Trang chủ','Về chúng tôi','Lĩnh vực','Dự án','Góc nhìn','Liên hệ'],
    badge: 'NGHIÊN CỨU • ĐỔI MỚI • PHÁT TRIỂN BỀN VỮNG',
    heroA: 'Hiểu sâu', heroB: 'để tạo nên', heroC: 'thay đổi bền vững.',
    heroDesc: 'Kết nối tri thức khoa học, dữ liệu và kinh nghiệm thực tiễn để kiến tạo những giải pháp phát triển có ý nghĩa.',
    discover: 'Khám phá lĩnh vực', contact: 'Kết nối với chúng tôi', scroll: 'CUỘN ĐỂ KHÁM PHÁ',
    labelAbout: '01 / VỀ VERALEAF', aboutTitle: 'Nghiên cứu có chiều sâu. Giải pháp có tác động.',
    aboutText: 'Veraleaf hoạt động trong các lĩnh vực tư vấn phát triển, nghiên cứu khoa học, môi trường, biến đổi khí hậu, GIS & viễn thám và giáo dục. Chúng tôi hướng đến cách tiếp cận liên ngành, dựa trên bằng chứng và gắn với nhu cầu thực tiễn.',
    philosophy: 'ĐỊNH HƯỚNG CỦA CHÚNG TÔI', philosophyText: 'Từ những câu hỏi đúng đến những giải pháp phù hợp — bằng nghiên cứu, hợp tác và hành động có trách nhiệm.',
    labelExpertise: '02 / CHUYÊN MÔN', expertiseTitle: 'Sáu lĩnh vực. Một tầm nhìn chung.',
    expertiseDesc: 'Kết hợp năng lực nghiên cứu và hiểu biết đa ngành để giải quyết những thách thức phát triển phức tạp.',
    services: [
      ['01','Tư vấn phát triển','Tư vấn chính sách, chương trình và sáng kiến phát triển theo cách tiếp cận dựa trên bằng chứng.'],
      ['02','Nghiên cứu khoa học','Thiết kế nghiên cứu, thu thập, phân tích dữ liệu và chuyển hóa kết quả thành tri thức hữu ích.'],
      ['03','Môi trường','Nghiên cứu và tư vấn các vấn đề về tài nguyên, hệ sinh thái và quản lý môi trường.'],
      ['04','Biến đổi khí hậu','Phân tích rủi ro khí hậu, tính dễ bị tổn thương và các giải pháp thích ứng.'],
      ['05','GIS & Viễn thám','Ứng dụng dữ liệu không gian, ảnh vệ tinh và UAV trong giám sát, phân tích và ra quyết định.'],
      ['06','Giáo dục','Nghiên cứu, đánh giá và phát triển các sáng kiến nâng cao chất lượng giáo dục.'],
    ],
    labelWork:'03 / DỰ ÁN', workTitle:'Tri thức được chuyển thành hành động.', workText:'Các dự án và kết quả nổi bật của Veraleaf sẽ được cập nhật tại đây sau khi nội dung được xác nhận.', workCta:'Khám phá dự án',
    labelInsights:'04 / GÓC NHÌN', insightsTitle:'Chia sẻ tri thức. Mở rộng góc nhìn.', insightsText:'Không gian dành cho nghiên cứu, báo cáo, phân tích và những câu chuyện từ thực tiễn.',
    insightCards:[['NGHIÊN CỨU','Từ dữ liệu đến những phát hiện có giá trị'],['MÔI TRƯỜNG','Những góc nhìn mới về phát triển bền vững'],['CÔNG NGHỆ','Dữ liệu không gian cho quyết định tốt hơn']],
    coming:'Nội dung đang được xây dựng',
    labelContact:'KẾT NỐI', contactTitle:'Cùng tạo ra những thay đổi có ý nghĩa.', contactText:'Chúng tôi mong muốn kết nối với các đối tác cùng chia sẻ định hướng phát triển dựa trên tri thức và hợp tác.', contactButton:'Liên hệ Veraleaf',
    footer:'Nghiên cứu và giải pháp cho phát triển bền vững', copyright:'© 2026 Veraleaf. Bảo lưu mọi quyền.'
  },
  en: {
    nav: ['Home','About','Expertise','Projects','Insights','Contact'],
    badge: 'RESEARCH • INNOVATION • SUSTAINABILITY',
    heroA: 'Deep insight.', heroB: 'Lasting', heroC: 'impact.',
    heroDesc: 'Bringing together scientific knowledge, data and practical experience to create meaningful development solutions.',
    discover: 'Explore expertise', contact: 'Get in touch', scroll: 'SCROLL TO EXPLORE',
    labelAbout: '01 / ABOUT VERALEAF', aboutTitle: 'Rigorous research. Meaningful solutions.',
    aboutText: 'Veraleaf works across development consulting, scientific research, environment, climate change, GIS & remote sensing, and education. Our approach is interdisciplinary, evidence-based, and grounded in real-world needs.',
    philosophy:'OUR PERSPECTIVE', philosophyText:'From asking the right questions to designing relevant solutions — through research, collaboration and responsible action.',
    labelExpertise:'02 / EXPERTISE', expertiseTitle:'Six disciplines. One shared vision.',
    expertiseDesc:'Combining research capability with cross-disciplinary insight to address complex development challenges.',
    services:[
      ['01','Development Consulting','Evidence-informed advice for policies, programmes and development initiatives.'],
      ['02','Scientific Research','Research design, data collection, analysis and translating findings into actionable knowledge.'],
      ['03','Environment','Research and advisory work on natural resources, ecosystems and environmental management.'],
      ['04','Climate Change','Climate risk, vulnerability assessments and adaptation approaches.'],
      ['05','GIS & Remote Sensing','Spatial data, satellite imagery and UAV applications for monitoring, analysis and decisions.'],
      ['06','Education','Research, evaluation and initiatives to improve education quality.'],
    ],
    labelWork:'03 / PROJECTS', workTitle:'Turning knowledge into action.', workText:'Selected projects and outcomes will appear here once their details have been confirmed.', workCta:'Explore projects',
    labelInsights:'04 / INSIGHTS', insightsTitle:'Sharing knowledge. Expanding perspectives.', insightsText:'A space for research, reports, analysis and stories from the field.',
    insightCards:[['RESEARCH','From data to meaningful insights'],['ENVIRONMENT','New perspectives on sustainable development'],['TECHNOLOGY','Spatial intelligence for better decisions']],
    coming:'Content in development',
    labelContact:'LET’S CONNECT', contactTitle:'Let’s create meaningful change together.', contactText:'We welcome conversations with partners who share our commitment to knowledge-driven, collaborative development.', contactButton:'Contact Veraleaf',
    footer:'Research and solutions for sustainable development', copyright:'© 2026 Veraleaf. All rights reserved.'
  }
};
const ids = ['home','about','expertise','projects','insights','contact'];
function LeafMark(){ return <span className="mark" aria-hidden="true"><svg viewBox="0 0 44 44" fill="none"><path d="M37 7C17 8 8 19 9 32c13 3 27-6 28-25Z" fill="currentColor" opacity=".9"/><path d="M9 37C14 26 21 19 34 12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/><path d="M17 29 14 19M23 22l10 1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/></svg></span> }
export default function Home({initialLang='vi',cms={}}:{initialLang?:Lang;cms?:HomeCms}){
  const [lang,setLang] = useState<Lang>(initialLang);
  const [menu,setMenu] = useState(false);
  
  useEffect(()=>{document.documentElement.lang=lang;},[lang]);
  useEffect(()=>{setLang(initialLang);},[initialLang]);
  const t=data[lang];
  const services=cms.services??t.services.map(([number,title,desc],i)=>({number,title,desc,slug:expertisePages[i].slug}));
  const serviceTotal=String(services.length).padStart(2,'0');
  const insightCards=cms.insightCards??t.insightCards.map(([category,title])=>({category,title,href:'',image:null as string|null,date:''}));
  const email=cms.email||'info@veraleaf.com.vn';
  // Hero heading: CMS slogan split over two lines with the last word highlighted (same markup as before).
  const sloganWords=(cms.slogan||'').trim().split(/\s+/).filter(Boolean);
  const half=Math.ceil((sloganWords.length-1)/2);
  const hero=sloganWords.length>=2?{a:sloganWords.slice(0,half).join(' '),b:sloganWords.slice(half,-1).join(' '),c:sloganWords[sloganWords.length-1]}:{a:t.heroA,b:t.heroB,c:t.heroC};
  return <>
    <SiteHeader lang={lang} expertiseItems={cms.expertiseNav}/>
    <main>
      <section id="home" className="hero"><div className="hero-image"/><div className="hero-overlay"/><div className="shell hero-content"><div className="hero-eyebrow"><span className="eyebrow-line"/>{t.badge}</div><h1>{hero.a}<br/>{hero.b}{hero.b?' ':''}<em>{hero.c}</em></h1><p>{cms.tagline||t.heroDesc}</p><div className="hero-actions"><a className="btn btn-light" href={`/${lang}/expertise`}>{t.discover} <span>↗</span></a><a className="btn btn-outline" href={`/${lang}/contact`}>{t.contact} <span>→</span></a></div></div><div className="hero-bottom shell"><span>{t.scroll}</span><span className="hero-scroll-line"/></div><div className="hero-side">VERALEAF / 2026</div></section>
      <section id="about" className="section about"><div className="shell about-layout"><div><span className="kicker">{t.labelAbout}</span><h2>{t.aboutTitle}</h2></div><div className="about-right"><p className="lead">{cms.aboutText||t.aboutText}</p><div className="statement"><span className="kicker">{t.philosophy}</span><blockquote>“{cms.philosophyText||t.philosophyText}”</blockquote></div></div></div></section>
      <section id="expertise" className="section expertise"><div className="shell"><div className="section-top"><div><span className="kicker">{t.labelExpertise}</span><h2>{t.expertiseTitle}</h2></div><p>{t.expertiseDesc}</p></div><div className="service-grid">{services.map(({number,title,desc,slug},i)=><a className="service" key={slug} href={`/${lang}/expertise/${slug}`}><div className="service-head"><span>{number} / {serviceTotal}</span><span className="service-arrow">↗</span></div><div className={'service-icon service-icon-'+(i%6)}>{['◈','✳','❋','◉','⌁','✦'][i%6]}</div><h3>{title}</h3><p>{desc}</p></a>)}</div></div></section>
      <section id="projects" className="projects"><div className="project-photo"/><div className="project-shade"/><div className="shell project-content"><span className="kicker bright">{t.labelWork}</span><h2>{t.workTitle}</h2><p>{t.workText}</p><a className="btn btn-light" href={`/${lang}/contact`}>{t.workCta} <span>↗</span></a></div></section>
      <section id="insights" className="section insights"><div className="shell"><div className="section-top"><div><span className="kicker">{t.labelInsights}</span><h2>{t.insightsTitle}</h2></div><p>{t.insightsText}</p></div><div className="insights-grid">{insightCards.map(({category,title,href,image,date},i)=><article key={href||title} className="insight"><div className={'insight-image insight-'+(i%3)} style={image?{backgroundImage:`linear-gradient(0deg,#103b284a,#103b284a),url("${encodeURI(image)}")`}:undefined}><span>{String(i+1).padStart(2,'0')}</span></div><div className="insight-meta"><span>{category}</span><span>{date||t.coming}</span></div><h3>{href?<a href={href}>{title}</a>:title}</h3></article>)}</div></div></section>
      <section id="contact" className="contact-section"><div className="shell contact-content"><span className="kicker bright">{t.labelContact}</span><h2>{t.contactTitle}</h2><p>{t.contactText}</p><a href={`mailto:${email}`} className="btn btn-light">{t.contactButton}<span>↗</span></a>{!cms.email&&<p className="contact-note">Email hiển thị là địa chỉ mẫu — cần xác nhận trước khi xuất bản.</p>}</div><div className="contact-orbit"/></section>
    </main>
    <footer className="footer"><div className="shell footer-wrap"><div><a className="brand footer-brand" href="#home"><LeafMark/><span>vera<span className="brand-light">leaf</span><small>RESEARCH & DEVELOPMENT</small></span></a><p>{cms.tagline||t.footer}</p></div><div className="footer-links">{[{name:lang==='vi'?'Trang chủ':'Home',path:''},{name:lang==='vi'?'Về chúng tôi':'About',path:'about'},{name:lang==='vi'?'Lĩnh vực':'Expertise',path:'expertise'},{name:lang==='vi'?'Dự án':'Projects',path:'projects'},{name:lang==='vi'?'Góc nhìn':'Insights',path:'insights'},{name:lang==='vi'?'Liên hệ':'Contact',path:'contact'}].map(x=><a href={`/${lang}/${x.path}`} key={x.path}>{x.name}</a>)}</div></div><div className="shell bottom-footer"><span>{t.copyright}</span><span>Designed for purpose. Built for impact.</span></div></footer>
  </>;
}
