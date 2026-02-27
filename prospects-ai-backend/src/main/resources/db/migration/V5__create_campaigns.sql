CREATE TYPE campaign_status AS ENUM (
  'DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED', 'ARCHIVED'
);

CREATE TYPE step_type AS ENUM (
  'CONNECTION_REQUEST', 'MESSAGE', 'FOLLOW_UP', 'INMAIL',
  'PROFILE_VIEW', 'LIKE_POST', 'ENDORSE_SKILL'
);

CREATE TYPE enrollment_status AS ENUM (
  'PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'OPTED_OUT'
);

CREATE TABLE campaigns (
  id                   UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id              UUID            NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  linkedin_account_id  UUID            REFERENCES linkedin_accounts(id) ON DELETE SET NULL,
  name                 VARCHAR(255)    NOT NULL,
  description          TEXT,
  status               campaign_status NOT NULL DEFAULT 'DRAFT',
  total_enrolled       INTEGER         NOT NULL DEFAULT 0,
  total_connected      INTEGER         NOT NULL DEFAULT 0,
  total_replied        INTEGER         NOT NULL DEFAULT 0,
  created_at           TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_campaigns_user   ON campaigns(user_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);

CREATE TABLE campaign_steps (
  id               UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id      UUID        NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  step_order       INTEGER     NOT NULL,
  step_type        step_type   NOT NULL,
  message_template TEXT,
  ai_personalize   BOOLEAN     NOT NULL DEFAULT FALSE,
  delay_days       INTEGER     NOT NULL DEFAULT 0,
  delay_hours      INTEGER     NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_campaign_steps_campaign ON campaign_steps(campaign_id);

CREATE TABLE campaign_enrollments (
  id                  UUID              PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id         UUID              NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  lead_id             UUID              NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  current_step_order  INTEGER           NOT NULL DEFAULT 0,
  status              enrollment_status NOT NULL DEFAULT 'PENDING',
  next_action_at      TIMESTAMPTZ,
  enrolled_at         TIMESTAMPTZ       NOT NULL DEFAULT NOW(),
  completed_at        TIMESTAMPTZ,
  UNIQUE(campaign_id, lead_id)
);

CREATE INDEX idx_enrollments_campaign    ON campaign_enrollments(campaign_id);
CREATE INDEX idx_enrollments_lead        ON campaign_enrollments(lead_id);
CREATE INDEX idx_enrollments_next_action ON campaign_enrollments(next_action_at)
  WHERE status = 'IN_PROGRESS';
