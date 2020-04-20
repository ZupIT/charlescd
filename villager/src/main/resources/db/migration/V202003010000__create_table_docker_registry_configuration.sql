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
CREATE EXTENSION IF NOT EXISTS pgcrypto;
create table docker_registry_configuration
(
	id varchar(36) not null
		constraint docker_registry_configuration_pkey
			primary key,
	name varchar(60) not null,
	type varchar(10) not null,
	author_id varchar(36) not null,
	application_id varchar(36) not null,
	connection_data bytea not null,
	created_at timestamp not null
);

--alter table docker_registry_configuration owner to villager;