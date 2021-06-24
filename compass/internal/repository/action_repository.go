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
	"github.com/ZupIT/charlescd/compass/internal/domain"
	"github.com/ZupIT/charlescd/compass/internal/logging"
	"github.com/ZupIT/charlescd/compass/internal/repository/models"
	"github.com/ZupIT/charlescd/compass/internal/repository/queries"
	"github.com/ZupIT/charlescd/compass/internal/util/mapper"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ActionRepository interface {
	FindActionByIdAndWorkspace(id, workspaceID uuid.UUID) (domain.Action, error)
	FindActionById(id uuid.UUID) (domain.Action, error)
	FindAllActionsByWorkspace(workspaceID uuid.UUID) ([]domain.Action, error)
	SaveAction(action domain.Action) (domain.Action, error)
	DeleteAction(id uuid.UUID) error
}

type actionRepository struct {
	db *gorm.DB
}

func NewActionRepository(db *gorm.DB) ActionRepository {
	return actionRepository{db}
}

func (main actionRepository) FindActionByIdAndWorkspace(id, workspaceID uuid.UUID) (domain.Action, error) {

	entity := models.Action{}
	row := main.db.Set("gorm:auto_preload", true).Raw(queries.DecryptedWorkspaceAndIdActionQuery(), id, workspaceID).Row()

	dbError := row.Scan(&entity.ID, &entity.WorkspaceId, &entity.Nickname, &entity.Type, &entity.Description, &entity.CreatedAt, &entity.DeletedAt, &entity.Configuration)
	if dbError != nil {
		return domain.Action{}, logging.NewError("Find by id and workspace error", dbError, nil, "ActionRepository.FindActionByIdAndWorkspace.Scan")
	}

	return mapper.ActionModelToDomain(entity), nil
}

func (main actionRepository) FindActionById(id uuid.UUID) (domain.Action, error) {

	entity := models.Action{}
	row := main.db.Set("gorm:auto_preload", true).Raw(queries.IdActionQuery(), id).Row()

	dbError := row.Scan(&entity.ID, &entity.WorkspaceId, &entity.Nickname, &entity.Type, &entity.Description, &entity.CreatedAt, &entity.DeletedAt, &entity.Configuration)
	if dbError != nil {
		return domain.Action{}, logging.NewError("Find by id error", dbError, nil, "ActionRepository.FindActionById.Scan")
	}

	return mapper.ActionModelToDomain(entity), nil
}

func (main actionRepository) FindAllActionsByWorkspace(workspaceID uuid.UUID) ([]domain.Action, error) {
	var actions []models.Action

	rows, err := main.db.Set("gorm:auto_preload", true).Raw(queries.WorkspaceActionQuery, workspaceID).Rows()
	if err != nil {
		return []domain.Action{}, logging.NewError("Find all error", err, nil, "ActionRepository.FindAllActionsByWorkspace.Set")
	}

	for rows.Next() {
		var action models.Action

		err = main.db.ScanRows(rows, &action)
		if err != nil {
			return []domain.Action{}, logging.NewError("Find all error", err, nil, "ActionRepository.FindAllActionsByWorkspace.ScanRows")

		}
		actions = append(actions, action)
	}

	return mapper.ActionModelToDomains(actions), nil
}

func (main actionRepository) SaveAction(action domain.Action) (domain.Action, error) {
	id := uuid.New().String()
	entity := models.Action{}

	row := main.db.Exec(queries.InsertAction(id, action.Nickname, action.Type, action.Description, action.Configuration, action.WorkspaceId)).
		Raw(queries.ActionQuery, id).
		Row()

	dbError := row.Scan(&entity.ID, &entity.WorkspaceId, &entity.Nickname, &entity.Type, &entity.Description, &entity.CreatedAt, &entity.DeletedAt)
	if dbError != nil {
		return domain.Action{}, logging.NewError("Save error", dbError, nil, "ActionRepository.SaveAction.Scan")
	}

	return mapper.ActionModelToDomain(entity), nil
}

func (main actionRepository) DeleteAction(id uuid.UUID) error {
	db := main.db.Model(&models.Action{}).Where("id = ?", id).Delete(&models.Action{})
	if db.Error != nil {
		return logging.NewError("Delete error", db.Error, nil, "ActionRepository.DeleteAction.Delete")
	}

	return nil
}
