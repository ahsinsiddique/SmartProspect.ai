CREATE TYPE lead_status AS ENUM (
  'NEW', 'ENRICHED', 'CONTACTED', 'CONNECTED', 'REPLIED',
  'INTERESTED', 'NOT_INTERESTED', 'BOUNCED'
);

CREATE TYPE lead_source AS ENUM (
  'MANUAL', 'CSV_IMPORT', 'LINKEDIN_SEARCH', 'CHROME_EXTENSION', 'API'
);

CREATE TABLE lead_lists (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name        VARCHAR(255) NOT NULL,
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_lead_lists_user ON lead_lists(user_id);

CREATE TABLE leads (
  id                  UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lead_list_id        UUID        REFERENCES lead_lists(id) ON DELETE SET NULL,
  first_name          VARCHAR(100),
  last_name           VARCHAR(100),
  email               VARCHAR(255),
  linkedin_url        VARCHAR(500),
  linkedin_profile_id VARCHAR(100),
  company             VARCHAR(255),
  title               VARCHAR(255),
  industry            VARCHAR(255),
  location            VARCHAR(255),
  summary             TEXT,
  status              lead_status NOT NULL DEFAULT 'NEW',
  source              lead_source NOT NULL DEFAULT 'MANUAL',
  custom_fields       JSONB,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_leads_user     ON leads(user_id);
CREATE INDEX idx_leads_list     ON leads(lead_list_id);
CREATE INDEX idx_leads_status   ON leads(status);
CREATE INDEX idx_leads_email    ON leads(email);
CREATE INDEX idx_leads_company  ON leads(company);
CREATE INDEX idx_leads_custom   ON leads USING GIN (custom_fields);
