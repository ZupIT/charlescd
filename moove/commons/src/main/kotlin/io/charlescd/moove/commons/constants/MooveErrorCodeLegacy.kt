/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package io.charlescd.moove.commons.constants

enum class MooveErrorCodeLegacy(val key: String) {
    GIT_ERROR_BASE_NOT_FOUND("base.branch.not.found"),
    GIT_ERROR_HEAD_NOT_FOUND("head.branch.not.found"),
    GIT_ERROR_REPOSITORY_NOT_FOUND("repository.not.found"),
    GIT_ERROR_TAG_NOT_FOUND("tag.not.found"),
    GIT_ERROR_MERGE_CONFLICT("merge.conflict"),
    GIT_ERROR_MERGE_ERROR("merge.error"),
    GIT_ERROR_DUPLICATED_BRANCH("duplicated.branch"),
    GIT_ERROR_DUPLICATED_TAG("duplicated.tag"),
    GIT_ERROR_FORBIDDEN("git.forbidden"),
    GIT_INTEGRATION_ERROR("git.integration.error"),
    GIT_ERROR_BRANCH_NOT_FOUND("branch.not.found"),
    GIT_ERROR_PROVIDER_NOT_FOUND("git.provider.not.found"),
    INVALID_PAYLOAD("invalid.payload"),
    DEPLOY_INVALID_BUILD("deploy.invalid.build"),
    INVALID_AUTHORIZATION("invalid.authorization"),
    WORKSPACE_GIT_CONFIGURATION_IS_MISSING("workspace.git.configuration.is.missing"),
    METRIC_CONFIGURATION_IS_MISSING("metric.configuration.is.missing"),
    EXTERNAL_IDM_FORBIDDEN("external.idm.forbidden"),
    INVALID_REGISTRY_CONFIGURATION("invalid.registry.configuration"),
    INVALID_REGISTRY_CONNECTION("invalid.registry.connection"),
    REGISTRY_INTEGRATION_ERROR("registry.integration.error"),
    VILLAGER_REGISTRY_INTEGRATION_ERROR("villager.registry.integration.error"),
    REGISTRY_GENERAL_ERROR("registry.general.error"),
    VILLAGER_INTERNAL_INTEGRATION_ERROR("villager.unexpected.error"),
    VILLAGER_INTEGRATION_ERROR("villager.unexpected.error"),
    VILLAGER_UNEXPECTED_ERROR("villager.unexpected.error"),
    CANNOT_DELETE_DEFAULT_ROOT_USER("cannot.delete.default.root.user")
}
