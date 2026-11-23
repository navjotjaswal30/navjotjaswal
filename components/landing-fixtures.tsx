'use client';

import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { notes } from '../content/portfolio';

const pages = [
  ['A little about me', 'I’m a Computer Engineering student at Toronto Metropolitan University. I like building where technology meets the way people actually do things.'],
  ...notes.slice(0, 3),
];

export function MakersNotebook() {
  const [page, setPage] = useState(0);
  const [turn, setTurn] = useState<{ from: number; direction: number; id: number } | null>(null);

  function go(direction: number) {
    const next = page + direction;
    if (next < 0 || next >= pages.length) return;
    setTurn({ from: page, direction, id: (turn?.id ?? 0) + 1 });
    setPage(next);
  }

  return <aside className="flip-notebook" aria-labelledby="notes-title">
    <div className="notebook-spread">
      <div className="notebook-leaf notebook-left" aria-hidden="true">
        <span className="zone-label">The Idea Factory</span>
        <span>Field notes<br />from Navjot</span>
      </div>
      <div className="notebook-leaf notebook-right">
        <p className="zone-label" id="notes-title">Maker’s Notes</p>
        <div className="notebook-copy" aria-live="polite"><h2>{pages[page][0]}</h2><p>{pages[page][1]}</p></div>
      </div>
      {turn && <div className={'notebook-leaf turning-leaf ' + (turn.direction < 0 ? 'turn-back' : '')} key={turn.id} aria-hidden="true" onAnimationEnd={() => setTurn(null)}>
        <p className="zone-label">Maker’s Notes</p><h2>{pages[turn.from][0]}</h2><p>{pages[turn.from][1]}</p>
      </div>}
    </div>
    <div className="notebook-controls">
      <button type="button" aria-label="Previous notebook page" aria-disabled={page === 0} onClick={() => go(-1)}><ArrowLeft size={18} /></button>
      <span>Page {page + 1} of {pages.length}</span>
      <button type="button" aria-label="Next notebook page" aria-disabled={page === pages.length - 1} onClick={() => go(1)}><ArrowRight size={18} /></button>
    </div>
  </aside>;
}

export function PendantLight({ side, on, toggle }: { side: 'left' | 'right'; on: boolean; toggle: () => void }) {
  const origin = useRef<number | null>(null);
  const [released, setReleased] = useState(0);

  function pull() {
    toggle();
    setReleased(value => value + 1);
  }

  return <div className={'pendant pendant-' + side + (on ? ' pendant-on' : '')}>
    <div className="pendant-cord" aria-hidden="true" /><div className="pendant-shade" aria-hidden="true" />
    <button type="button" className="pendant-pull" aria-label={side === 'left' ? 'Left pendant light' : 'Right pendant light'} aria-pressed={on} onClick={pull}
      onPointerDown={event => {
        if (event.button !== 0) return;
        origin.current = event.clientY;
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={event => {
        if (origin.current === null) return;
        const distance = Math.max(0, Math.min(30, event.clientY - origin.current));
        event.currentTarget.style.setProperty('--chain-pull', distance + 'px');
      }}
      onLostPointerCapture={event => {
        origin.current = null;
        event.currentTarget.style.removeProperty('--chain-pull');
      }}>
      <span className="chain" data-released={released > 0} key={released}><i /></span>
    </button>
  </div>;
}
