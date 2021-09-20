create extension IF NOT EXISTS pgcrypto ;
ALTER TABLE system_tokens
	ADD token_hash VARCHAR(64);
	
UPDATE system_tokens
	SET token_hash = encode(sha256(pgp_sym_decrypt(token, '64971923d21a4887a3acf1ad15961bbc', 'cipher-algo=aes256')::bytea), 'hex');

ALTER TABLE system_tokens
	RENAME COLUMN token TO token_old;

ALTER TABLE system_tokens
	RENAME COLUMN token_hash TO token;