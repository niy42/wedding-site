-- Live data/admin support for the wedding site.
-- Adds RSVP storage and replaces seeded gift-image placeholders with bundled assets.

CREATE TABLE IF NOT EXISTS rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL CHECK (char_length(full_name) BETWEEN 1 AND 120),
  email TEXT NOT NULL,
  phone TEXT,
  attending TEXT NOT NULL CHECK (attending IN ('yes','no')),
  guest_count INTEGER NOT NULL DEFAULT 0 CHECK (guest_count BETWEEN 0 AND 10),
  guest_names JSONB NOT NULL DEFAULT '[]'::jsonb,
  dietary_notes TEXT,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS rsvps_email_uq ON rsvps(email);
CREATE INDEX IF NOT EXISTS rsvps_attending_idx ON rsvps(attending);

UPDATE gift_categories
SET image_url = CASE id
  WHEN 'celebration' THEN '/images/gifts/celebration.jpg'
  WHEN 'honeymoon' THEN '/images/gifts/honeymoon.jpg'
  WHEN 'new-home' THEN '/images/gifts/new-home.jpg'
  WHEN 'blessing' THEN '/images/gifts/blessing.jpg'
  ELSE image_url
END,
updated_at = NOW()
WHERE id IN ('celebration', 'honeymoon', 'new-home', 'blessing');
