package message

const FindAllNotEnqueuedQuery = `
SELECT *
FROM messages
WHERE id IN (SELECT message_id
             FROM (SELECT m.id as message_id, count(m.id) as total
                   FROM messages M
                            LEFT JOIN messages_executions_histories meh on M.id = meh.execution_id
                   WHERE m.last_status ilike 'NOT_ENQUEUED'
                      OR (m.last_status = '') IS NOT FALSE
                   GROUP BY m.id) as g
             where total < ?);
`

//const FindAllNotEnqueuedQuery = `
//SELECT *
//FROM messages
//WHERE (last_status = '') IS NOT FALSE
//   OR last_status ILIKE 'NOT_ENQUEUED';
//`

