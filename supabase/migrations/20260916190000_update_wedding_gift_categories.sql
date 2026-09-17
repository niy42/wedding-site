-- Update wedding gift categories and targets.
-- This is a follow-up migration; do not modify the already-applied
-- initial schema migration.
-- Amounts are stored in NGN minor units (kobo).

BEGIN;

INSERT INTO gift_categories (
  id,
  title,
  description,
  image_url,
  target_amount_minor,
  currency,
  is_active
)
VALUES (
  'couple-attire',
  'The Couple''s Attire',
  'Help us prepare the outfits and finishing touches we''ll wear on our special day.',
  '/images/gifts/couple-attire.jpg',
  100000000,
  'NGN',
  TRUE
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  target_amount_minor = EXCLUDED.target_amount_minor,
  currency = EXCLUDED.currency,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- Preserve existing honeymoon contribution history.
UPDATE contributions
SET
  category_id = 'couple-attire',
  updated_at = NOW()
WHERE category_id = 'honeymoon';

DELETE FROM gift_categories
WHERE id = 'honeymoon';

UPDATE gift_categories
SET target_amount_minor = 200000000, updated_at = NOW()
WHERE id = 'celebration';

UPDATE gift_categories
SET target_amount_minor = 300000000, updated_at = NOW()
WHERE id = 'new-home';

UPDATE gift_categories
SET target_amount_minor = NULL, updated_at = NOW()
WHERE id = 'blessing';

COMMIT;
