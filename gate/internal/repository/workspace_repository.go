/*
 *
 *  Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
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

package repository

import (
	"github.com/ZupIT/charlescd/gate/internal/logging"
	"gorm.io/gorm"
)

type WorkspaceRepository interface {
	CountByIds(workspaceIds []string) (int64, error)
}

type workspaceRepository struct {
	db      *gorm.DB
}

func NewWorkspaceRepository(db *gorm.DB) (WorkspaceRepository, error) {
	return workspaceRepository{db: db}, nil
}

func (workspaceRepository workspaceRepository) CountByIds(workspaceIds []string) (int64, error) {
	var count int64

	res := workspaceRepository.db.Table("workspaces").Where("id IN ?", workspaceIds).Count(&count)

	if res.Error != nil {
		return 0, handleWorkspaceError("Find all workspaces failed", "WorkspaceRepository.CountByIds.Count", res.Error, logging.InternalError)
	}

	return count, nil
}

func handleWorkspaceError(message string, operation string, err error, errType string) error {
	return logging.NewError(message, err, errType, nil, operation)
}