/*
 *
 *  Copyright 2020, 2021 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

package utils

import (
	"github.com/ZupIT/charlescd/gate/internal/domain"
	"github.com/ZupIT/charlescd/gate/internal/service"
	"github.com/ZupIT/charlescd/gate/internal/use_case/systoken"
	"github.com/dgrijalva/jwt-go"
	"github.com/google/uuid"
	"time"
)

func GetDummySystemToken() domain.SystemToken {
	createdTime := time.Now()
	return domain.SystemToken{
		ID:          uuid.New(),
		Name:        "System Token Test",
		Revoked:     false,
		Permissions: GetDummyPermissions(),
		Workspaces:  GetDummySimpleWorkspaces(),
		Token:       "System Token Value",
		CreatedAt:   &createdTime,
		RevokedAt:   nil,
		LastUsedAt:  nil,
		Author:      "charlesadmin@admin",
	}
}

func GetDummySimpleWorkspaces() []domain.SimpleWorkspace {
	return []domain.SimpleWorkspace{
		{
			ID:   uuid.MustParse("ddb90f09-146a-4c9d-95f8-2be4841e7e7e"),
			Name: "Workspace Name",
		},
		{
			ID:   uuid.MustParse("d2f0a275-4532-4730-8d20-81d00033ee0b"),
			Name: "Workspace Name 2",
		},
	}
}

func GetDummyAuthToken() service.AuthToken {
	return service.AuthToken{
		Name:           "Charles Admin",
		Email:          "charlesadmin@admin",
		StandardClaims: jwt.StandardClaims{},
	}
}

func GetDummyRootAuthorization() string {
	return "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MTU4MjQzNjgsImlhdCI6MTYxMjU1Mzc4NiwiYXV0aF90aW1lIjoxNjEyNTM1NDE0LCJqdGkiOiI0ZTQ4YWQwNS00M2RkLTQ3NDYtYTc1YS1kYmVjZmIxMDVjNzUiLCJpc3MiOiJodHRwOi8vc2FtcGxlLmlkbS5jb20vYXV0aC9yZWFsbXMvc2FtcGxlLXJlYWxtIiwic3ViIjoiYTRlZGJlMDItZWViOC00N2NiLWFlOTctY2I0NDg2ZmIxZTE0IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoic2FtcGxlLWNsaWVudCIsInNlc3Npb25fc3RhdGUiOiJkZDUzMzc5My01MGE5LTQ0ODAtODE1Ni03MWI1N2JlOWYyYTEiLCJhY3IiOiIwIiwibmFtZSI6IkNoYXJsZXMgQWRtaW4iLCJlbWFpbCI6ImNoYXJsZXNhZG1pbkBhZG1pbiJ9.a4lB--p4k4I-628Tw9anvaHUFc6vNrFhyja03H8hwkI"
}

func GetDummyAuthorization() string {
	return "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MTU4MjQzNjgsImlhdCI6MTYxMjU1Mzc4NiwiYXV0aF90aW1lIjoxNjEyNTM1NDE0LCJqdGkiOiI0ZTQ4YWQwNS00M2RkLTQ3NDYtYTc1YS1kYmVjZmIxMDVjNzUiLCJpc3MiOiJodHRwOi8vc2FtcGxlLmlkbS5jb20vYXV0aC9yZWFsbXMvc2FtcGxlLXJlYWxtIiwic3ViIjoiYTRlZGJlMDItZWViOC00N2NiLWFlOTctY2I0NDg2ZmIxZTE0IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoic2FtcGxlLWNsaWVudCIsInNlc3Npb25fc3RhdGUiOiJkZDUzMzc5My01MGE5LTQ0ODAtODE1Ni03MWI1N2JlOWYyYTEiLCJhY3IiOiIwIiwibmFtZSI6IkpvaG4gRG9lIiwiZW1haWwiOiJqb2huZG9lQGVtYWlsLmNvbSJ9.W7FNE-sQkCpJUjBjGoK7eE8Mgf92Mn56IL_vFWDAw4A"
}

func GetDummyAuthorizationNotFound() string {
	return "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MTU4NDk4MzEsImlhdCI6MTYxMjU1Mzc4NiwiYXV0aF90aW1lIjoxNjEyNTM1NDE0LCJqdGkiOiI0ZTQ4YWQwNS00M2RkLTQ3NDYtYTc1YS1kYmVjZmIxMDVjNzUiLCJpc3MiOiJodHRwOi8vc2FtcGxlLmlkbS5jb20vYXV0aC9yZWFsbXMvc2FtcGxlLXJlYWxtIiwic3ViIjoiYTRlZGJlMDItZWViOC00N2NiLWFlOTctY2I0NDg2ZmIxZTE0IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoic2FtcGxlLWNsaWVudCIsInNlc3Npb25fc3RhdGUiOiJkZDUzMzc5My01MGE5LTQ0ODAtODE1Ni03MWI1N2JlOWYyYTEiLCJhY3IiOiIwIiwibmFtZSI6IkNoYXJsZXMgQWRtaW4iLCJlbWFpbCI6ImNoYXJsZXNhZG1pbkBub3Rmb3VuZCJ9.l5vT9gdKKSK3rc1U83yXlPqLuOjkkChba_Af5KaA45o"
}

func GetDummyCreateSystemTokenInput() systoken.CreateSystemTokenInput {
	return systoken.CreateSystemTokenInput{
		Name:        "System Token Test",
		Permissions: []string{"circles_write", "deploy_write"},
		Workspaces:  []string{"ddb90f09-146a-4c9d-95f8-2be4841e7e7e", "d2f0a275-4532-4730-8d20-81d00033ee0b"},
	}
}

func GetDummyUserSystemToken(systemTokenID uuid.UUID) domain.User {
	return domain.User{
		ID:            uuid.New(),
		Name:          "System Token Test",
		PhotoURL:      "",
		Email:         systemTokenID.String() + "@system.token",
		IsRoot:        false,
		SystemTokenID: systemTokenID,
		CreatedAt:     time.Now(),
	}
}

func GetDummyPermissions() []domain.Permission {
	return []domain.Permission{
		{
			ID:   uuid.New(),
			Name: "circles_write",
		},
		{
			ID:   uuid.New(),
			Name: "deploy_write",
		},
	}
}

func GetDummyPage() domain.Page {
	return domain.Page{
		PageNumber: 0,
		PageSize:   20,
		Sort:       "sort",
		Total:      2,
	}
}

func GetDummyAuthorizationAuthorization(path string, method string) domain.Authorization {
	return domain.Authorization{
		Path:   path,
		Method: method,
	}
}

func GetDummyRootUser() domain.User {
	return domain.User{
		ID:        uuid.New(),
		Name:      "Charles Admin",
		PhotoURL:  "",
		Email:     "charlesadmin@admin",
		IsRoot:    true,
		CreatedAt: time.Now(),
	}
}

func GetDummyUserAuthorize() domain.User {
	return domain.User{
		ID:        uuid.New(),
		Name:      "John Doe",
		PhotoURL:  "",
		Email:     "johndoe@email.com",
		IsRoot:    false,
		CreatedAt: time.Now(),
	}
}
