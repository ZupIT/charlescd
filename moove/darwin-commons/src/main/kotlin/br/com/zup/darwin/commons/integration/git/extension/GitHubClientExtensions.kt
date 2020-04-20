/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.commons.integration.git.extension

import com.google.gson.JsonObject
import org.eclipse.egit.github.core.RepositoryId
import org.eclipse.egit.github.core.client.GitHubRequest
import org.eclipse.egit.github.core.service.RepositoryService

fun RepositoryService.mergeBranches(
    repository: String,
    baseBranch: String,
    headBranch: String,
    commitMessage: String
) {
    this.client.post<JsonObject>(
        "/repos/${RepositoryId.createFromId(repository)}/merges",
        mapOf(
            "base" to baseBranch,
            "head" to headBranch,
            "commit_message" to commitMessage
        )
        , JsonObject::class.java
    )
}

fun RepositoryService.createRelease(
    repository: String,
    sourceBranch: String,
    releaseName: String,
    releaseDescription: String,
    draft: Boolean = false,
    preRelease: Boolean = false
): JsonObject =
    this.client.post(
        "/repos/${RepositoryId.createFromId(repository)}/releases",
        mapOf(
            "tag_name" to releaseName,
            "name" to releaseName,
            "target_commitish" to sourceBranch,
            "body" to releaseDescription,
            "draft" to draft,
            "prerelease" to preRelease

        ), JsonObject::class.java
    )


fun RepositoryService.findReleaseByTagName(
    repository: String,
    releaseName: String
): JsonObject =
    this.client.get(GitHubRequest().apply {
        uri = "/repos/${RepositoryId.createFromId(repository)}/releases/tags/$releaseName"
    }
        .apply { type = JsonObject::class.java }).body as JsonObject


fun RepositoryService.deleteBranch(
    repository: String,
    branchName: String
) {
    this.client.delete("/repos/${RepositoryId.createFromId(repository)}/git/refs/heads/$branchName")
}