import { permanentRedirect } from 'next/navigation';

/** The design demo became the home page; keep old /demo links working. */
export default async function DemoRedirect({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  permanentRedirect(lang === 'en' ? '/en' : '/vi');
}
