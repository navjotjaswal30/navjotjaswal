'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';

type Note = { id: number; message: string };

const draftKey = 'idea-factory-notebook-draft';

export function NotebookGuestbook({ ready }: { ready: boolean }) {
  const [draft, setDraft] = useState('');
  const [selection, setSelection] = useState(0);
  const [notes, setNotes] = useState<Note[]>([]);
  const [next, setNext] = useState<number | null>(null);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const [ink, setInk] = useState<{ start: number; end: number; sequence: number } | null>(null);
  const sequence = useRef(0);
  const requestId = useRef<string | null>(null);
  const submitting = useRef(false);
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
    const abort = new AbortController();
    fetch('/api/guestbook', { signal: abort.signal }).then(async response => {
      if (!response.ok) throw new Error();
      const result = await response.json();
      setNotes(current => [...current, ...result.notes.filter((note: Note) => !current.some(saved => saved.id === note.id))]);
      setNext(result.next);
    }).catch(() => { if (!abort.signal.aborted) setStatus('Could not load signatures.'); });
    return () => abort.abort();
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
      paper.parentElement?.style.setProperty('--ink-scroll', -field.scrollTop + 'px');
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
    requestId.current = null;
    try { localStorage.setItem(draftKey, value); } catch {}
  }

  async function sign() {
    if (!draft.trim() || submitting.current) return;
    submitting.current = true;
    setBusy(true);
    setStatus('');
    requestId.current ??= crypto.randomUUID();
    try {
      const response = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: draft, requestId: requestId.current }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setNotes(current => [result.note, ...current.filter(note => note.id !== result.note.id)]);
      update('');
      setInk(null);
      setSelection(0);
      setStatus('Your note is on the sign-in sheet.');
    } catch (error) {
      setStatus(error instanceof Error && error.message ? error.message : 'Could not save your note.');
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  }

  async function loadOlder() {
    if (next === null) return;
    try {
      const response = await fetch('/api/guestbook?before=' + next);
      if (!response.ok) throw new Error();
      const result = await response.json();
      setNotes(current => [...current, ...result.notes.filter((note: Note) => !current.some(saved => saved.id === note.id))]);
      setNext(result.next);
    } catch { setStatus('Could not load older signatures.'); }
  }

  return <div className="guest-page">
    <h2>Sign the notebook.</h2>
    <div className="guest-writing">
      <textarea ref={editor} rows={3} maxLength={400} readOnly={busy} aria-label="Write a note for the shared sign-in sheet" placeholder="Write something here…" value={draft}
        onChange={event => {
          const field = event.currentTarget;
          const inserted = field.value.length - draft.length;
          setInk(inserted > 0 ? { start: field.selectionStart - inserted, end: field.selectionStart, sequence: ++sequence.current } : null);
          setSelection(field.selectionStart);
          update(field.value);
        }}
        onSelect={event => setSelection(event.currentTarget.selectionDirection === 'backward' ? event.currentTarget.selectionStart : event.currentTarget.selectionEnd)} />
      <div className="guest-ink-window" aria-hidden="true"><div className="guest-ink">{ink ? <>{draft.slice(0, ink.start)}<span key={ink.sequence}>{draft.slice(ink.start, ink.end)}</span>{draft.slice(ink.end)}</> : draft}</div></div>
      <div className="guest-mirror" ref={mirror} aria-hidden="true">{draft.slice(0, selection)}<span ref={marker} />{draft.slice(selection)}{'\u200b'}</div>
      {ready && <span className="writing-pen" ref={pen} aria-hidden="true" />}
    </div>
    <p>Signed notes are visible to other visitors.</p>
    <button className="sign-notebook" type="button" disabled={!draft.trim() || busy} onClick={sign}>{busy ? 'Signing…' : 'Sign the page'}</button>
    {status && <p role="status">{status}</p>}
    {notes.length > 0 && <ul className="guest-signatures" aria-label="Visitor notes">{notes.map(note => <li key={note.id}>{note.message}</li>)}</ul>}
    {next !== null && <button className="sign-notebook" type="button" onClick={loadOlder}>Earlier notes</button>}
  </div>;
}
