ALTER TABLE system_tokens
	DROP COLUMN token;
	
ALTER TABLE system_tokens
	RENAME COLUMN token_old TO token;