'use client';

import { useRef, useState, type MouseEvent } from 'react';
import { BookOpen, ChevronDown, CircuitBoard, Copy, Download, FileText, Mail, Send, Users } from 'lucide-react';
import { awards, contact, prompts } from '../content/portfolio';

type OpenStation = (id: string, target: HTMLElement) => void;

const drawers = [
  { id: 'about', title: 'Maker’s notes', object: 'Open the notebook', label: 'Navjot’s notebook', Icon: BookOpen },
  { id: 'experience', title: 'Tool cabinet', object: 'Inspect the tools', label: 'Engineering & leadership', Icon: CircuitBoard },
  { id: 'resume', title: 'Résumé', object: 'Open PDF', label: 'Navjot Jaswal · Résumé', Icon: FileText },
];

export function ToolCabinet({ open }: { open: OpenStation }) {
  const [drawer, setDrawer] = useState<string | null>(null);
  return <section className="real-cabinet" aria-label="Workshop cabinet">
    <header><span>Workshop cabinet</span><span aria-hidden="true">✳</span></header>
    {drawers.map(({ id, title, object, label, Icon }) => {
      const expanded = drawer === id;
      const toggle = () => setDrawer(expanded ? null : id);
      return <div className={'cabinet-drawer ' + (expanded ? 'drawer-open' : '')} key={id}>
        <div className="drawer-interior" id={'drawer-' + id} inert={!expanded}>
          <div className="drawer-inner"><div className="drawer-object"><Icon size={20} strokeWidth={1.5} /><span>{label}</span></div>
            {id === 'resume' ? <div className="drawer-links"><a href="/resume.pdf" target="_blank" rel="noreferrer">{object}</a><a href="/resume.pdf" download="Navjot-Jaswal-Resume.pdf" aria-label="Download résumé"><Download size={16} /></a></div>
              : id === 'experience' ? <div className="drawer-tools">
                <button type="button" onClick={event => open('technology', event.currentTarget)}><CircuitBoard size={20} /> Circuit board</button>
                <button type="button" onClick={event => open('communities', event.currentTarget)}><Users size={20} /> Team roster</button>
              </div> : <button type="button" className="drawer-action" onClick={event => open(id, event.currentTarget)}>{object}</button>}
          </div>
        </div>
        <button type="button" className="drawer-front" aria-expanded={expanded} aria-controls={'drawer-' + id} onClick={toggle}>
          <span>{title}</span><span className="drawer-handle"><ChevronDown size={15} /></span>
        </button>
      </div>;
    })}
    <div className="cabinet-feet" aria-hidden="true"><i /><i /></div>
  </section>;
}

export function DisplayShelf() {
  const [selected, setSelected] = useState<number | null>(null);
  return <section className="real-shelf" aria-label="Trophy shelf">
    <div className="shelf-heading">Trophy shelf</div>
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

export function MailPouch({ open }: { open: OpenStation }) {
  const [unsealed, setUnsealed] = useState(false);
  function guestbook(event: MouseEvent<HTMLButtonElement>) {
    open('contact', event.currentTarget);
  }
  return <section className={'mail-pouch ' + (unsealed ? 'mail-open' : '')} aria-label="Outgoing mail">
    <button className="mail-flap" type="button" aria-expanded={unsealed} aria-controls="mail-links" onClick={() => setUnsealed(!unsealed)}><Mail size={17} /> Outgoing mail</button>
    <div className="mail-paper" id="mail-links" inert={!unsealed}><div>
      <a href={'mailto:' + contact.email}><Send size={14} /> Email</a>
      <a href={contact.linkedin}>LinkedIn</a><a href={contact.github}>GitHub</a>
      <button type="button" onClick={guestbook}>Guestbook</button>
    </div></div>
  </section>;
}
