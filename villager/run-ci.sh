#!/bin/sh
#
#This Source Code Form is subject to the terms of the
#Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed
#with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
#
set -e

mvn -Dmaven.repo.local=/home/maven/.m2/repository​ -f /home/application/pom.xml clean install