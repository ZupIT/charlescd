package io.charlescd.moove.fixture

import com.fasterxml.jackson.databind.JsonNode
import io.charlescd.moove.domain.Circle
import io.charlescd.moove.domain.MatcherTypeEnum
import io.charlescd.moove.domain.User

import java.time.LocalDateTime

class CircleFixture {

    static DEFAULT_ID = "4e806b2a-557b-45c5-91be-1e1db909bef6"
    static DEFAULT_NAME = "Women"
    static DEFAULT_REFERENCE = "f8296df6-6ae1-11ea-bc55-0242ac130003"
    static DEFAULT_WORKSPACE_ID = "44446b2a-557b-45c5-91be-1e1db9095556"

    String id
    String name
    String reference
    User author
    LocalDateTime createdAt
    MatcherTypeEnum matcherType
    JsonNode rules
    Integer importedKvRecords
    LocalDateTime importedAt
    Boolean defaultCircle
    String workspaceId
    Boolean active
    Integer percentage

    CircleFixture(String id,
                  String name,
                  String reference,
                  User author,
                  LocalDateTime createdAt,
                  MatcherTypeEnum matcherType,
                  JsonNode rules,
                  Integer importedKvRecords,
                  LocalDateTime importedAt,
                  Boolean defaultCircle,
                  String workspaceId,
                  Boolean active,
                  Integer percentage) {
        this.id = id
        this.name = name
        this.reference = reference
        this.author = author
        this.createdAt = createdAt
        this.matcherType = matcherType
        this.rules = rules
        this.importedKvRecords = importedKvRecords
        this.importedAt = importedAt
        this.defaultCircle = defaultCircle
        this.workspaceId = workspaceId
        this.active = false
        this.percentage = null
    }

    static CircleFixture create() {
        new CircleFixture(DEFAULT_ID,
                DEFAULT_NAME,
                DEFAULT_REFERENCE,
                Fixtures.user().build(),
                LocalDateTime.now(),
                MatcherTypeEnum.REGULAR,
                null,
                null,
                null,
                false,
                DEFAULT_WORKSPACE_ID,
                false,
                null)
    }

    CircleFixture withId(String id) {
        this.id = id
        return this
    }

    CircleFixture withName(String name) {
        this.name = name
        return this
    }

    CircleFixture withReference(String reference) {
        this.reference = reference
        return this
    }

    CircleFixture withAuthor(User author) {
        this.author = author
        return this
    }

    CircleFixture withCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt
        return this
    }

    CircleFixture withMatcherType(MatcherTypeEnum matcherType) {
        this.matcherType = matcherType
        return this
    }

    CircleFixture withRules(JsonNode rules) {
        this.rules = rules
        return this
    }

    CircleFixture withImportedKvRecords(Integer importedKvRecords) {
        this.importedKvRecords = importedKvRecords
        return this
    }

    CircleFixture withImportedAt(LocalDateTime importedAt) {
        this.importedAt = importedAt
        return this
    }

    CircleFixture withDefaultCircle(Boolean defaultCircle) {
        this.defaultCircle = defaultCircle
        return this
    }

    CircleFixture withWorkspaceId(String workspaceId) {
        this.workspaceId = workspaceId
        return this
    }

    CircleFixture withActive(Boolean active) {
        this.active = active
        return this
    }

    Circle build() {
        new Circle(id,
                name,
                reference,
                author,
                createdAt,
                matcherType,
                rules,
                importedKvRecords,
                importedAt,
                defaultCircle,
                workspaceId,
                active,
                percentage)
    }
}
