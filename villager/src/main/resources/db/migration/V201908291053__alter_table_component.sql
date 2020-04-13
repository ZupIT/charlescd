--This Source Code Form is subject to the terms of the
--Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed
--with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
ALTER TABLE component RENAME COLUMN artifact_name TO name;
ALTER TABLE component RENAME COLUMN artifact_version TO tag_name;