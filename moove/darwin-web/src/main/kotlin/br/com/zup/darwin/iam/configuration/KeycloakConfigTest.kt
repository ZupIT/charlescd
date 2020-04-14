/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.iam.configuration

import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Import

@Import(value = [KeycloakConfig::class])
@Configuration
class KeycloakConfigTest


