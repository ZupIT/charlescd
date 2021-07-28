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

package io.charlescd.moove.legacy.moove.service

import io.charlescd.moove.commons.exceptions.NotFoundExceptionLegacy
import io.charlescd.moove.legacy.moove.request.feature.CreateFeatureRequest
import io.charlescd.moove.legacy.moove.request.feature.UpdateFeatureRequest
import io.charlescd.moove.legacy.repository.FeatureRepository
import io.charlescd.moove.legacy.repository.ModuleRepository
import io.charlescd.moove.legacy.repository.entity.*
import io.mockk.every
import io.mockk.mockkClass
import io.mockk.verify
import java.time.LocalDateTime
import java.util.*
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import org.junit.Test
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.Pageable

class FeatureServiceTest {

    private val featureRepository: FeatureRepository = mockkClass(
        FeatureRepository::class
    )

    private val moduleRepository: ModuleRepository = mockkClass(
        ModuleRepository::class
    )

    private val userServiceLegacy: UserServiceLegacy = mockkClass(
        UserServiceLegacy::class
    )

    private val featureService: FeatureService = FeatureService(
        featureRepository,
        moduleRepository,
        userServiceLegacy
    )

    @Test
    fun `when trying to create a new feature, should do it successfully`() {

        every { userServiceLegacy.findByAuthorizationToken(getAuthorization()) } returns getUser()
        every { featureRepository.save(any() as Feature) } returns getFeature()
        every { moduleRepository.findAllById(any()) } returns emptyList()
        every { userServiceLegacy.findUsers(any()) } returns listOf(getUser())
        val response = featureService.create(generateCreateRequest(), getWorkspaceId(), getAuthorization())

        verify(exactly = 1) { userServiceLegacy.findByAuthorizationToken(getAuthorization()) }
        verify(exactly = 1) { featureRepository.save(any() as Feature) }

        assertNotNull(response)
    }

    @Test(expected = NotFoundExceptionLegacy::class)
    fun `when trying to create a new feature, and user not exist should do it throw NotFoundExceptionLegacy`() {

        every { userServiceLegacy.findByAuthorizationToken(getAuthorization()) } throws NotFoundExceptionLegacy("User", getUser().id)

        featureService.create(generateCreateRequest(), getWorkspaceId(), getAuthorization())

        verify(exactly = 1) { userServiceLegacy.findByAuthorizationToken(getAuthorization()) }
        verify(exactly = 0) { featureRepository.save(any() as Feature) }
    }

    @Test
    fun `when trying to get all feature from workspace, should do it return list them`() {
        val feature1 = getFeature()
        val feature2 = getFeature()
        val feature3 = getFeature()

        val pageable = mockkClass(Pageable::class)
        val features: Page<Feature> = PageImpl(listOf(feature1, feature2, feature3))

        every { userServiceLegacy.findByAuthorizationToken(getAuthorization()) } returns getUser()
        every { featureRepository.findAllByWorkspaceId(getWorkspaceId(), pageable) } returns features

        val result = featureService.findAll(getWorkspaceId(), pageable)

        verify(exactly = 1) { featureRepository.findAllByWorkspaceId(getWorkspaceId(), pageable) }

        assertEquals(3, result.totalElements)
        assertEquals(3, result.numberOfElements)
        assertEquals(3, result.content.size)
        assertEquals(1, result.totalPages)
    }

    @Test
    fun `when trying to get feature by id, should do it return them`() {

        every { userServiceLegacy.findByAuthorizationToken(getAuthorization()) } returns getUser()
        every { featureRepository.findByIdAndWorkspaceId("id", getWorkspaceId()) } returns Optional.of(getFeature())

        val result = featureService.findById("id", getWorkspaceId())

        verify(exactly = 1) { featureRepository.findByIdAndWorkspaceId("id", getWorkspaceId()) }

        assertNotNull(result)
    }

    @Test
    fun `when trying to update a feature, should do it successfully`() {

        every { featureRepository.findByIdAndWorkspaceId("id", getWorkspaceId()) } returns Optional.of(getFeature())
        every { moduleRepository.findAllById(any()) } returns emptyList()
        every { featureRepository.save(any() as Feature) } returns getFeature()

        val result = featureService.update("id", generateUpdateRequest(), getWorkspaceId())

        verify(exactly = 1) { featureRepository.findByIdAndWorkspaceId("id", getWorkspaceId()) }
        verify(exactly = 1) { featureRepository.save(any() as Feature) }

        assertNotNull(result)
    }

    @Test(expected = NotFoundExceptionLegacy::class)
    fun `when trying to update a feature not exists, should do it throw NotFoundExceptionLegacy`() {

        every { featureRepository.findByIdAndWorkspaceId("id", getWorkspaceId()) } throws NotFoundExceptionLegacy("feature", "id")

        featureService.update("id", generateUpdateRequest(), getWorkspaceId())

        verify(exactly = 1) { featureRepository.findByIdAndWorkspaceId("id", getWorkspaceId()) }
        verify(exactly = 0) { featureRepository.save(any() as Feature) }
    }

    @Test
    fun `when trying to delete a feature, should do it successfully`() {

        every { featureRepository.findByIdAndWorkspaceId("id", getWorkspaceId()) } returns Optional.of(getFeature())
        every { featureRepository.deleteModulesRelationship("id", getWorkspaceId()) } answers {}
        every { featureRepository.delete(any() as Feature) } answers {}
        every { moduleRepository.findAllById(any()) } returns emptyList()

        val result = featureService.delete("id", getWorkspaceId())

        verify(exactly = 1) { featureRepository.findByIdAndWorkspaceId("id", getWorkspaceId()) }
        verify(exactly = 1) { featureRepository.delete(any() as Feature) }

        assertNotNull(result)
    }

    @Test(expected = NotFoundExceptionLegacy::class)
    fun `when trying to delete a feature not exists, should do it throw NotFoundExceptionLegacy`() {

        every { featureRepository.findByIdAndWorkspaceId("id", getWorkspaceId()) } throws NotFoundExceptionLegacy("feature", "id")

        featureService.delete("id", getWorkspaceId())

        verify(exactly = 1) { featureRepository.findByIdAndWorkspaceId("id", getWorkspaceId()) }
        verify(exactly = 0) { featureRepository.delete(any() as Feature) }
    }

    private fun getFeature(): Feature {
        return Feature(
            id = "id",
            name = "name",
            branchName = "branchName",
            author = getUser(),
            createdAt = LocalDateTime.now(),
            modules = emptyList(),
            workspaceId = getWorkspaceId()
        )
    }

    private fun getUser(): User {
        return User("userId", "username", "email", "url", true, null, LocalDateTime.now())
    }

    private fun getAuthorization(): String {
        return "Bearer eydGF0ZSI6ImE4OTZmOGFhLTIwZDUtNDI5Ny04YzM2LTdhZWJmZ_qq3"
    }

    private fun getWorkspaceId(): String {
        return ""
    }

    private fun generateCreateRequest(): CreateFeatureRequest {
        return CreateFeatureRequest("feature", "feature-xyx", emptyList(), emptyList())
    }

    private fun generateUpdateRequest(): UpdateFeatureRequest {
        return UpdateFeatureRequest(
            "feature",
            emptyList(),
            emptyList()
        )
    }
}
