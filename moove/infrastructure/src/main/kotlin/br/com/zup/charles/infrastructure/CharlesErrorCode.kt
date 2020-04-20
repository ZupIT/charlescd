/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.infrastructure

import br.com.zup.exception.handler.to.ErrorCode

object CharlesErrorCode {
    val GIT_ERROR_BASE_NOT_FOUND = ErrorCode("GIT_ERROR_BASE_NOT_FOUND", "base.branch.not.found")
    val GIT_ERROR_HEAD_NOT_FOUND = ErrorCode("GIT_ERROR_HEAD_NOT_FOUND", "head.branch.not.found")
    val GIT_ERROR_MERGE_CONFLICT = ErrorCode("GIT_ERROR_MERGE_CONFLICT", "merge.conflict")
    val GIT_ERROR_DUPLICATED_TAG = ErrorCode("GIT_ERROR_DUPLICATED_TAG", "duplicated.tag")
    val GIT_INTEGRATION_ERROR = ErrorCode("GIT_INTEGRATION_ERROR", "git.integration.error")
    val GIT_ERROR_TAG_NOT_FOUND = ErrorCode("GIT_ERROR_TAG_NOT_FOUND", "tag.not.found")
    val GIT_ERROR_REPOSITORY_NOT_FOUND = ErrorCode("GIT_ERROR_REPOSITORY_NOT_FOUND", "repository.not.found")
    val GIT_ERROR_PROVIDER_NOT_FOUND = ErrorCode("GIT_ERROR_PROVIDER_NOT_FOUND", "git.provider.not.found")
    val GIT_CREDENTIALS_NOT_FOUND = ErrorCode("GIT_CREDENTIALS_NOT_FOUND", "git.credentials.not.found")
    val GIT_ERROR_DUPLICATED_BRANCH = ErrorCode("GIT_ERROR_DUPLICATED_BRANCH", "duplicated.branch")
    val GIT_ERROR_BRANCH_NOT_FOUND = ErrorCode("GIT_ERROR_BRANCH_NOT_FOUND", "branch.not.found")

    val DEPLOY_INVALID_BUILD = ErrorCode("DEPLOY_INVALID_BUILD", "deploy.invalid.build")
}