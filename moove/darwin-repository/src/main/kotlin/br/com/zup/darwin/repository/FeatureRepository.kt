/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.repository

import br.com.zup.darwin.entity.Feature
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import java.util.*

interface FeatureRepository : JpaRepository<Feature, String> {

    fun findAllByApplicationId(applicationId: String, pageable: Pageable): Page<Feature>

    fun findByIdAndApplicationId(id:String,applicationId: String) : Optional<Feature>

    @Modifying
    @Query(value = "delete from features_modules where feature_id = :featureId and application_id = :applicationId", nativeQuery = true)
    fun deleteModulesRelationship(featureId: String, applicationId: String)

}