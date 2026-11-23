'use client';

import { useRef, useState } from 'react';
import { BriefcaseBusiness, Camera, Copy, Mail } from 'lucide-react';
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
  const [copied, setCopied] = useState(false);
  const [pull, setPull] = useState(0);
  const leverStart = useRef<number | null>(null);
  function dispense() {
    setPrompt(value => (value + 1) % prompts.length);
    setCopied(false);
    setPull(value => value + 1);
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(prompts[prompt]);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }
  return <section className="lever-machine" aria-label="Idea Machine">
    <div className="machine-housing">
      <div className="machine-face">
        <span className="machine-name">Idea Machine</span>
        <div className="machine-display"><i aria-hidden="true" /> <span>{prompt < 0 ? 'Ready to dispense' : 'Prompt dispensed'}</span></div>
        <div className="machine-slot" aria-hidden="true" />
      </div>
      <button type="button" className="machine-lever" onClick={dispense} aria-label="Pull the lever to dispense an idea"
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
    <div className="machine-output" aria-live="polite">{prompt >= 0 && <div className="paper-output" key={pull}><p>{prompts[prompt]}</p><button type="button" onClick={copy} aria-label={copied ? 'Prompt copied' : 'Copy prompt'}>{copied ? 'Copied' : <Copy size={14} />}</button></div>}</div>
  </section>;
}

export function ContactLinks() {
  return <div className="workshop-contact-links">
    <a href={'mailto:' + contact.email}><Mail size={19} /><span><strong>Email</strong>{contact.email}</span></a>
    <a href={contact.linkedin}><BriefcaseBusiness size={19} /><span><strong>LinkedIn</strong>Navjot Jaswal</span></a>
    <a href="https://www.instagram.com/navjotjaswal_/"><Camera size={19} /><span><strong>Instagram</strong>@navjotjaswal_</span></a>
  </div>;
}
