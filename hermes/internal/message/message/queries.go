package message

const FindAllNotEnqueuedQuery = `
SELECT *
FROM messages
WHERE (last_status = '') IS NOT FALSE
   OR last_status ILIKE 'NOT_ENQUEUED';
`
