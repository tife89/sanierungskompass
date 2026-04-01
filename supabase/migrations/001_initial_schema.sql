-- ============================================================
-- Sanierungskompass – Initial Schema
-- ============================================================

-- Endkunden
CREATE TABLE IF NOT EXISTS users (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email        TEXT NOT NULL UNIQUE,
  name         TEXT,
  phone        TEXT,
  created_at   TIMESTAMPTZ DEFAULT now(),
  deleted_at   TIMESTAMPTZ
);

-- Gebäudedaten (optionale Felder als JSONB)
CREATE TABLE IF NOT EXISTS buildings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id),
  address_street  TEXT,
  address_plz     TEXT,
  address_city    TEXT,
  type            TEXT,         -- 'EFH' | 'DHH' | 'RH'
  year_built      INT,
  living_area_m2  NUMERIC,
  floors          INT,
  details         JSONB NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- Leads (Anfragen von Endkunden)
CREATE TABLE IF NOT EXISTS leads (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id),
  building_id     UUID REFERENCES buildings(id),
  status          TEXT NOT NULL DEFAULT 'submitted',
  -- 'submitted' | 'matched' | 'accepted' | 'isfp_completed'
  contact_name    TEXT,
  contact_email   TEXT NOT NULL,
  contact_phone   TEXT,
  goals           TEXT[],
  preferred_contact TEXT DEFAULT 'email',
  marketing_consent BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- Einwilligungen (DSGVO-Audit-Log)
CREATE TABLE IF NOT EXISTS consents (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id         UUID REFERENCES leads(id),
  consent_type    TEXT NOT NULL,  -- 'platform' | 'enercity_marketing'
  granted         BOOLEAN NOT NULL,
  granted_at      TIMESTAMPTZ DEFAULT now(),
  policy_version  TEXT NOT NULL DEFAULT '1.0',
  revoked_at      TIMESTAMPTZ
);

-- Indizes
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(contact_email);
CREATE INDEX IF NOT EXISTS idx_buildings_plz ON buildings(address_plz);

-- Row Level Security (RLS) aktivieren
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE consents ENABLE ROW LEVEL SECURITY;

-- Leads: jeder darf INSERT (anonyme Anfragen), aber kein SELECT ohne Auth
CREATE POLICY "Leads können erstellt werden" ON leads
  FOR INSERT WITH CHECK (true);

-- Buildings: INSERT ohne Auth erlaubt
CREATE POLICY "Buildings können erstellt werden" ON buildings
  FOR INSERT WITH CHECK (true);

-- Consents: INSERT ohne Auth erlaubt
CREATE POLICY "Consents können erstellt werden" ON consents
  FOR INSERT WITH CHECK (true);
