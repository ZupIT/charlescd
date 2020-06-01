/*
 *
 *  * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *  *
 *  * Licensed under the Apache License, Version 2.0 (the "License");
 *  * you may not use this file except in compliance with the License.
 *  * You may obtain a copy of the License at
 *  *
 *  *     http://www.apache.org/licenses/LICENSE-2.0
 *  *
 *  * Unless required by applicable law or agreed to in writing, software
 *  * distributed under the License is distributed on an "AS IS" BASIS,
 *  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  * See the License for the specific language governing permissions and
 *  * limitations under the License.
 *
 */

package io.charlescd.moove.legacy.moove.controller

import io.charlescd.moove.commons.extension.toResourcePageRepresentation
import io.charlescd.moove.commons.representation.CardRepresentation
import io.charlescd.moove.commons.representation.ResourcePageRepresentation
import io.charlescd.moove.commons.request.comment.AddCommentRequest
import io.charlescd.moove.commons.request.member.AddMemberRequest
import io.charlescd.moove.legacy.moove.request.card.CreateCardRequest
import io.charlescd.moove.legacy.moove.request.card.UpdateCardRequest
import io.charlescd.moove.legacy.moove.request.git.FindBranchParam
import io.charlescd.moove.legacy.moove.service.CardService
import io.swagger.annotations.Api
import io.swagger.annotations.ApiImplicitParam
import io.swagger.annotations.ApiOperation
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import javax.validation.Valid

@Api(value = "Card Endpoints", tags = ["Card"])
@RestController
@RequestMapping("/cards")
class CardController(private val service: CardService) {

    @ApiOperation(value = "Create card")
    @ApiImplicitParam(
        name = "createCardRequest",
        value = "Create card",
        required = true,
        dataType = "CreateCardRequest"
    )
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @Valid @RequestBody createCardRequest: CreateCardRequest
    ): CardRepresentation =
        service.create(createCardRequest, workspaceId)

    @ApiOperation(value = "Find all cards")
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    fun findAll(
        @RequestHeader("x-workspace-id") workspaceId: String,
        pageable: Pageable
    ): ResourcePageRepresentation<CardRepresentation> =
        service.findAll(pageable, workspaceId).toResourcePageRepresentation()

    @ApiOperation(value = "Find by id")
    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    fun findById(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @PathVariable id: String
    ): CardRepresentation =
        service.findById(id, workspaceId)

    @ApiOperation(value = "Update card")
    @ApiImplicitParam(
        name = "updateCardRequest",
        value = "Update card",
        required = true,
        dataType = "UpdateCardRequest"
    )
    @PutMapping("/{id}")
    fun update(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @PathVariable id: String, @Valid @RequestBody updateCardRequest: UpdateCardRequest
    ) =
        service.update(id, updateCardRequest, workspaceId)

    @ApiOperation(value = "Delete by id")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @PathVariable id: String
    ) =
        service.delete(id, workspaceId)

    @ApiOperation(value = "Add comment")
    @ApiImplicitParam(
        name = "addCommentRequest",
        value = "Add comment",
        required = true,
        dataType = "AddCommentRequest"
    )
    @PostMapping("/{id}/comments")
    @ResponseStatus(HttpStatus.CREATED)
    fun addComment(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @PathVariable id: String, @Valid @RequestBody addCommentRequest: AddCommentRequest
    ) =
        service.addComment(id, addCommentRequest, workspaceId)

    @ApiOperation(value = "Add member")
    @ApiImplicitParam(name = "addMemberRequest", value = "Add member", required = true, dataType = "AddMemberRequest")
    @PostMapping("/{id}/members")
    @ResponseStatus(HttpStatus.CREATED)
    fun addMembers(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @PathVariable id: String, @Valid @RequestBody addMemberRequest: AddMemberRequest
    ) =
        service.addMembers(id, addMemberRequest, workspaceId)

    @ApiOperation(value = "Remove member")
    @DeleteMapping("/{id}/members/{memberId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun removeMember(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @PathVariable id: String, @PathVariable memberId: String
    ) {
        service.removeMember(id, memberId, workspaceId)
    }

    @ApiOperation(value = "Find branches")
    @GetMapping("/branches/validate")
    @ResponseStatus(HttpStatus.OK)
    fun findBranches(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @Valid findBranchParam: FindBranchParam
    ): Map<String, String> =
        service.findBranches(findBranchParam, workspaceId)

    @ApiOperation(value = "Archive branch")
    @PatchMapping("/{id}/archive")
    @ResponseStatus(HttpStatus.OK)
    fun archive(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @PathVariable id: String
    ) = service.archiveCard(id, workspaceId)
}
