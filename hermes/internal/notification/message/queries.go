/*
 *
 *  Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

package message

const FindAllNotEnqueuedQuery = `
select *
from messages m
where (m.last_status ilike 'NOT_ENQUEUED'
	or (m.last_status = '') is true)
	and m.id in (select message_id
		from (select m.id as message_id, count(m.id) as total
			from messages M
			left join messages_executions_histories meh on M.id = meh.execution_id
			where meh.status ilike 'NOT_ENQUEUED'
				or (meh.status = '') is not false
			group by m.id) as g
	where total < ?);
`
