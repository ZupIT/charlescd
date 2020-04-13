--This Source Code Form is subject to the terms of the
--Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed
--with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
ALTER TABLE module
    DROP COLUMN registry;
ALTER TABLE module
    ADD COLUMN registry_configuration_id VARCHAR(36);