package io.charlescd.moove.fixture

import io.charlescd.moove.domain.User
import io.charlescd.moove.domain.WorkspacePermissions

import java.time.LocalDateTime

class UserFixture {

    static DEFAULT_ID = "4e806b2a-557b-45c5-91be-1e1db909bef6"
    static DEFAULT_NAME = "User name"
    static DEFAULT_EMAIL = "user@email.com"
    static DEFAULT_PHOTO = "user.photo.png"

    String id
    String name
    String email
    String photoUrl
    List<WorkspacePermissions> workspaces
    Boolean root
    LocalDateTime createdAt

    UserFixture(String id,
                String name,
                String email,
                String photoUrl,
                List<WorkspacePermissions> workspaces,
                Boolean root,
                LocalDateTime createdAt) {
        this.id = id
        this.name = name
        this.email = email
        this.photoUrl = photoUrl
        this.workspaces = workspaces
        this.root = root
        this.createdAt = createdAt
    }

    static UserFixture create() {
        new UserFixture(DEFAULT_ID,
                DEFAULT_NAME,
                DEFAULT_EMAIL,
                DEFAULT_PHOTO,
                [],
                false,
                LocalDateTime.now())
    }

    UserFixture withId(String id) {
        this.id = id
        return this
    }

    UserFixture withName(String name) {
        this.name = name
        return this
    }

    UserFixture withEmail(String email) {
        this.email = email
        return this
    }

    UserFixture withPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl
        return this
    }

    UserFixture withWorkspaces(WorkspacePermissions... workspaces) {
        this.workspaces = workspaces
        return this
    }

    UserFixture withRoot(boolean root) {
        this.root = root
        return this
    }

    UserFixture withCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt
        return this
    }

    User build() {
        new User(id, name, email, photoUrl, workspaces, root, createdAt)
    }
}
