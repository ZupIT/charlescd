package utils

import (
	"github.com/ZupIT/charlescd/gate/internal/domain"
	"github.com/ZupIT/charlescd/gate/internal/service"
	"github.com/ZupIT/charlescd/gate/internal/use_case/system_token"
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
		Permissions: nil,
		Workspaces:  nil,
		TokenValue:  "System Token Value",
		CreatedAt:   &createdTime,
		RevokedAt:   nil,
		LastUsedAt:  nil,
		Author:      "charlesadmin@admin",
	}
}

func GetDummyAuthToken() service.AuthToken {
	return service.AuthToken{
		Name:           "Charles Admin",
		Email:          "charlesadmin@admin",
		StandardClaims: jwt.StandardClaims{},
	}
}

func GetDummyAuthorization() string {
	return "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MTU4MjQzNjgsImlhdCI6MTYxMjU1Mzc4NiwiYXV0aF90aW1lIjoxNjEyNTM1NDE0LCJqdGkiOiI0ZTQ4YWQwNS00M2RkLTQ3NDYtYTc1YS1kYmVjZmIxMDVjNzUiLCJpc3MiOiJodHRwOi8vc2FtcGxlLmlkbS5jb20vYXV0aC9yZWFsbXMvc2FtcGxlLXJlYWxtIiwic3ViIjoiYTRlZGJlMDItZWViOC00N2NiLWFlOTctY2I0NDg2ZmIxZTE0IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoic2FtcGxlLWNsaWVudCIsInNlc3Npb25fc3RhdGUiOiJkZDUzMzc5My01MGE5LTQ0ODAtODE1Ni03MWI1N2JlOWYyYTEiLCJhY3IiOiIwIiwibmFtZSI6IkNoYXJsZXMgQWRtaW4iLCJlbWFpbCI6ImNoYXJsZXNhZG1pbkBhZG1pbiJ9.a4lB--p4k4I-628Tw9anvaHUFc6vNrFhyja03H8hwkI"
}

func GetDummyAuthorizationNotFound() string {
	return "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MTU4NDk4MzEsImlhdCI6MTYxMjU1Mzc4NiwiYXV0aF90aW1lIjoxNjEyNTM1NDE0LCJqdGkiOiI0ZTQ4YWQwNS00M2RkLTQ3NDYtYTc1YS1kYmVjZmIxMDVjNzUiLCJpc3MiOiJodHRwOi8vc2FtcGxlLmlkbS5jb20vYXV0aC9yZWFsbXMvc2FtcGxlLXJlYWxtIiwic3ViIjoiYTRlZGJlMDItZWViOC00N2NiLWFlOTctY2I0NDg2ZmIxZTE0IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoic2FtcGxlLWNsaWVudCIsInNlc3Npb25fc3RhdGUiOiJkZDUzMzc5My01MGE5LTQ0ODAtODE1Ni03MWI1N2JlOWYyYTEiLCJhY3IiOiIwIiwibmFtZSI6IkNoYXJsZXMgQWRtaW4iLCJlbWFpbCI6ImNoYXJsZXNhZG1pbkBub3Rmb3VuZCJ9.l5vT9gdKKSK3rc1U83yXlPqLuOjkkChba_Af5KaA45o"
}

func GetDummyCreateSystemTokenInput() system_token.CreateSystemTokenInput {
	return system_token.CreateSystemTokenInput{
		Name:        "System Token Test",
		Permissions: []string{"circles_write", "deploy_write"},
		Workspaces: []string{"workspace1", "workspace2"},
	}
}

func GetDummyPermissions() []domain.Permission {
	return []domain.Permission{
		{
			ID:        uuid.New(),
			Name:      "circles_write",
			CreatedAt: time.Now(),
		},
		{
			ID:        uuid.New(),
			Name:      "deploy_write",
			CreatedAt: time.Now(),
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
