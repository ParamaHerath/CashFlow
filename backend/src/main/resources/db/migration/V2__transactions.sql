CREATE TABLE IF NOT EXISTS transactions (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	title VARCHAR(160) NOT NULL,
	amount NUMERIC(12, 2) NOT NULL,
	type VARCHAR(20) NOT NULL,
	category VARCHAR(120) NOT NULL,
	note VARCHAR(500),
	transaction_date DATE NOT NULL,
	recurring BOOLEAN NOT NULL DEFAULT FALSE,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_user_date
	ON transactions(user_id, transaction_date DESC);
