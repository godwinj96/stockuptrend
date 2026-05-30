CREATE TABLE IF NOT EXISTS deposit_settings (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO deposit_settings (key, value) VALUES
  ('bank_name',           'Barclays Bank PLC'),
  ('bank_account_name',   'StockUptrend Ltd Client Funds'),
  ('bank_sort_code',      '20-00-00'),
  ('bank_iban',           'GB29NWBK60161331926819'),
  ('bank_swift',          'BARCGB22'),
  ('crypto_btc_address',  ''),
  ('crypto_eth_address',  ''),
  ('crypto_bnb_address',  ''),
  ('crypto_usdt_address', '')
ON CONFLICT (key) DO NOTHING;

ALTER TABLE deposit_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read deposit settings"
  ON deposit_settings FOR SELECT TO authenticated USING (true);
