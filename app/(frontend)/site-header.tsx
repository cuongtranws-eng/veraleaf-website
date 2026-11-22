 'use client';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Entry, Lang, menus as staticMenus, url } from './site-data';
/** `expertiseItems` (from the CMS) replaces the static Expertise dropdown when provided. */
export default function SiteHeader({lang,expertiseItems}:{lang:Lang;expertiseItems?:Entry[]}){
 const menus=expertiseItems&&expertiseItems.length?staticMenus.map(m=>m.slug==='expertise'?{...m,children:expertiseItems}:m):staticMenus;
 const [open,setOpen]=useState(false);const [expanded,setExpanded]=useState<string|null>(null);
 const path=usePathname();const router=useRouter();
 const switchLang=(next:Lang)=>{const parts=path.split('/').filter(Boolean);if(parts[0]==='vi'||parts[0]==='en')parts.shift();router.push('/'+next+(parts.length?'/'+parts.join('/'):''));setOpen(false);};
 return <header className="header"><div className="shell nav-wrap">
  <a className="brand" href={url(lang,'')} aria-label={lang==='vi'?'VeraLeaf – Trang chủ':'VeraLeaf – Home'}><img className="brand-logo" src="/brand/veraleaf-logo.png" alt="VeraLeaf" width={480} height={226}/></a>
  <nav className={'nav nav-dropdown '+(open?'open':'')} aria-label={lang==='vi'?'Điều hướng chính':'Main navigation'}>
   {menus.map(m=><div className="nav-group" key={m.slug||'home'}>
    <div className="nav-group-head"><a href={url(lang,m.slug)} onClick={()=>setOpen(false)}>{m[lang]}</a>{m.children&&<button className="nav-chevron" aria-label={(lang==='vi'?'Mở menu ':'Open menu ')+m[lang]} aria-expanded={expanded===m.slug} onClick={()=>setExpanded(expanded===m.slug?null:m.slug)}>⌄</button>}</div>
    {m.children&&<div className={'dropdown '+(expanded===m.slug?'expanded':'')}>
      {m.children.map(c=><a key={c.slug} href={url(lang,m.slug,c.slug)} onClick={()=>{setOpen(false);setExpanded(null);}}>{c[lang]}</a>)}
    </div>}
   </div>)}
  </nav>
  <div className="nav-actions"><div className="lang"><button className={lang==='vi'?'active':''} aria-pressed={lang==='vi'} onClick={()=>switchLang('vi')}>VN</button><span>/</span><button className={lang==='en'?'active':''} aria-pressed={lang==='en'} onClick={()=>switchLang('en')}>EN</button></div><button className="menu-button" aria-label="Toggle menu" aria-expanded={open} onClick={()=>setOpen(!open)}>{open?'✕':'☰'}</button></div>
 </div></header>;
}
