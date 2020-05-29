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

package io.charlescd.moove.domain.service

import io.charlescd.moove.domain.CompareResult
import io.charlescd.moove.domain.GitCredentials
import io.charlescd.moove.domain.GitServiceProvider
import java.util.*

abstract class GitService {

    companion object {
        const val COMMIT_MESSAGE = "Charles merge branches operation"
        const val RELEASE_DESCRIPTION = "Charles create release candidate operation"
        const val BASE_BRANCH = "master"
    }

    abstract fun mergeBranches(
        gitCredentials: GitCredentials,
        repository: String,
        baseBranch: String,
        headBranch: String
    )

    abstract fun createBranch(
        gitCredentials: GitCredentials,
        repository: String,
        branchName: String,
        baseBranchName: String = BASE_BRANCH
    ): Optional<String>


    abstract fun createRelease(
        gitCredentials: GitCredentials,
        repository: String,
        releaseName: String,
        sourceBranch: String = BASE_BRANCH,
        description: String = RELEASE_DESCRIPTION
    ): Optional<String>

    abstract fun findRelease(
        gitCredentials: GitCredentials,
        repository: String,
        releaseName: String
    ): Optional<String>

    abstract fun findBranch(
        gitCredentials: GitCredentials,
        repository: String,
        branchName: String
    ): Optional<String>

    abstract fun deleteBranch(
        gitCredentials: GitCredentials,
        repository: String,
        branchName: String
    )

    abstract fun compareBranches(
        gitCredentials: GitCredentials,
        repository: String,
        baseBranch: String,
        headBranch: String
    ): CompareResult

    abstract fun getProviderType(): GitServiceProvider

    fun containsErrorMessage(e: Exception, message: String): Boolean {
        return !e.message.isNullOrEmpty() && e.message!!.contains(message)
    }
}
