package io.charlescd.moove.fixture

import io.charlescd.moove.domain.User
import io.charlescd.moove.domain.UserGroup
import io.charlescd.moove.domain.Workspace
import io.charlescd.moove.domain.WorkspaceStatusEnum

import java.time.LocalDateTime

class WorkspaceFixture {

    static DEFAULT_ID = "1f0e4b27-4db8-4698-b31b-9fbcacfc080f"
    static DEFAULT_NAME = "Charles"
    static DEFAULT_REGISTRY_CONFIGURATION_ID = null
    static DEFAULT_CIRCLE_MATCHER_URL = "http://circle-matcher.com"
    static DEFAULT_GIT_CONFIGURATION_ID = null
    static DEFAULT_CD_CONFIGURATION_ID = null
    static DEFAULT_METRIC_CONFIGURATION_ID = null

    String id
    String name
    User author
    LocalDateTime createdAt
    List<UserGroup> userGroups
    WorkspaceStatusEnum status
    String registryConfigurationId
    String circleMatcherUrl
    String gitConfigurationId
    String cdConfigurationId
    String metricConfigurationId

    WorkspaceFixture(String id,
                     String name,
                     User author,
                     LocalDateTime createdAt,
                     List<UserGroup> userGroups,
                     WorkspaceStatusEnum status,
                     String registryConfigurationId,
                     String circleMatcherUrl,
                     String gitConfigurationId,
                     String cdConfigurationId,
                     String metricConfigurationId) {
        this.id = id
        this.name = name
        this.author = author
        this.createdAt = createdAt
        this.userGroups = userGroups
        this.status = status
        this.registryConfigurationId = registryConfigurationId
        this.circleMatcherUrl = circleMatcherUrl
        this.gitConfigurationId = gitConfigurationId
        this.cdConfigurationId = cdConfigurationId
        this.metricConfigurationId = metricConfigurationId
    }

    static WorkspaceFixture create() {
        new WorkspaceFixture(DEFAULT_ID,
                DEFAULT_NAME,
                Fixtures.user().build(),
                LocalDateTime.now(),
                [],
                WorkspaceStatusEnum.COMPLETE,
                DEFAULT_REGISTRY_CONFIGURATION_ID,
                DEFAULT_CIRCLE_MATCHER_URL,
                DEFAULT_GIT_CONFIGURATION_ID,
                DEFAULT_CD_CONFIGURATION_ID,
                DEFAULT_METRIC_CONFIGURATION_ID)
    }

    WorkspaceFixture withId(String id) {
        this.id = id
        return this
    }

    WorkspaceFixture withName(String name) {
        this.name = name
        return this
    }

    WorkspaceFixture withAuthor(User author) {
        this.author = author
        return this
    }

    WorkspaceFixture withCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt
        return this
    }

    WorkspaceFixture withUserGroups(UserGroup... userGroups) {
        this.userGroups = userGroups
        return this
    }

    WorkspaceFixture withStatus(WorkspaceStatusEnum status) {
        this.status = status
        return this
    }

    WorkspaceFixture withRegistryConfigurationId(String registryConfigurationId) {
        this.registryConfigurationId = registryConfigurationId
        return this
    }

    WorkspaceFixture withCircleMatcherUrl(String circleMatcherUrl) {
        this.circleMatcherUrl = circleMatcherUrl
        return this
    }

    WorkspaceFixture withGitConfigurationId(String gitConfigurationId) {
        this.gitConfigurationId = gitConfigurationId
        return this
    }

    WorkspaceFixture withCdConfigurationId(String cdConfigurationId) {
        this.cdConfigurationId = cdConfigurationId
        return this
    }

    WorkspaceFixture withMetricConfigurationId(String metricConfigurationId) {
        this.metricConfigurationId = metricConfigurationId
        return this
    }

    Workspace build() {
        new Workspace(id,
                name,
                author,
                createdAt,
                userGroups,
                status,
                registryConfigurationId,
                circleMatcherUrl,
                gitConfigurationId,
                cdConfigurationId,
                metricConfigurationId)
    }
}
