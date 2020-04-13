--This Source Code Form is subject to the terms of the
--Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed
--with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
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

