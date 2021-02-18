package message

const FindAllNotEnqueuedAndDeliveredFailQuery = `
SELECT *
FROM messages
WHERE id IN (SELECT message_id
             FROM (SELECT m.id as message_id, count(m.id) as total
                   FROM messages M
                            LEFT JOIN messages_executions_histories meh on M.id = meh.execution_id
                   WHERE m.last_status ilike 'NOT_ENQUEUED'
                      OR (m.last_status = '') IS NOT FALSE
					  OR m.last_status ilike 'DELIVERED_FAILED'
                   GROUP BY m.id) as g
             where total < ?);
`
