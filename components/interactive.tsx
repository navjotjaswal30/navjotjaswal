'use client';

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Check, Copy, Menu, Send, Sparkles, X } from 'lucide-react';
import { awards, prompts, type Project } from '../content/portfolio';

type Mode = 'product' | 'builder';
const ModeContext = createContext<{ mode: Mode; setMode: (mode: Mode) => void }>({ mode: 'product', setMode: () => {} });

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, updateMode] = useState<Mode>('product');
  useEffect(() => {
    try {
      if (localStorage.getItem('portfolio-mode') === 'builder') {
        requestAnimationFrame(() => updateMode('builder'));
      }
    } catch {}
  }, []);
  function setMode(value: Mode) {
    updateMode(value);
    try { localStorage.setItem('portfolio-mode', value); } catch {}
  }
  return <ModeContext.Provider value={{ mode, setMode }}>{children}</ModeContext.Provider>;
}

export function ModeSwitch() {
  const { mode, setMode } = useContext(ModeContext);
  return <fieldset className="mode-switch">
    <legend>Product Thinking Mode</legend>
    <button type="button" aria-pressed={mode === 'product'} onClick={() => setMode('product')}>Product Thinking</button>
    <button type="button" aria-pressed={mode === 'builder'} onClick={() => setMode('builder')}>Builder View</button>
  </fieldset>;
}

export function ModeCopy({ project, compact = false }: { project: Project; compact?: boolean }) {
  const { mode } = useContext(ModeContext);
  return <div className="mode-copy" key={mode} aria-live="polite">
    {!compact && <h2>{mode === 'product' ? 'The product approach' : 'How it works'}</h2>}
    <p>{mode === 'product' ? project.product : project.builder}</p>
  </div>;
}

const links = [['Home', 'home'], ['About', 'about'], ['Work', 'work'], ['Experience', 'experience'], ['Résumé', 'resume'], ['Contact', 'contact']];

export function Header() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('home');
  useEffect(() => {
    const listener = () => setActive(location.hash.slice(1) || 'home');
    listener();
    window.addEventListener('hashchange', listener);
    return () => window.removeEventListener('hashchange', listener);
  }, []);
  return <header className="site-header">
    <div className="wrap header-inner">
      <Link href="/#home" className="brand"><span className="brand-mark"><Sparkles size={17} /></span> Navjot Jaswal</Link>
      <button className="mobile-menu icon-button" aria-expanded={open} aria-controls="site-nav" aria-label={open ? 'Close navigation' : 'Open navigation'} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      <nav id="site-nav" className={open ? 'is-open' : ''} aria-label="Main navigation">
        {links.map(([name, id]) => <Link key={id} href={'/#' + id} className={active === id ? 'active' : undefined} onClick={() => { setOpen(false); setActive(id); }}>{name}</Link>)}
      </nav>
      <Link className="header-cta" href="/#contact">Let’s talk <ArrowUpRight size={14} /></Link>
    </div>
  </header>;
}

export function FactoryControls() {
  const [flight, setFlight] = useState(0);
  const [on, setOn] = useState(false);
  return <>
    <button type="button" className="machine-switch" aria-label="Workshop machine power" aria-pressed={on} onClick={() => setOn(!on)} />
    {on && <span className="machine-light" aria-hidden="true" />}
    <button type="button" key={flight} className={'paper-plane ' + (flight ? 'flight' : '')} onClick={() => setFlight(flight + 1)} aria-label="Fly the workshop paper airplane"><Send size={19} /></button>
  </>;
}

function animateProject(dialog: HTMLDialogElement, link: HTMLAnchorElement | undefined, reverse: boolean) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const image = link?.querySelector('.project-visual');
  if (!image) return;
  const from = image.getBoundingClientRect();
  const to = dialog.getBoundingClientRect();
  if (from.bottom < 0 || from.top > innerHeight || !to.width) return;
  const start = {
    transform: 'translate(' + (from.left - to.left) + 'px,' + (from.top - to.top) + 'px) scale(' +
      (from.width / to.width) + ',' + (from.height / to.height) + ')',
    transformOrigin: 'top left',
    opacity: .3,
  };
  return dialog.animate([start, { transform: 'none', transformOrigin: 'top left', opacity: 1 }], {
    direction: reverse ? 'reverse' : 'normal',
    duration: reverse ? 220 : 390,
    easing: 'cubic-bezier(.2,.75,.2,1)',
    fill: reverse ? 'forwards' : 'none',
  });
}

export function Gallery({ entries }: { entries: { project: Project; visual: ReactNode; study: ReactNode }[] }) {
  const dialogs = useRef(new Map<string, HTMLDialogElement>());
  const links = useRef(new Map<string, HTMLAnchorElement>());
  const returnFocus = useRef<string | null>(null);
  const homeUrl = useRef('');
  const [active, setActive] = useState<string | null>(null);
  const closing = useRef(false);

  useEffect(() => {
    function synchronize() {
      const match = location.pathname.match(/^\/work\/([^/]+)\/?$/);
      setActive(match?.[1] ?? null);
    }
    window.addEventListener('popstate', synchronize);
    return () => window.removeEventListener('popstate', synchronize);
  }, []);

  useEffect(() => {
    for (const [slug, dialog] of dialogs.current) {
      if (slug === active && !dialog.open) {
        dialog.showModal();
        dialog.scrollTop = 0;
        animateProject(dialog, links.current.get(slug), false);
      } else if (slug !== active && dialog.open) {
        dialog.getAnimations().forEach(animation => animation.cancel());
        dialog.close();
      }
    }
    if (!active && returnFocus.current) {
      links.current.get(returnFocus.current)?.focus({ preventScroll: true });
    }
    document.body.classList.toggle('dialog-open', Boolean(active));
    return () => document.body.classList.remove('dialog-open');
  }, [active]);

  async function dismiss() {
    if (closing.current || !active) return;
    closing.current = true;
    const dialog = dialogs.current.get(active);
    if (dialog) {
      try { await animateProject(dialog, links.current.get(active), true)?.finished; } catch {}
    }
    closing.current = false;
    if (history.state?.ideaFactoryProject) history.back();
    else {
      history.replaceState(history.state, '', homeUrl.current || '/#work');
      setActive(null);
    }
  }

  return <div className="project-gallery">{entries.map(({ project, visual, study }, i) =>
    <article className={'project-card ' + project.style} key={project.slug}>
      <a href={'/work/' + project.slug + '/'} ref={node => { if (node) links.current.set(project.slug, node); else links.current.delete(project.slug); }}
        onClick={event => {
          if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
          event.preventDefault();
          homeUrl.current = location.pathname + location.search + location.hash;
          returnFocus.current = project.slug;
          // Preserve Next's state so a reload or a direct link still resolves to the standalone route.
          history.pushState({ ...history.state, ideaFactoryProject: true }, '', event.currentTarget.href);
          setActive(project.slug);
        }}>
        {visual}
        <div className="project-card-body">
          <span className="eyebrow">{(i + 1).toString().padStart(2, '0')} / {project.category}</span>
          <div className="project-title"><h3>{project.name}</h3><span className="open-icon"><ArrowUpRight size={22} /></span></div>
          <ModeCopy project={project} compact />
        </div>
      </a>
      <dialog className="case-dialog" ref={node => { if (node) dialogs.current.set(project.slug, node); else dialogs.current.delete(project.slug); }}
        aria-label={project.name + ' case study'} onCancel={event => { event.preventDefault(); dismiss(); }}>
        <div className="dialog-bar"><button type="button" onClick={dismiss}><X size={18} /> Close case study</button></div>
        {study}
      </dialog>
    </article>)}</div>;
}

export function TrophyShelf() {
  const [selected, setSelected] = useState(0);
  return <div>
    <div className="trophy-shelf" aria-label="Achievements">{awards.map(([number, title], i) =>
      <button key={title} type="button" aria-pressed={selected === i} onClick={() => setSelected(i)}>
        <span className="trophy-symbol" aria-hidden="true">{number}</span><span>{title}</span>
      </button>)}</div>
    <p className="award-detail" aria-live="polite" key={selected}>{awards[selected][2]}</p>
  </div>;
}

export function IdeaMachine() {
  const [index, setIndex] = useState(-1);
  const [status, setStatus] = useState('');
  async function copy() {
    try {
      await navigator.clipboard.writeText(prompts[index]);
      setStatus('Copied');
    } catch { setStatus('Select the prompt text to copy it.'); }
  }
  return <div className="idea-console">
    <div className="console-top"><span className="eyebrow">Prompt dispenser</span><span aria-hidden="true" className={index >= 0 ? 'lamp lit' : 'lamp'} /></div>
    <div className="console-output" aria-live="polite"><p key={index}>{index < 0 ? 'A good idea starts with a question.' : prompts[index]}</p></div>
    <div className="console-controls">
      <button type="button" className="button clay" onClick={() => { setIndex((index + 1) % prompts.length); setStatus(''); }}><Sparkles size={17} />{index < 0 ? 'Generate an idea' : 'Generate another'}</button>
      {index >= 0 && <><button type="button" className="icon-button" onClick={copy} aria-label="Copy prompt">{status === 'Copied' ? <Check size={19} /> : <Copy size={19} />}</button><button type="button" className="text-link" onClick={() => { setIndex(-1); setStatus(''); }}>Reset</button></>}
    </div>
    <div className="copy-status" role="status">{status}</div>
  </div>;
}
