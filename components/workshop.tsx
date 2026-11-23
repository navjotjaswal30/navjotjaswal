'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, AudioLines, BookOpen, ClipboardList, Cpu, Gauge, PackageOpen, Pause, Play, Radar, X } from 'lucide-react';
import { DisplayShelf, LeverMachine, ContactLinks } from './workshop-fixtures';
import { type Project } from '../content/portfolio';
import { ToolChest } from './tool-chest';
import { MakersNotebook, PendantLight } from './landing-fixtures';

const cargoIcons = [BookOpen, ClipboardList, AudioLines, Radar];
const cargoNouns = ['Research dossier', 'Academic assistant', 'Lecture companion', 'Dispatch console'];

export function Workshop({ projects, studies, portrait }: { projects: Project[]; studies: ReactNode[]; portrait?: string }) {
  const [notebookOpen, setNotebookOpen] = useState(false);
  const [running, setRunning] = useState(true);
  const [leftLight, setLeftLight] = useState(true);
  const [rightLight, setRightLight] = useState(true);
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

  return <main id="main" className="workshop">
    <div className="room" data-left-lit={leftLight} data-right-lit={rightLight}>
      <section className={'landing-workbench' + (portrait ? ' landing-with-portrait' : '')} data-notebook-open={notebookOpen} aria-label="Introducing Navjot Jaswal">
        {portrait && <figure className="workshop-portrait"><Image src={portrait} alt="Navjot Jaswal" width={1125} height={1210} unoptimized priority /></figure>}
        <div className="landing-sign">
          <h1>Navjot <em>Jaswal</em></h1>
          <p className="landing-tagline">I turn “what if?” into “what’s next.”</p>
        </div>
        <div className="notebook-station">
          <button type="button" className="closed-notebook" aria-expanded={notebookOpen} aria-controls="landing-notebook" hidden={notebookOpen}
            onClick={() => {
              setNotebookOpen(true);
              requestAnimationFrame(() => document.getElementById('close-landing-notebook')?.focus({ preventScroll: true }));
            }} id="open-landing-notebook">
            <span className="closed-notebook-title">Maker’s<br />Notes</span><span className="closed-notebook-action">Open notebook</span>
          </button>
          <div id="landing-notebook" className="notebook-open-spread" hidden={!notebookOpen}>
            <MakersNotebook />
            <button type="button" id="close-landing-notebook" className="close-notebook" onClick={() => {
              setNotebookOpen(false);
              requestAnimationFrame(() => document.getElementById('open-landing-notebook')?.focus({ preventScroll: true }));
            }}>Close notebook</button>
          </div>
        </div>
        <PendantLight side="left" on={leftLight} toggle={() => setLeftLight(value => !value)} />
        <PendantLight side="right" on={rightLight} toggle={() => setRightLight(value => !value)} />
      </section>

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

      <ToolChest />
      <section className="workshop-zone award-zone" aria-labelledby="awards-title">
        <div className="zone-heading"><div><p className="zone-label">Awards & recognition</p><h2 id="awards-title">Trophy shelf.</h2></div></div>
        <DisplayShelf />
      </section>
      <section className="workshop-zone idea-zone" aria-labelledby="machine-title">
        <div className="zone-heading"><div><p className="zone-label">Workshop playground</p><h2 id="machine-title">Idea Machine.</h2><p>Pull the lever for a question about products, people, or everyday problems.</p></div></div>
        <LeverMachine />
      </section>
      <section className="workshop-zone mail-zone" aria-labelledby="contact-title"><h2 id="contact-title">Get in touch.</h2><ContactLinks /></section>

      <noscript><div className="room-floor">{projects.map(project => <a key={project.slug} href={'/work/' + project.slug + '/'}>{project.name}</a>)}</div></noscript>
      <footer className="room-floor"><span>Toronto, Canada</span><span>Navjot Jaswal · Toronto Metropolitan University</span></footer>
    </div>

    {projects.map(({ slug: id, name: title }, i) =>
      <dialog key={id} className="case-dialog workshop-dialog" aria-label={title}
        ref={node => { if (node) dialogs.current.set(id, node); else dialogs.current.delete(id); }}
        onCancel={event => { event.preventDefault(); close(); }}>
        <div className="dialog-bar"><span>{title}</span><button type="button" onClick={close}><X size={19} /> Back to workshop</button></div>
        {studies[i]}
      </dialog>
    )}
  </main>;
}
