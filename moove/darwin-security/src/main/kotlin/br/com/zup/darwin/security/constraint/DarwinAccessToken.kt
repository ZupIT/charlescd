/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.security.constraint

import org.keycloak.representations.AccessToken

class DarwinAccessToken(val applications: List<String>? = null) : AccessToken()