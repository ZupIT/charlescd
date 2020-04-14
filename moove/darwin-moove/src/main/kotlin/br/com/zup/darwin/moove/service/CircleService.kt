/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.service

import br.com.zup.darwin.commons.constants.MooveConstants
import br.com.zup.darwin.commons.extension.*
import br.com.zup.darwin.commons.representation.*
import br.com.zup.darwin.entity.*
import br.com.zup.darwin.moove.api.request.NodeRequest
import br.com.zup.darwin.moove.request.circle.CreateCircleRequest
import br.com.zup.darwin.moove.request.circle.UpdateCircleRequest
import br.com.zup.darwin.moove.service.circle.CircleMatcher
import br.com.zup.darwin.repository.CircleRepository
import br.com.zup.darwin.repository.DeploymentRepository
import br.com.zup.darwin.repository.KeyValueRuleRepository
import br.com.zup.darwin.repository.UserRepository
import br.com.zup.exception.handler.exception.BusinessException
import br.com.zup.exception.handler.exception.NotFoundException
import br.com.zup.exception.handler.to.ErrorCode
import br.com.zup.exception.handler.to.ResourceValue
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper

import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.multipart.MultipartFile
import uk.gov.nationalarchives.csv.validator.api.java.CsvValidator
import uk.gov.nationalarchives.csv.validator.api.java.Substitution
import java.io.InputStreamReader
import java.time.LocalDateTime
import java.util.*

@Service
class CircleService(
    private val circleRepository: CircleRepository,
    private val userRepository: UserRepository,
    private val circleMatcher: CircleMatcher,
    private val keyValueRuleRepository: KeyValueRuleRepository,
    private val deploymentRepository: DeploymentRepository,
    private val objectMapper: ObjectMapper
) {
    @Transactional
    fun create(createCircleRequest: CreateCircleRequest): CircleRepresentation {
        return createCircleRequest.toEntity()
            .let { circleRepository.save(it) }
            .apply {
                circleMatcher.create(
                    name = this.name,
                    node = createCircleRequest.rules,
                    reference = this.reference!!,
                    circleId = this.id,
                    type = this.matcherType.name
                )
            }
            .let { circle -> circle.toRepresentation(circle.findActiveDeployment()) }
    }

    fun findAllWithAllDeployments(
        name: String? = null,
        active: Boolean,
        pageable: Pageable
    ): ResourcePageRepresentation<ManyDeploymentsCircleRepresentation> {
        return if (active)
            findActiveCirclesWithAllDeploymentsByName(name, pageable)
        else
            findInactiveCirclesWithoutDeploymentsByName(name, pageable)
    }

    private fun findInactiveCirclesWithoutDeploymentsByName(
            name: String?,
            pageable: Pageable
    ): ResourcePageRepresentation<ManyDeploymentsCircleRepresentation> {
        return (name?.let { this.circleRepository.findInactiveCirclesByName(name, pageable) }
            ?: this.circleRepository.findInactiveCircles(pageable)
            ).map { circle -> circle.toManyDeploymentsSimpleRepresentation() }
            .toResourcePageRepresentation()
    }

    private fun findActiveCirclesWithAllDeploymentsByName(name: String?, pageable: Pageable): ResourcePageRepresentation<ManyDeploymentsCircleRepresentation> {
        return (name?.let { this.circleRepository.findActiveCirclesByName(name, pageable) }
            ?: this.circleRepository.findActiveCircles(pageable)
            ).map{ circle -> circle.toManyDeploymentsSimpleRepresentation(circle.findActiveDeployments()) }.
            toResourcePageRepresentation()
    }


    fun findAll(
        name: String? = null,
        active: Boolean,
        pageable: Pageable
    ): ResourcePageRepresentation<SimpleCircleRepresentation> {
        return if (active)
            findActiveCirclesWithDeploymentByName(name, pageable)
         else
            findInactiveCirclesWithoutDeploymentByName(name,pageable)
    }

    private fun findActiveCirclesWithDeploymentByName(
        name: String?,
        pageable: Pageable
    ): ResourcePageRepresentation<SimpleCircleRepresentation> {
        return (name?.let { this.circleRepository.findActiveCirclesByName(name, pageable) }
            ?: this.circleRepository.findActiveCircles(pageable)
            ).map { circle -> circle.toSimpleRepresentation(circle.findActiveDeployment())
            }.toResourcePageRepresentation()
    }
    private fun findInactiveCirclesWithoutDeploymentByName(
            name: String?,
            pageable: Pageable
    ): ResourcePageRepresentation<SimpleCircleRepresentation> {
        return (name?.let { this.circleRepository.findInactiveCirclesByName(name, pageable) }
            ?: this.circleRepository.findInactiveCircles(pageable)
            ).map { circle-> circle.toSimpleRepresentation() }
            .toResourcePageRepresentation()
    }

    fun findById(id: String): CircleRepresentation {
        return circleRepository.findById(id)
            .orElseThrow { NotFoundException(ResourceValue("circle", id)) }
            .let { circle -> this.filterCurrentDeploymentArtifacts(circle)}
    }

    private fun filterCurrentDeploymentArtifacts(
        circle: Circle
    ): CircleRepresentation {

        if(circle.name == MooveConstants.MOOVE_DEFAULT_CIRCLE_NAME){
            val activeDeployments = circle.findActiveDeployments()
            val orderedDeployments = activeDeployments.sortedByDescending { it?.deployedAt }
            val lastDeployment = orderedDeployments[0]
            val currentArtifacts = this.getOnlyCurrentArtifacts(orderedDeployments);
            return circle.toDefaultRepresentation(lastDeployment,currentArtifacts)
        }
        return circle.toRepresentation(circle.findActiveDeployment());
    }



    private fun getOnlyCurrentArtifacts(orderedDeployments: List<Deployment?>): List<Artifact> {
        val  currentComponents= arrayListOf<Component>();
        return orderedDeployments.flatMap{
            deployment-> fillCurrentArtifacts(deployment,currentComponents)

        }
    }

    private fun fillCurrentArtifacts(deployment: Deployment?,currentComponents: ArrayList<Component>): List<Artifact> {
        return deployment?.build!!.artifacts.filter {
            artifact -> !currentComponents.contains(artifact.component) && currentComponents.add(artifact.component)
        }
    }


    @Transactional
    fun update(id: String, updateCircleRequest: UpdateCircleRequest): CircleRepresentation {
        return circleRepository.findById(id)
            .map { this.createUpdatedCircle(updateCircleRequest, it) }
            .map { circle ->
                val reference = UUID.randomUUID().toString()
                circleMatcher.update(
                    name = circle.name,
                    node = updateCircleRequest.rules,
                    previousReference = circle.reference!!,
                    reference = reference,
                    circleId = circle.id,
                    type = MatcherType.REGULAR.name
                )
                circleRepository.save(circle.copy(reference = reference, matcherType = MatcherType.REGULAR))
            }
            .orElseThrow { NotFoundException(ResourceValue("circle", id)) }
            .let { circle -> circle.toRepresentation(circle.findActiveDeployment()) }
    }

    fun delete(id: String) {
        return circleRepository.findById(id)
            .orElseThrow { NotFoundException(ResourceValue("circle", id)) }
            .also { this.circleRepository.delete(it) }
            .let { circleMatcher.delete(it.reference!!) }
    }

    @Transactional
    fun createWithCsv(
        name: String,
        authorId: String,
        keyName: String,
        file: MultipartFile
    ): CircleRepresentation {

        val reference = UUID.randomUUID().toString()
        val circleId = UUID.randomUUID().toString()

        val circle = this.userRepository.findById(authorId)
            .map {
                Circle(
                    id = circleId,
                    name = name,
                    reference = reference,
                    author = it,
                    createdAt = LocalDateTime.now(),
                    matcherType = MatcherType.SIMPLE_KV,
                    importedAt = LocalDateTime.now()
                )
            }
            .map { this.circleRepository.save(it) }
            .orElseThrow { NotFoundException(ResourceValue("user", authorId)) }

        createSimpleKvRules(file, keyName, circle, reference).map { circleMatcher.importCreate(it) }

        return circle.toRepresentation(circle.findActiveDeployment())
    }

    @Transactional
    fun updateWithCsv(
        id: String,
        name: String,
        keyName: String?,
        file: MultipartFile?
    ): CircleRepresentation {

        val reference = UUID.randomUUID().toString()
        val previousReference: String?

        validateFormData(keyName, file)

        val circle = this.circleRepository.findById(id)
            .apply { previousReference = this.get().reference }
            .map { it.copy(matcherType = MatcherType.SIMPLE_KV, name = name) }
            .map { this.circleRepository.save(it) }
            .orElseThrow { NotFoundException(ResourceValue("circle", id)) }

        file?.apply { circleRepository.save(circle.copy(reference = reference, importedAt = LocalDateTime.now())) }
            ?.apply {
                createSimpleKvRules(
                    file,
                    keyName!!,
                    circle,
                    reference,
                    previousReference
                ).map { circleMatcher.importUpdate(it) }
            }

        return circle.toRepresentation(circle.findActiveDeployment())
    }

    private fun Circle.findActiveDeployments(): List<Deployment?> {
        return deploymentRepository.findByCircleId(this.id)
            .filter { it.status != DeploymentStatus.NOT_DEPLOYED && it.status != DeploymentStatus.DEPLOY_FAILED }
    }

    private fun Circle.findActiveDeployment(): Deployment? {
        return deploymentRepository.findByCircleId(this.id)
            .filter { it.status != DeploymentStatus.NOT_DEPLOYED && it.status != DeploymentStatus.DEPLOY_FAILED }
            .maxBy { it.createdAt }
    }

    private fun findUserById(authorId: String): User {
        return userRepository.findById(authorId).orElseThrow { NotFoundException(ResourceValue("user", authorId)) }
    }

    private fun createUpdatedCircle(updateLabelRequest: UpdateCircleRequest, it: Circle): Circle =
        Circle(
            id = it.id,
            name = updateLabelRequest.name,
            reference = it.reference,
            author = it.author,
            createdAt = it.createdAt,
            matcherType = it.matcherType,
            rules = updateLabelRequest.rules.toJsonNode()
        )

    private fun CreateCircleRequest.toEntity(): Circle {
        return Circle(
            id = UUID.randomUUID().toString(),
            name = this.name,
            reference = UUID.randomUUID().toString(),
            author = findUserById(this.authorId),
            createdAt = LocalDateTime.now(),
            matcherType = MatcherType.REGULAR,
            rules = this.rules.toJsonNode()
        )
    }

    private fun createPage(
        it: List<KeyValueRule>,
        circle: Circle,
        previousReference: String?,
        reference: String
    ): List<NodeRequest> {
        return it.map {
            NodeRequest(
                name = circle.name,
                node = objectMapper.treeToValue(it.rule, NodeRequest.Node::class.java),
                previousReference = previousReference,
                reference = reference,
                circleId = circle.id,
                type = MatcherType.SIMPLE_KV.name
            )
        }
    }

    private fun createJsonNode(keyName: String, condition: String, value: String): JsonNode {
        return NodeRequest.Node(
            NodeRequest.Node.NodeTypeRequest.RULE,
            NodeRequest.Node.LogicalOperatorRequest.OR,
            null,
            NodeRequest.Node.RuleRequest(keyName, condition, listOf(value))
        ).toJsonNode()
    }

    private fun createPreview(nodes: List<JsonNode>): NodeRequest.Node {
        return NodeRequest.Node(
            NodeRequest.Node.NodeTypeRequest.CLAUSE,
            NodeRequest.Node.LogicalOperatorRequest.OR,
            listOf(
                NodeRequest.Node(
                    NodeRequest.Node.NodeTypeRequest.CLAUSE,
                    NodeRequest.Node.LogicalOperatorRequest.OR,
                    nodes.map { objectMapper.treeToValue(it, NodeRequest.Node::class.java) },
                    null
                )
            ),
            null
        )
    }

    private fun List<JsonNode>.createImportMetadata(circle: Circle) {
        this.apply { circleRepository.save(circle.copy(importedKvRecords = this.size)) }
            .createPreview(circle)
    }

    private fun List<JsonNode>.createPreview(circle: Circle) {
        this.takeIf { it.size >= 5 }
            ?.let {
                it.subList(0, 5).let {
                    circleRepository.save(circle.copy(rules = createPreview(it).toJsonNode()))
                }
            }
            ?: this.subList(0, this.size).let {
                circleRepository.save(circle.copy(rules = createPreview(it).toJsonNode()))
            }
    }

    private fun createSimpleKvRules(
        file: MultipartFile,
        keyName: String,
        circle: Circle,
        reference: String,
        previousReference: String? = null
    ): List<List<NodeRequest>> {
        return validateCsvFormat(InputStreamReader(file.inputStream), keyName)
            .let { InputStreamReader(file.inputStream).readLines() }
            .let { it.subList(if (it.size > 1) 1 else 0, if (it.size > 1) it.size else 0) }
            .map { createJsonNode(keyName, "EQUAL", it) }
            .apply { createImportMetadata(circle) }
            .map { KeyValueRule(UUID.randomUUID().toString(), it, circle) }
            .let { this.keyValueRuleRepository.saveAll(it) }
            .chunked(100)
            .map { createPage(it, circle, previousReference, reference) }
    }

    private fun validateCsvFormat(reader: InputStreamReader, keyName: String) {

        val schema = "version 1.0\n@totalColumns 1 ${keyName}: notEmpty"
        val schemaReader = InputStreamReader(schema.byteInputStream())
        val pathSubstitutions = ArrayList<Substitution>()

        val errorMessages = CsvValidator.validate(
            reader,
            schemaReader,
            true,
            pathSubstitutions,
            true,
            true
        )

        if (errorMessages.isNotEmpty()) {
            throw BusinessException.of(ErrorCode.PAYLOAD_INVALID)
        }
    }

    private fun validateFormData(keyName: String?, file: MultipartFile?) {
        if (keyName == null && file != null || keyName != null && file == null) {
            throw BusinessException.of(ErrorCode.PAYLOAD_INVALID)
        }
    }
}
