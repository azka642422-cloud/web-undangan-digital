BEGIN;

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY,
  order_number varchar(50) UNIQUE NOT NULL,
  customer_name varchar(120) NOT NULL,
  customer_email varchar(254) NOT NULL,
  customer_phone varchar(32) NOT NULL,
  package_slug varchar(16) NOT NULL CHECK (package_slug IN ('HEMAT','REGULER','VIP')),
  template_slug varchar(80) NOT NULL,
  gross_amount integer NOT NULL CHECK (gross_amount >= 0),
  status varchar(24) NOT NULL DEFAULT 'PENDING_PAYMENT' CHECK (status IN ('DRAFT','PENDING_PAYMENT','PAID','PROCESSING','ACTIVE','EXPIRED','FAILED','CANCELLED')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY,
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
  provider varchar(24) NOT NULL DEFAULT 'MIDTRANS',
  provider_order_id varchar(50) UNIQUE NOT NULL,
  provider_transaction_id varchar(100),
  gross_amount integer NOT NULL CHECK (gross_amount >= 0),
  transaction_status varchar(32) NOT NULL DEFAULT 'pending',
  fraud_status varchar(32),
  paid_at timestamptz,
  raw_notification jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS invitations (
  id uuid PRIMARY KEY,
  order_id uuid UNIQUE NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
  slug varchar(100) UNIQUE NOT NULL,
  template_slug varchar(80) NOT NULL,
  package_slug varchar(16) NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_published boolean NOT NULL DEFAULT false,
  active_until timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_invitations_slug ON invitations(slug);

COMMIT;
