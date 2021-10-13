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

package models

import (
	"github.com/google/uuid"
	"time"
)

type Workspace struct {
	ID                      uuid.UUID
	Name                    string
	Author                  uuid.UUID `gorm:"column:user_id"`
	CreatedAt               *time.Time
	UserGroups              []UserGroup `gorm:"many2many:workspaces_user_groups;"`
	Status                  string
	RegistryConfigurationID uuid.UUID
	CircleMatcherURL        string
	GitConfigurationID      uuid.UUID
	CdConfigurationID       uuid.UUID
	MetricConfigurationID   uuid.UUID
}
