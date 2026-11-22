type Props = { i18n?: { language?: string }; user?: { name?: string | null; email?: string } | null };

/** Welcome banner with shortcuts at the top of the admin dashboard. */
export function BeforeDashboard({ i18n, user }: Props) {
  const en = i18n?.language === 'en';
  const name = user?.name || user?.email || '';
  const links = [
    { href: '/admin/globals/company-information', label: en ? 'Company information' : 'Thông tin công ty' },
    { href: '/admin/collections/expertise', label: en ? 'Expertise' : 'Lĩnh vực' },
    { href: '/admin/collections/projects/create', label: en ? 'New project' : 'Thêm dự án' },
    { href: '/admin/collections/insights/create', label: en ? 'New article' : 'Viết bài mới' },
    { href: '/admin/collections/organization', label: en ? 'Organisation chart' : 'Sơ đồ tổ chức' },
  ];
  return (
    <section className="vl-dashboard-hero">
      <div className="vl-dashboard-hero__text">
        <span className="vl-kicker">VeraLeaf CMS</span>
        <h2>{en ? `Hello${name ? ', ' + name : ''}` : `Xin chào${name ? ', ' + name : ''}`}</h2>
        <p>
          {en
            ? 'Content you publish here appears on the website in Vietnamese and English. Save as draft to keep it private; tick “Archived” to hide published content.'
            : 'Nội dung xuất bản tại đây sẽ hiển thị trên website bằng tiếng Việt và tiếng Anh. Lưu nháp để giữ riêng tư; tích “Archived” để ẩn nội dung đã xuất bản.'}
        </p>
        <div className="vl-dashboard-hero__links">
          {links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
          <a className="vl-primary" href={en ? '/en' : '/vi'} target="_blank" rel="noopener noreferrer">
            {en ? 'View website ↗' : 'Xem website ↗'}
          </a>
        </div>
      </div>
    </section>
  );
}
