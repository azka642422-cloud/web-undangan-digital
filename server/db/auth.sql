BEGIN;

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY,
  email varchar(254) UNIQUE NOT NULL,
  password_hash text NOT NULL,
  display_name varchar(120) NOT NULL,
  role varchar(16) NOT NULL DEFAULT 'CUSTOMER' CHECK (role IN ('CUSTOMER','ADMIN')),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash char(64) UNIQUE NOT NULL,
  expires_at timestamptz NOT NULL,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);

ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES users(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);

CREATE TABLE IF NOT EXISTS media_uploads(
  id uuid PRIMARY KEY,
  invitation_id uuid NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  object_key varchar(255) UNIQUE NOT NULL,
  category varchar(16) NOT NULL CHECK(category IN('IMAGE','AUDIO')),
  declared_content_type varchar(100) NOT NULL,
  validated_content_type varchar(100),
  byte_size integer NOT NULL CHECK(byte_size>0),
  status varchar(24) NOT NULL CHECK(status IN('QUARANTINED','VALIDATED','PUBLISHED','REJECTED','DELETED')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_media_uploads_invitation ON media_uploads(invitation_id,created_at DESC);

COMMIT;
