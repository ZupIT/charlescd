--This Source Code Form is subject to the terms of the
--Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed
--with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
create table build
(
	id varchar(36) not null
		constraint build_pkey
			primary key,
	tag_name varchar(64) not null,
	callback_url varchar(2048) not null,
	status varchar(64) not null,
	created_at timestamp not null,
	finished_at timestamp
);

--alter table build owner to villager;

