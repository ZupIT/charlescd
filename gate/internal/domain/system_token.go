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

package domain

import (
	"github.com/google/uuid"
	"time"
)

type SystemToken struct {
	ID            uuid.UUID
	Name          string
	Revoked       bool
	Permissions   []Permission
	Workspaces    []SimpleWorkspace
	AllWorkspaces bool
	Token         string
	CreatedAt     *time.Time
	RevokedAt     *time.Time
	LastUsedAt    *time.Time
	Author        string
}

func (systemToken SystemToken) CreateUserFromSystemToken() User {
	return User{
		ID:            uuid.New(),
		Name:          systemToken.Name,
		PhotoURL:      "",
		Email:         systemToken.ID.String() + "@system.token",
		IsRoot:        false,
		SystemTokenID: systemToken.ID,
		CreatedAt:     time.Now(),
	}
}

func (systemToken *SystemToken) SetLastUsed() {
	lastUsedAt := time.Now()
	systemToken.LastUsedAt = &lastUsedAt
}
