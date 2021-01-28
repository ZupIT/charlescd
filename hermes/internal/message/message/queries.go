package message

const FindAllNotEnqueuedQuery = `
SELECT m.*
FROM messages m LEFT JOIN messages_executions_histories meh on m.id = meh.execution_id;
`
