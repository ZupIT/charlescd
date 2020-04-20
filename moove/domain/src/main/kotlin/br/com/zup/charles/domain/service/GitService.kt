/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.domain.service

import br.com.zup.charles.domain.CompareResult
import br.com.zup.charles.domain.GitCredentials
import br.com.zup.charles.domain.GitServiceProvider
import java.util.*

abstract class GitService {

    val COMMIT_MESSAGE = "darwin merge branches operation"
    val RELEASE_DESCRIPTION = "darwin create release candidate operation"
    val BASE_BRANCH = "master"

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