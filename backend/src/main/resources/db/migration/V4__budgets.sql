CREATE TABLE IF NOT EXISTS budgets (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	category VARCHAR(120) NOT NULL,
	amount NUMERIC(12, 2) NOT NULL,
	budget_month DATE NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	modified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	CONSTRAINT uq_budgets_user_category_month UNIQUE (user_id, category, budget_month)
);

CREATE INDEX IF NOT EXISTS idx_budgets_user_month ON budgets(user_id, budget_month);
