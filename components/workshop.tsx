'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { ArrowDownLeft, ArrowLeft, ArrowRight, AudioLines, BookOpen, Cable, CircuitBoard, ClipboardList, Cpu, FileText, Gauge, LampDesk, Mail, PackageOpen, Pause, Play, Radar, Sparkles, Trophy, UserRound, X } from 'lucide-react';
import { type Project } from '../content/portfolio';

export type Station = { id: string; title: string; content: ReactNode };
const tools = [
  { id: 'about', label: 'Maker’s notes', Icon: UserRound },
  { id: 'experience', label: 'Tool cabinet', Icon: CircuitBoard },
  { id: 'achievements', label: 'Trophy shelf', Icon: Trophy },
  { id: 'resume', label: 'Résumé drawer', Icon: FileText },
  { id: 'playground', label: 'Idea machine', Icon: Sparkles },
  { id: 'contact', label: 'Outgoing mail', Icon: Mail },
];
const cargoIcons = [BookOpen, ClipboardList, AudioLines, Radar];
const cargoNouns = ['Research dossier', 'Academic assistant', 'Lecture companion', 'Dispatch console'];

export function Workshop({ projects, studies, stations }: { projects: Project[]; studies: ReactNode[]; stations: Station[] }) {
  const [running, setRunning] = useState(true);
  const [lamp, setLamp] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [reduced, setReduced] = useState(false);
  const belt = useRef<HTMLDivElement>(null);
  const dialogs = useRef(new Map<string, HTMLDialogElement>());
  const opener = useRef<HTMLElement | null>(null);
  const offset = useRef(0);
  const cell = useRef(240);
  const drag = useRef<{ id: number; start: number; offset: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
  const station = (id: string, target: HTMLElement) => {
    opener.current = target;
    setActive(id);
  };

  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    const sync = () => setActive(location.pathname.match(/^\/work\/([^/]+)\/?$/)?.[1] ?? null);
    update();
    query.addEventListener('change', update);
    window.addEventListener('popstate', sync);
    return () => {
      query.removeEventListener('change', update);
      window.removeEventListener('popstate', sync);
    };
  }, []);

  useEffect(() => {
    for (const [id, dialog] of dialogs.current) {
      if (id === active && !dialog.open) {
        dialog.showModal();
        dialog.scrollTop = 0;
      } else if (id !== active && dialog.open) dialog.close();
    }
    document.body.classList.toggle('dialog-open', Boolean(active));
    if (!active) opener.current?.focus({ preventScroll: true });
    return () => document.body.classList.remove('dialog-open');
  }, [active]);

  function paint() {
    const track = belt.current;
    if (!track) return;
    const pitch = cell.current;
    const cycle = pitch * projects.length;
    const origin = 18;
    const wrap = (track.firstElementChild as HTMLElement | null)?.offsetWidth ?? 160;
    for (const [i, child] of Array.from(track.children).entries()) {
      const x = ((i * pitch + offset.current + wrap + origin) % cycle + cycle) % cycle - wrap - origin;
      (child as HTMLElement).style.setProperty('--cargo-x', (origin + x) + 'px');
    }
    track.parentElement?.style.setProperty('--belt-offset', offset.current % 30 + 'px');
  }

  useEffect(() => {
    const track = belt.current;
    if (!track) return;
    const observer = new ResizeObserver(() => {
      const cargoWidth = (track.firstElementChild as HTMLElement | null)?.offsetWidth ?? 160;
      const next = Math.max(188, (track.clientWidth + cargoWidth + 12) / projects.length);
      offset.current *= next / cell.current;
      cell.current = next;
      paint();
    });
    observer.observe(track);
    return () => observer.disconnect();
    // The conveyor has a fixed inventory for this page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects.length]);

  useEffect(() => {
    if (!running || hovered || active || reduced) return;
    let frame: number;
    let last = 0;
    function tick(time: number) {
      if (last && !drag.current) {
        offset.current -= Math.min(34, time - last) * .028;
        paint();
      }
      last = time;
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // paint reads only the conveyor refs and inventory count.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, hovered, active, reduced, projects.length]);

  function step(direction: number) {
    setRunning(false);
    offset.current = Math.round(offset.current / cell.current + direction) * cell.current;
    paint();
  }

  function close() {
    if (history.state?.workshopCargo && projects.some(project => project.slug === active)) history.back();
    else setActive(null);
  }

  return <main id="main" className={'workshop ' + (lamp ? 'lamp-on' : 'lamp-off')}>
    <header className="room-header">
      <Link className="room-brand" href="/"><span><Cable size={18} /></span> Navjot Jaswal</Link>
      <p>Engineering <b>×</b> Product</p>
      <button type="button" onClick={event => station('contact', event.currentTarget)}><Mail size={16} /> Get in touch</button>
    </header>

    <div className="room">
      <div className="room-wall">
        <div className="wall-socket" aria-hidden="true" />
        <aside className="pegboard" aria-label="Workshop stations">
          <div className="pegboard-title"><span>Workshop stations</span><span aria-hidden="true">✳</span></div>
          <div className="tools">{tools.map(({ id, label, Icon }) =>
            <button key={id} type="button" onClick={event => station(id, event.currentTarget)}><Icon size={25} strokeWidth={1.5} /><span>{label}</span></button>
          )}</div>
        </aside>
        <div className="room-sign">
          <div className="sign-top"><span /> Navjot Jaswal’s workshop <span /></div>
          <h1>The Idea<br /><em>Factory.</em></h1>
          <p>Where I turn “what if?” into “what’s next.”</p>
        </div>
        <div className="room-fixtures">
          <button className="desk-lamp" type="button" aria-label="Workshop lamp" aria-pressed={lamp} onClick={() => setLamp(!lamp)}><LampDesk size={57} strokeWidth={1.25} /><span>{lamp ? 'Lights on' : 'Lights off'}</span></button>
          <button className="wall-note" type="button" onClick={event => station('playground', event.currentTarget)}><Sparkles size={19} /> <span>Pull an<br />idea.</span><ArrowDownLeft size={19} /></button>
        </div>
      </div>

      <section className="conveyor" aria-label="Project conveyor">
        <div className="belt-heading"><h2><PackageOpen size={18} /> Project conveyor</h2><p>Drag the belt or select a prototype to inspect it.</p></div>
        <div className="belt-window"
          onPointerEnter={event => { if (event.pointerType === 'mouse') setHovered(true); }}
          onPointerLeave={() => { setHovered(false); if (!drag.current?.moved) drag.current = null; }}
          onPointerDown={event => {
            if (event.button !== 0) return;
            suppressClick.current = false;
            drag.current = { id: event.pointerId, start: event.clientX, offset: offset.current, moved: false };
          }}
          onPointerMove={event => {
            const gesture = drag.current;
            if (!gesture || gesture.id !== event.pointerId) return;
            const distance = event.clientX - gesture.start;
            if (!gesture.moved && Math.abs(distance) < 7) return;
            if (!gesture.moved) {
              gesture.moved = true;
              setRunning(false);
              event.currentTarget.setPointerCapture(event.pointerId);
            }
            offset.current = gesture.offset + distance;
            paint();
          }}
          onPointerUp={() => {
            suppressClick.current = Boolean(drag.current?.moved);
            drag.current = null;
          }}
          onPointerCancel={() => { drag.current = null; suppressClick.current = false; }}
          onClickCapture={event => {
            if (!suppressClick.current) return;
            suppressClick.current = false;
            event.preventDefault();
            event.stopPropagation();
          }}>
          <div className="cargo-track" ref={belt}>
            {projects.map((project, i) => {
              const Icon = cargoIcons[i];
              return <a key={project.slug} className={'cargo ' + project.style} style={{ '--cargo-index': i } as React.CSSProperties}
                href={'/work/' + project.slug + '/'}
                onFocus={event => {
                  if (!event.currentTarget.matches(':focus-visible')) return;
                  setRunning(false);
                  const position = event.currentTarget.getBoundingClientRect();
                  const bounds = belt.current?.getBoundingClientRect();
                  if (bounds && (position.left < bounds.left || position.right > bounds.right)) {
                    offset.current = -i * cell.current;
                    paint();
                  }
                }}
                onClick={event => {
                  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
                  event.preventDefault();
                  history.pushState({ ...history.state, workshopCargo: true }, '', event.currentTarget.href);
                  station(project.slug, event.currentTarget);
                }}>
                <div className="cargo-object">
                  <span className="cargo-rivet" /><span className="cargo-hardware" aria-hidden="true"><i /><i /><i /></span><span className="cargo-model"><Icon size={42} strokeWidth={1.25} /></span>
                  <span className="cargo-noun">{cargoNouns[i]}</span>
                  <strong>{project.name}</strong>
                </div>
                <div className="cargo-pallet" aria-hidden="true" />
              </a>;
            })}
          </div>
          <div className="belt-tread" aria-hidden="true" />
          <div className="belt-chassis" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
        </div>
        <div className="belt-footer">
          <div className="belt-status"><span className={running && !reduced ? 'motor-live' : ''} /><Gauge size={17} /> {running && !reduced ? 'Motor on' : 'Motor stopped'}</div>
          <div className="belt-buttons">
            <button type="button" aria-label="Move belt left" onClick={() => step(-1)}><ArrowLeft size={20} /></button>
            <button type="button" className="motor-button" aria-label={running && !reduced ? 'Pause conveyor' : 'Start conveyor'} disabled={reduced} onClick={() => setRunning(!running)}>{running && !reduced ? <Pause size={18} /> : <Play size={18} />}<span>{running && !reduced ? 'Pause' : 'Start'}</span></button>
            <button type="button" aria-label="Move belt right" onClick={() => step(1)}><ArrowRight size={20} /></button>
          </div>
          <div className="inventory-count"><Cpu size={16} /> {projects.length} prototypes</div>
        </div>
      </section>

      <noscript><div className="room-floor">{projects.map(project => <a key={project.slug} href={'/work/' + project.slug + '/'}>{project.name}</a>)}</div></noscript>
      <footer className="room-floor"><span>Toronto, Canada</span><span>Navjot Jaswal · Toronto Metropolitan University</span></footer>
    </div>

    {[...stations, ...projects.map((project, i) => ({ id: project.slug, title: project.name, content: studies[i] }))].map(({ id, title, content }) =>
      <dialog key={id} className="case-dialog workshop-dialog" aria-label={title}
        ref={node => { if (node) dialogs.current.set(id, node); else dialogs.current.delete(id); }}
        onCancel={event => { event.preventDefault(); close(); }}>
        <div className="dialog-bar"><span>{title}</span><button type="button" onClick={close}><X size={19} /> Back to workshop</button></div>
        {content}
      </dialog>
    )}
  </main>;
}
