--
-- Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
--
-- Licensed under the Apache License, Version 2.0 (the "License");
-- you may not use this file except in compliance with the License.
-- You may obtain a copy of the License at
--
--     http://www.apache.org/licenses/LICENSE-2.0
--
-- Unless required by applicable law or agreed to in writing, software
-- distributed under the License is distributed on an "AS IS" BASIS,
-- WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
-- See the License for the specific language governing permissions and
-- limitations under the License.
--
create table module
(
	id varchar(36) not null
		constraint module_pkey
			primary key,
	external_id varchar(64) not null,
	name varchar(150) not null,
	status varchar(64) not null,
	tag_name varchar(64) not null,
	ci_job_id varchar(64),
	created_at timestamp not null,
	finished_at timestamp,
	build_id varchar(36) not null
	        constraint build_id_fk
	        references build
);

--alter table module_build_data owner to villager;

