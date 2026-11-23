'use client';

import { useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { notes } from '../content/portfolio';

const pages = [
  ['A little about me', 'I’m a Computer Engineering student at Toronto Metropolitan University. I like building where technology meets the way people actually do things.'],
  ...notes.slice(0, 3),
];

type Direction = -1 | 1;
type PageTurn = { from: number; direction: Direction; progress: number; released: boolean; complete: boolean; id: number };

export function MakersNotebook() {
  const [page, setPage] = useState(0);
  const [turn, setTurn] = useState<PageTurn | null>(null);
  const gesture = useRef<{ id: number; x: number; width: number; direction: Direction; progress: number; moved: boolean } | null>(null);
  const leaf = useRef<HTMLDivElement>(null);
  const sequence = useRef(0);

  function start(event: PointerEvent<HTMLButtonElement>, direction: Direction) {
    if (event.button !== 0 || gesture.current) return;
    gesture.current = { id: event.pointerId, x: event.clientX, width: leaf.current?.offsetWidth || 160, direction, progress: 0, moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
    setTurn({ from: page, direction, progress: 0, released: false, complete: false, id: ++sequence.current });
  }

  function move(event: PointerEvent<HTMLButtonElement>) {
    const drag = gesture.current;
    if (!drag || drag.id !== event.pointerId) return;
    const distance = (drag.x - event.clientX) * drag.direction;
    drag.moved ||= Math.abs(drag.x - event.clientX) > 7;
    drag.progress = Math.max(0, Math.min(1, distance / drag.width));
    setTurn(previous => previous && { ...previous, progress: drag.progress });
  }

  function finish(event: PointerEvent<HTMLButtonElement>, cancelled: boolean) {
    const drag = gesture.current;
    if (!drag || drag.id !== event.pointerId) return;
    gesture.current = null;
    const complete = !cancelled && (!drag.moved || drag.progress >= .25);
    if (complete) setPage(value => value + drag.direction);
    setTurn(previous => previous && { ...previous, released: true, complete });
  }

  function viaKeyboard(direction: Direction) {
    setTurn({ from: page, direction, progress: 0, released: true, complete: true, id: ++sequence.current });
    setPage(page + direction);
  }

  function corner(direction: Direction) {
    const unavailable = page + direction < 0 || page + direction >= pages.length;
    const draggingThisCorner = turn?.direction === direction && !turn.released;
    return <button type="button" className="page-corner" data-direction={direction}
      aria-label={direction > 0 ? 'Turn to the next notebook page' : 'Turn to the previous notebook page'}
      disabled={unavailable && !draggingThisCorner}
      onPointerDown={event => start(event, direction)}
      onPointerMove={move} onPointerUp={event => finish(event, false)} onLostPointerCapture={event => finish(event, true)}
      onClick={event => { if (event.detail === 0) viaKeyboard(direction); }} />;
  }

  const displayed = turn && !turn.released && turn.direction > 0 ? turn.from + 1 : page;
  const angle = turn ? -turn.direction * turn.progress * 165 : 0;
  const destination = turn?.complete ? -turn.direction * 165 : 0;
  return <aside className="flip-notebook" aria-labelledby="notes-title">
    <div className="notebook-spread">
      <div className="notebook-leaf notebook-left">
        <span className="zone-label">The Idea Factory</span>
        <span>{page === 0 ? <>Field notes<br />from Navjot</> : pages[page - 1][0]}</span>
        {corner(-1)}
      </div>
      <div className="notebook-leaf notebook-right" ref={leaf}>
        <p className="zone-label" id="notes-title">Maker’s Notes</p>
        <div className="notebook-copy"><h2>{pages[displayed][0]}</h2><p>{pages[displayed][1]}</p></div>
        {corner(1)}
      </div>
      {turn && <div className={'notebook-leaf turning-leaf ' + (turn.direction < 0 ? 'backward-leaf' : '')}
        key={turn.id} aria-hidden="true" data-released={turn.released} style={{ '--turn-angle': angle + 'deg', '--turn-end': destination + 'deg' } as CSSProperties}
        onAnimationEnd={() => setTurn(previous => previous?.id === turn.id ? null : previous)}>
        <p className="zone-label">Maker’s Notes</p><h2>{pages[turn.direction > 0 ? turn.from : turn.from - 1][0]}</h2><p>{pages[turn.direction > 0 ? turn.from : turn.from - 1][1]}</p>
      </div>}
    </div>
    <p className="notebook-folio" aria-live="polite">Page {page + 1} of {pages.length}</p>
  </aside>;
}

const restingLength = 44;

export function PendantLight({ side, on, toggle }: { side: 'left' | 'right'; on: boolean; toggle: () => void }) {
  const origin = useRef<{ id: number; x: number; y: number; angle: number; length: number } | null>(null);
  const [released, setReleased] = useState({ id: 0, angle: 0, length: restingLength });

  function release(event: PointerEvent<HTMLButtonElement>, activate: boolean) {
    const drag = origin.current;
    if (!drag || drag.id !== event.pointerId) return;
    origin.current = null;
    event.currentTarget.style.removeProperty('--chain-angle');
    event.currentTarget.style.removeProperty('--chain-length');
    setReleased(previous => ({ id: previous.id + 1, angle: drag.angle, length: drag.length }));
    if (activate) toggle();
  }

  return <div className={'pendant pendant-' + side + (on ? ' pendant-on' : '')}>
    <div className="pendant-cord" aria-hidden="true" /><div className="pendant-shade" aria-hidden="true" />
    <button type="button" className="pendant-pull" aria-label={side === 'left' ? 'Left pendant light' : 'Right pendant light'} aria-pressed={on}
      onClick={event => { if (event.detail === 0) { toggle(); setReleased(value => ({ id: value.id + 1, angle: 0, length: restingLength + 12 })); } }}
      onPointerDown={event => {
        if (event.button !== 0 || origin.current) return;
        origin.current = { id: event.pointerId, x: event.clientX, y: event.clientY, angle: 0, length: restingLength };
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={event => {
        const drag = origin.current;
        if (!drag || drag.id !== event.pointerId) return;
        const x = event.clientX - drag.x;
        const y = Math.max(16, restingLength + event.clientY - drag.y);
        drag.angle = -Math.atan2(x, y) * 180 / Math.PI;
        drag.length = Math.min(125, Math.hypot(x, y));
        event.currentTarget.style.setProperty('--chain-angle', drag.angle + 'deg');
        event.currentTarget.style.setProperty('--chain-length', drag.length + 'px');
      }}
      onPointerUp={event => release(event, true)}
      onLostPointerCapture={event => release(event, false)}>
      <span className="chain" data-released={released.id > 0} key={released.id} style={{
        '--release-angle': released.angle + 'deg',
        '--release-length': released.length + 'px',
      } as CSSProperties}><i /></span>
    </button>
  </div>;
}
