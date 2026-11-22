'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Scroll-reveal: elements with [data-reveal] (and sub-page content blocks) fade, rise and
 * un-blur as they enter the viewport. Content stays fully visible without JavaScript,
 * and nothing animates when the visitor prefers reduced motion.
 */
const AUTO = '.glass .subcontent > *, .glass .detail-grid > *';

export default function Reveal() {
  // Re-run after client-side navigations so new content is revealed too.
  const pathname = usePathname();
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    (window as unknown as { __revealStarted?: boolean }).__revealStarted = true;
    const root = document.documentElement;

    // Auto-reveal sub-page blocks that start below the fold (avoids a flash for visible ones).
    document.querySelectorAll<HTMLElement>(AUTO).forEach((el, i) => {
      if (el.hasAttribute('data-reveal')) return;
      if (el.getBoundingClientRect().top > window.innerHeight * 0.92) {
        el.setAttribute('data-reveal', '');
        el.style.setProperty('--d', `${(i % 3) * 0.08}s`);
      }
    });

    root.classList.add('reveal-ready');
    const els = document.querySelectorAll<HTMLElement>('[data-reveal]');
    if (!('IntersectionObserver' in window)) {
      els.forEach((e) => e.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.classList.add('is-in');
            io.unobserve(el);
            // Hand control back to the element's own styles/transitions once revealed.
            const d = parseFloat(el.style.getPropertyValue('--d')) || 0;
            window.setTimeout(() => {
              el.removeAttribute('data-reveal');
              el.classList.remove('is-in');
            }, 1100 + d * 1000);
          }
        }),
      { rootMargin: '0px 0px -6% 0px', threshold: 0.12 },
    );
    els.forEach((e) => {
      if (!e.classList.contains('is-in')) io.observe(e);
    });
    // Safety net: if the observer is throttled (e.g. background tab), show what is on screen.
    const fallback = window.setTimeout(() => {
      document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in)').forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('is-in');
      });
    }, 2000);
    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, [pathname]);
  return null;
}
