'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { contact } from '../content/portfolio';

const draftKey = 'idea-factory-notebook-draft';

export function NotebookGuestbook({ ready }: { ready: boolean }) {
  const [draft, setDraft] = useState('');
  const [selection, setSelection] = useState(0);
  const editor = useRef<HTMLTextAreaElement>(null);
  const mirror = useRef<HTMLDivElement>(null);
  const marker = useRef<HTMLSpanElement>(null);
  const pen = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try { setDraft(localStorage.getItem(draftKey) ?? ''); } catch {}
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (ready) editor.current?.focus({ preventScroll: true });
  }, [ready]);

  useLayoutEffect(() => {
    function placePen() {
      const field = editor.current;
      const paper = mirror.current;
      const tip = marker.current;
      if (!field || !paper || !tip) return;
      const editorBox = paper.getBoundingClientRect();
      const caret = tip.getBoundingClientRect();
      pen.current?.style.setProperty('--pen-x', caret.left - editorBox.left - field.scrollLeft + 'px');
      pen.current?.style.setProperty('--pen-y', caret.top - editorBox.top - field.scrollTop + 14 + 'px');
    }
    placePen();
    editor.current?.addEventListener('scroll', placePen);
    const field = editor.current;
    const observer = new ResizeObserver(placePen);
    if (field) observer.observe(field);
    return () => { field?.removeEventListener('scroll', placePen); observer.disconnect(); };
  }, [draft, selection, ready]);

  function update(value: string) {
    setDraft(value);
    try { localStorage.setItem(draftKey, value); } catch {}
  }

  const email = 'mailto:' + contact.email + '?subject=Workshop%20notebook&body=' + encodeURIComponent(draft);
  return <div className="guest-page">
    <h2>Leave a note.</h2>
    <div className="guest-writing">
      <textarea ref={editor} rows={3} maxLength={400} aria-label="Write a note for Navjot" placeholder="Write something here…" value={draft}
        onChange={event => { setSelection(event.currentTarget.selectionStart); update(event.currentTarget.value); }}
        onSelect={event => setSelection(event.currentTarget.selectionDirection === 'backward' ? event.currentTarget.selectionStart : event.currentTarget.selectionEnd)} />
      <div className="guest-mirror" ref={mirror} aria-hidden="true">{draft.slice(0, selection)}<span ref={marker} />{draft.slice(selection)}{'\u200b'}</div>
      {ready && <span className="writing-pen" ref={pen} aria-hidden="true" />}
    </div>
    <p>Your draft stays on this device.</p>
    {draft.trim() && <a href={email}>Send note by email</a>}
  </div>;
}
