--This Source Code Form is subject to the terms of the
--Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed
--with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
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

