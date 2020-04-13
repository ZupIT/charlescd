--This Source Code Form is subject to the terms of the
--Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed
--with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
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