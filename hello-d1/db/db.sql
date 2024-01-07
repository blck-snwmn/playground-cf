DROP TABLE IF EXISTS memos;
CREATE TABLE memos (
  id INTEGER PRIMARY KEY,
  content TEXT,
  user TEXT,
  tag TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO memos (content, user, tag)
VALUES ('Create agenda for today''s meeting', 'John', 'meeting');

INSERT INTO memos (content, user, tag)
VALUES ('Summarize investigation results from yesterday''s issue', 'Jane', 'investigation');

INSERT INTO memos (content, user, tag)
VALUES ('Reply to customer''s inquiry', 'Bob', 'customer');
