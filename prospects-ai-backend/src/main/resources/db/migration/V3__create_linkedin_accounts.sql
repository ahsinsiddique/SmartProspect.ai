CREATE TYPE account_status AS ENUM (
  'CONNECTED', 'DISCONNECTED', 'WARMING_UP', 'SUSPENDED', 'PENDING_VERIFICATION'
);

CREATE TABLE linkedin_accounts (
  id                       UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                  UUID           NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  proxy_id                 UUID           REFERENCES proxies(id) ON DELETE SET NULL,
  linkedin_email           VARCHAR(255)   NOT NULL,
  li_at_cookie             TEXT,
  csrf_token               TEXT,
  member_id                VARCHAR(50),
  full_name                VARCHAR(255),
  headline                 TEXT,
  profile_picture_url      TEXT,
  status                   account_status NOT NULL DEFAULT 'DISCONNECTED',
  daily_connection_limit   INTEGER        NOT NULL DEFAULT 20,
  daily_message_limit      INTEGER        NOT NULL DEFAULT 50,
  connections_sent_today   INTEGER        NOT NULL DEFAULT 0,
  messages_sent_today      INTEGER        NOT NULL DEFAULT 0,
  last_synced_at           TIMESTAMPTZ,
  created_at               TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at               TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_linkedin_accounts_user ON linkedin_accounts(user_id);
CREATE INDEX idx_linkedin_accounts_status ON linkedin_accounts(status);
