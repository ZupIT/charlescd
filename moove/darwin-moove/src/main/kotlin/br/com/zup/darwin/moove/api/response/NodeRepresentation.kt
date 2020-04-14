/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.api.response

class NodeRepresentation(val name: String,
                         val node: Node,
                         val id: String) {

    class Node(val type: String,
               val logicalOperator: String?,
               val clauses: List<Node>?,
               val content: Rule?) {

        class Rule(val key: String,
                   val condition: String,
                   val value: List<String>)
    }
}