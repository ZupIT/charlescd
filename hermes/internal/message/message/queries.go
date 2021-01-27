package message

const FindAllNotEnqueuedQuery = `
SELECT m.*
FROM messages m,
     messages_executions_histories me
WHERE m.subscription_id NOT IN (
    SELECT me.execution_id
    FROM messages_executions_histories me
)
   OR (m.subscription_id = me.execution_id AND status ILIKE 'ENQUEUD_FAILED');
`
