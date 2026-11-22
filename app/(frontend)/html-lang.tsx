'use client';

import { useEffect } from 'react';

/** Keeps <html lang> in sync with the page language (the shared root layout defaults to "vi"). */
export default function HtmlLang({ lang }: { lang: string }) {
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return null;
}
