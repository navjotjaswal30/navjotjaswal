'use client';

import { useRef, useState, type PointerEvent } from 'react';
import { BriefcaseBusiness, Camera, Mail, Scissors } from 'lucide-react';
import { awards, contact, prompts } from '../content/portfolio';

export function DisplayShelf() {
  const [selected, setSelected] = useState<number | null>(null);
  return <section className="real-shelf" aria-label="Trophy shelf">
    <div className="shelf-objects">{awards.map(([number, title], i) =>
      <button key={title} className={'shelf-award award-' + i} type="button" aria-label={title} aria-pressed={selected === i} onClick={() => setSelected(selected === i ? null : i)}>
        <span>{number}</span><i aria-hidden="true" />
      </button>
    )}</div>
    <p className="shelf-label" role="status">{selected === null ? 'Pick up an award to see its inscription.' : awards[selected][2]}</p>
  </section>;
}

export function LeverMachine() {
  const [prompt, setPrompt] = useState(-1);
  const [status, setStatus] = useState<'ready' | 'dispensed' | 'copied' | 'failed'>('ready');
  const [pull, setPull] = useState(0);
  const [falling, setFalling] = useState(false);
  const lever = useRef<HTMLButtonElement>(null);
  const leverStart = useRef<number | null>(null);
  const copying = useRef(false);
  const cut = useRef<{ id: number; left: number; target: number; baseline: number } | null>(null);

  function dispense() {
    if (copying.current) return;
    setPrompt(value => (value + 1) % prompts.length);
    setStatus('dispensed');
    setFalling(false);
    setPull(value => value + 1);
  }

  async function tear(keyboard = false) {
    if (copying.current || prompt < 0 || status === 'copied') return;
    copying.current = true;
    try {
      await navigator.clipboard.writeText(prompts[prompt]);
      setStatus('copied');
      setFalling(!matchMedia('(prefers-reduced-motion: reduce)').matches);
      if (keyboard) lever.current?.focus();
    } catch {
      setStatus('failed');
    } finally {
      copying.current = false;
    }
  }

  function trackCut(event: PointerEvent<HTMLButtonElement>) {
    const gesture = cut.current;
    if (!gesture || event.pointerId !== gesture.id) return;
    const alongLine = Math.abs(event.clientY - gesture.baseline) <= 25;
    const progress = Math.max(0, Math.min(1, (event.clientX - gesture.left) / (gesture.target - gesture.left)));
    event.currentTarget.style.setProperty('--tear-progress', alongLine ? String(progress) : '0');
    return alongLine && progress >= 1;
  }

  function clearCut(event: PointerEvent<HTMLButtonElement>) {
    if (cut.current?.id !== event.pointerId) return;
    cut.current = null;
    event.currentTarget.style.removeProperty('--tear-progress');
  }

  const message = status === 'ready' ? 'Ready to dispense'
    : status === 'copied' ? 'Prompt dispensed'
    : status === 'failed' ? 'Copy unavailable — try again'
    : 'Prompt dispensed — tear to copy';
  return <section className="lever-machine" aria-label="Idea Machine">
    <div className="machine-housing">
      <div className="machine-face">
        <span className="machine-name">Idea Machine</span>
        <div className="machine-display" role="status"><i aria-hidden="true" /><span>{message}</span>{status === 'copied' && <strong>Prompt copied</strong>}</div>
        <div className="machine-slot" aria-hidden="true" />
      </div>
      <button type="button" className="machine-lever" ref={lever} onClick={dispense} aria-label="Pull the lever to dispense an idea"
        onPointerDown={event => {
          if (event.button !== 0) return;
          leverStart.current = event.clientY;
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={event => {
          if (leverStart.current === null) return;
          const degrees = Math.max(0, Math.min(75, (event.clientY - leverStart.current) * 2));
          event.currentTarget.style.setProperty('--lever-pull', degrees + 'deg');
        }}
        onLostPointerCapture={event => {
          leverStart.current = null;
          event.currentTarget.style.removeProperty('--lever-pull');
        }}>
        <span className="lever-arm" key={pull} data-pulled={pull > 0}><i /></span><span className="lever-label">Pull</span>
      </button>
    </div>
    <div className="machine-output">
      {prompt >= 0 && (status !== 'copied' || falling) && <div className="machine-receipt" key={pull} data-torn={status === 'copied'}
        onAnimationEnd={event => { if (event.animationName === 'receipt-fall') setFalling(false); }}>
        {status !== 'copied' && <button type="button" className="receipt-perforation" aria-label="Drag the scissors across the perforation to copy the prompt"
          onPointerDown={event => {
            if (event.button !== 0 || cut.current) return;
            const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
            if (event.clientX > left + width * .27) return;
            cut.current = { id: event.pointerId, left: event.clientX, target: left + width * .88, baseline: top + height / 2 };
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerMove={trackCut}
          onPointerUp={event => {
            const complete = trackCut(event);
            clearCut(event);
            if (complete) void tear();
          }}
          onLostPointerCapture={clearCut}
          onClick={event => { if (event.detail === 0) void tear(true); }}><Scissors size={19} aria-hidden="true" /></button>}
        <p>{prompts[prompt]}</p>
      </div>}
    </div>
  </section>;
}

export function ContactLinks() {
  return <div className="workshop-contact-links">
    <a href={'mailto:' + contact.email}><Mail size={19} /><span><strong>Email</strong>{contact.email}</span></a>
    <a href={contact.linkedin}><BriefcaseBusiness size={19} /><span><strong>LinkedIn</strong>Navjot Jaswal</span></a>
    <a href="https://www.instagram.com/navjotjaswal_/"><Camera size={19} /><span><strong>Instagram</strong>@navjotjaswal_</span></a>
  </div>;
}
