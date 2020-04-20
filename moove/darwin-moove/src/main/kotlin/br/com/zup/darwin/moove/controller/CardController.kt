/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.controller

import br.com.zup.darwin.commons.extension.toResourcePageRepresentation
import br.com.zup.darwin.commons.representation.CardRepresentation
import br.com.zup.darwin.commons.representation.ResourcePageRepresentation
import br.com.zup.darwin.commons.request.comment.AddCommentRequest
import br.com.zup.darwin.commons.request.member.AddMemberRequest
import br.com.zup.darwin.moove.request.card.CreateCardRequest
import br.com.zup.darwin.moove.request.card.UpdateCardRequest
import br.com.zup.darwin.moove.request.git.FindBranchParam
import br.com.zup.darwin.moove.service.CardService
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
    @ApiImplicitParam(name = "createCardRequest", value = "Create card", required = true, dataType = "CreateCardRequest")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(
        @RequestHeader("x-application-id") applicationId: String,
        @Valid @RequestBody createCardRequest: CreateCardRequest
    ): CardRepresentation =
        service.create(createCardRequest, applicationId)

    @ApiOperation(value = "Find all cards")
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    fun findAll(
        @RequestHeader("x-application-id") applicationId: String,
        pageable: Pageable
    ): ResourcePageRepresentation<CardRepresentation> =
        service.findAll(pageable, applicationId).toResourcePageRepresentation()

    @ApiOperation(value = "Find by id")
    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    fun findById(
        @RequestHeader("x-application-id") applicationId: String,
        @PathVariable id: String
    ): CardRepresentation =
        service.findById(id, applicationId)

    @ApiOperation(value = "Update card")
    @ApiImplicitParam(name = "updateCardRequest", value = "Update card", required = true, dataType = "UpdateCardRequest")
    @PutMapping("/{id}")
    fun update(
        @RequestHeader("x-application-id") applicationId: String,
        @PathVariable id: String, @Valid @RequestBody updateCardRequest: UpdateCardRequest
    ) =
        service.update(id, updateCardRequest, applicationId)

    @ApiOperation(value = "Delete by id")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(
        @RequestHeader("x-application-id") applicationId: String,
        @PathVariable id: String
    ) =
        service.delete(id, applicationId)

    @ApiOperation(value = "Add comment")
    @ApiImplicitParam(name = "addCommentRequest", value = "Add comment", required = true, dataType = "AddCommentRequest")
    @PostMapping("/{id}/comments")
    @ResponseStatus(HttpStatus.CREATED)
    fun addComment(
        @RequestHeader("x-application-id") applicationId: String,
        @PathVariable id: String, @Valid @RequestBody addCommentRequest: AddCommentRequest
    ) =
        service.addComment(id, addCommentRequest, applicationId)

    @ApiOperation(value = "Add member")
    @ApiImplicitParam(name = "addMemberRequest", value = "Add member", required = true, dataType = "AddMemberRequest")
    @PostMapping("/{id}/members")
    @ResponseStatus(HttpStatus.CREATED)
    fun addMembers(
        @RequestHeader("x-application-id") applicationId: String,
        @PathVariable id: String, @Valid @RequestBody addMemberRequest: AddMemberRequest
    ) =
        service.addMembers(id, addMemberRequest, applicationId)

    @ApiOperation(value = "Remove member")
    @DeleteMapping("/{id}/members/{memberId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun removeMember(
        @RequestHeader("x-application-id") applicationId: String,
        @PathVariable id: String, @PathVariable memberId: String
    ) {
        service.removeMember(id, memberId, applicationId)
    }

    @ApiOperation(value = "Find branches")
    @GetMapping("/branches/validate")
    @ResponseStatus(HttpStatus.OK)
    fun findBranches(
        @RequestHeader("x-application-id") applicationId: String,
        @Valid findBranchParam: FindBranchParam
    ): Map<String, String> =
        service.findBranches(findBranchParam, applicationId)

    @ApiOperation(value = "Archive branch")
    @PatchMapping("/{id}/archive")
    @ResponseStatus(HttpStatus.OK)
    fun archive(
        @RequestHeader("x-application-id") applicationId: String,
        @PathVariable id: String
    ) = service.archiveCard(id, applicationId)
}