import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'),
  title: { default: 'VeraLeaf – Chiếc lá tin cậy', template: '%s | VeraLeaf' },
  description: 'VeraLeaf tư vấn giảm phát thải, kiểm kê khí nhà kính, lộ trình Net Zero và thích ứng biến đổi khí hậu cho doanh nghiệp và cộng đồng.',
  icons: { icon: '/brand/veraleaf-logo.png' },
};

// Enables the scroll-reveal hidden state before first paint (no flash). If the reveal script
// never starts (JS error, blocked bundle), everything is shown after 2.5 s.
const revealBoot = `(function(){try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;var d=document.documentElement;d.classList.add('reveal-ready');setTimeout(function(){if(!window.__revealStarted){d.classList.remove('reveal-ready')}},2500)}catch(e){}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: revealBoot }} />
        <meta name="theme-color" content="#070d0a" />
      </head>
      <body>{children}</body>
    </html>
  );
}
