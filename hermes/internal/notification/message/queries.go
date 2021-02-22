package message

const FindAllNotEnqueuedAndDeliveredFailQuery = `
select *
from messages m
where (m.last_status ilike 'NOT_ENQUEUED'
	or m.last_status ilike 'DELIVERED_FAILED'
	or (m.last_status = '') is true)
	and m.id in (select message_id
		from (select m.id as message_id, count(m.id) as total
			from messages M
			left join messages_executions_histories meh on M.id = meh.execution_id
			where meh.status ilike 'NOT_ENQUEUED'
				or meh.status ilike 'DELIVERED_FAILED'
				or (meh.status = '') is not false
			group by m.id) as g
	where total < ?);
`
