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

package datasource

import (
	"encoding/json"
	"github.com/ZupIT/charlescd/compass/internal/plugin"
	"github.com/ZupIT/charlescd/compass/pkg/datasource"
	"github.com/ZupIT/charlescd/compass/pkg/errors"
	"github.com/google/uuid"
	"io"

	"github.com/jinzhu/gorm"
)

type UseCases interface {
	Parse(dataSource io.ReadCloser) (Request, errors.Error)
	FindAllByWorkspace(workspaceID uuid.UUID) ([]Response, errors.Error)
	FindByID(id string) (Response, errors.Error)
	Save(dataSource Request) (Response, errors.Error)
	Delete(id string) errors.Error
	GetMetrics(dataSourceID string) (datasource.MetricList, errors.Error)
	Validate(dataSource Request) errors.ErrorList
	TestConnection(pluginSrc string, datasourceData json.RawMessage) errors.Error
}

type Main struct {
	db         *gorm.DB
	pluginMain plugin.UseCases
}

func NewMain(db *gorm.DB, pluginMain plugin.UseCases) UseCases {
	return Main{db, pluginMain}
}
