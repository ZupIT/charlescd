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
create table component
(
	id varchar(36) not null
		constraint component_pkey
			primary key,
	artifact_name varchar(150),
	artifact_version varchar(150),
	module_id varchar(36) not null
	        constraint module_id_fk
	        references module
);

--alter table build owner to villager;

