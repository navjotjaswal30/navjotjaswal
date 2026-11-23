CREATE TABLE guestbook_notes (
  id INTEGER PRIMARY KEY,
  request_id TEXT NOT NULL UNIQUE,
  writer_key TEXT NOT NULL,
  message TEXT NOT NULL CHECK(length(message) BETWEEN 1 AND 400),
  created_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE INDEX guestbook_writer_time ON guestbook_notes(writer_key, created_at);
