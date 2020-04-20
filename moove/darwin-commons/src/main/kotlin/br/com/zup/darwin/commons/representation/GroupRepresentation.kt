/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.commons.representation

data class GroupsRepresentation(
        val groups:List<GroupRepresentation>
)

data class GroupRepresentation(
    val id: String,
    val name: String,
    val roles: List<RoleRepresentation>,
    val membersCount: Int
)

data class GroupMembersRepresentation(
    val id: String,
    val name: String,
    val roles: List<RoleRepresentation>,
    val members: List<UserRepresentation>
)