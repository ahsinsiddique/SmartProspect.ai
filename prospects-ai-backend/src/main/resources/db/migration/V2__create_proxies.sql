CREATE TYPE proxy_type AS ENUM ('RESIDENTIAL', 'DATACENTER', 'MOBILE');

CREATE TABLE proxies (
  id           UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  label        VARCHAR(100),
  host         VARCHAR(255) NOT NULL,
  port         INTEGER     NOT NULL,
  username     VARCHAR(255),
  password_enc TEXT,
  proxy_type   proxy_type  NOT NULL DEFAULT 'RESIDENTIAL',
  is_active    BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_proxies_user ON proxies(user_id);
