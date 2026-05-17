CREATE TABLE IF NOT EXISTS categories (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	name VARCHAR(120) NOT NULL,
	color VARCHAR(16) NOT NULL,
	icon VARCHAR(60) NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	modified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	CONSTRAINT uq_categories_user_name UNIQUE (user_id, name)
);

CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);
