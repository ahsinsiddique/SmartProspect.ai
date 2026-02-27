CREATE TABLE messages (
  id                   UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  enrollment_id        UUID        NOT NULL REFERENCES campaign_enrollments(id) ON DELETE CASCADE,
  step_id              UUID        REFERENCES campaign_steps(id) ON DELETE SET NULL,
  original_template    TEXT,
  personalized_content TEXT,
  sent_at              TIMESTAMPTZ,
  delivered_at         TIMESTAMPTZ,
  replied_at           TIMESTAMPTZ,
  linkedin_message_id  VARCHAR(255),
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messages_enrollment ON messages(enrollment_id);
CREATE INDEX idx_messages_step       ON messages(step_id);
