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
	"database/sql"
	"encoding/json"
	"io"
	"time"

	"github.com/ZupIT/charlescd/compass/internal/util"
	"github.com/ZupIT/charlescd/compass/pkg/datasource"
	"github.com/ZupIT/charlescd/compass/pkg/errors"
	"github.com/google/uuid"
)

type DataSource struct {
	util.BaseModel
	Name        string     `json:"name"`
	PluginSrc   string     `json:"pluginSrc"`
	Data        []byte     `json:"data" gorm:"type:bytea"`
	WorkspaceID uuid.UUID  `json:"workspaceId"`
	DeletedAt   *time.Time `json:"-"`
}

type Request struct {
	util.BaseModel
	Name        string          `json:"name"`
	PluginSrc   string          `json:"pluginSrc"`
	Data        json.RawMessage `json:"data"`
	WorkspaceID uuid.UUID       `json:"workspaceId"`
	DeletedAt   *time.Time      `json:"-"`
}

type Response struct {
	util.BaseModel
	Name        string          `json:"name"`
	PluginSrc   string          `json:"pluginSrc"`
	Data        json.RawMessage `json:"data"`
	WorkspaceID uuid.UUID       `json:"workspaceId"`
	DeletedAt   *time.Time      `json:"-"`
}

func (main Main) Validate(dataSource Request) errors.ErrorList {
	ers := errors.NewErrorList()

	if dataSource.Name == "" {
		err := errors.NewError("Invalid data", "Name is required").
			WithMeta("field", "name").
			WithOperations("Validate.NameIsNil")
		ers.Append(err)
	}

	if dataSource.PluginSrc == "" {
		err := errors.NewError("Invalid data", "Plugin src is required").
			WithMeta("field", "pluginSrc").
			WithOperations("Validate.PluginSrcIsNil")
		ers.Append(err)
	}

	if dataSource.Data == nil || len(dataSource.Data) == 0 {
		err := errors.NewError("Invalid data", "Data is required").
			WithMeta("field", "data").
			WithOperations("Validate.DataIsNil")
		ers.Append(err)
	}

	if dataSource.Name != "" && len(dataSource.Name) > 100 {
		err := errors.NewError("Invalid data", "100 Maximum length in Name").
			WithMeta("field", "name").
			WithOperations("Validate.NameLen")
		ers.Append(err)
	}

	if dataSource.PluginSrc != "" && len(dataSource.PluginSrc) > 100 {
		err := errors.NewError("Invalid data", "100 Maximum length in PluginSrc").
			WithMeta("field", "PluginSrc").
			WithOperations("Validate.PluginSrcLen")
		ers.Append(err)
	}

	return ers
}

func (main Main) Parse(dataSource io.ReadCloser) (Request, errors.Error) {
	var newDataSource *Request
	err := json.NewDecoder(dataSource).Decode(&newDataSource)
	if err != nil {
		return Request{}, errors.NewError("Parse error", err.Error()).
			WithOperations("Parse.ParseDecode")
	}
	return *newDataSource, nil
}

func (main Main) FindAllByWorkspace(workspaceID uuid.UUID) ([]Response, errors.Error) {
	var rows *sql.Rows
	var err error
	dataSources := make([]Response, 0)

	rows, err = main.db.Raw(workspaceDatasourceQuery, workspaceID).Rows()

	if rows != nil && rows.Err() != nil {
		return []Response{}, errors.NewError("Find all error", rows.Err().Error()).
			WithOperations("FindAllByWorkspace.Raw")
	}
	if err != nil {
		return []Response{}, errors.NewError("Find all error", err.Error()).
			WithOperations("FindAllByWorkspace.Raw")
	}

	for rows.Next() {
		var dataSource DataSource

		err = main.db.ScanRows(rows, &dataSource)
		if err != nil {
			return []Response{}, errors.NewError("Find all error", err.Error()).
				WithOperations("FindAllByWorkspace.ScanRows")
		}

		dataSources = append(dataSources, dataSource.toResponse())
	}

	return dataSources, nil
}

func (main Main) FindByID(id string) (Response, errors.Error) {
	dataSource := DataSource{}
	row := main.db.Raw(datasourceDecryptedQuery, id).Row()

	dbError := row.Scan(&dataSource.ID, &dataSource.Name, &dataSource.CreatedAt, &dataSource.Data,
		&dataSource.WorkspaceID, &dataSource.DeletedAt, &dataSource.PluginSrc)
	if dbError != nil {
		return Response{}, errors.NewError("Find by id error", dbError.Error()).
			WithOperations("FindByID.ScanRows")
	}

	return dataSource.toResponse(), nil
}

func (main Main) Delete(id string) errors.Error {
	db := main.db.Model(&DataSource{}).Where("id = ?", id).Delete(&DataSource{})
	if db.Error != nil {
		return errors.NewError("Find error", db.Error.Error()).
			WithOperations("Delete.delete")
	}

	return nil
}

func (main Main) GetMetrics(dataSourceID string) (datasource.MetricList, errors.Error) {
	dataSourceResult, err := main.FindByID(dataSourceID)
	if err != nil {
		return datasource.MetricList{}, err.WithOperations("GetMetrics.FindByID")
	}

	plugin, err := main.pluginMain.GetPluginBySrc(dataSourceResult.PluginSrc)
	if err != nil {
		return datasource.MetricList{}, err.WithOperations("GetMetrics.GetPluginBySrc")
	}

	getList, lookupErr := plugin.Lookup("GetMetrics")
	if lookupErr != nil {
		return datasource.MetricList{}, errors.NewError("Lookup error", lookupErr.Error()).
			WithOperations("GetMetrics.Lookup")
	}

	configurationData, _ := json.Marshal(dataSourceResult.Data)
	list, getListErr := getList.(func(configurationData []byte) (datasource.MetricList, error))(configurationData)
	if getListErr != nil {
		return datasource.MetricList{}, errors.NewError("GetList error", getListErr.Error()).
			WithOperations("GetMetrics.getList")
	}

	return list, nil
}

func (main Main) TestConnection(pluginSrc string, datasourceData json.RawMessage) errors.Error {
	plugin, err := main.pluginMain.GetPluginBySrc(pluginSrc)
	if err != nil {
		return err.WithOperations("TestConnection.GetPluginBySrc")
	}

	testConnection, lookupError := plugin.Lookup("TestConnection")
	if lookupError != nil {
		return errors.NewError("Test Conn error", lookupError.Error()).
			WithOperations("TestConnection.Lookup")
	}

	configurationData, _ := json.Marshal(datasourceData)
	testConnError := testConnection.(func(configurationData []byte) error)(configurationData)
	if testConnError != nil {
		return errors.NewError("Test Conn error", testConnError.Error()).
			WithOperations("TestConnection.Marshal")
	}

	return nil
}

func (main Main) Save(dataSource Request) (Response, errors.Error) {

	id := uuid.New().String()
	entity := DataSource{}

	row := main.db.Exec(Insert(id, dataSource.Name, dataSource.PluginSrc, dataSource.Data, dataSource.WorkspaceID)).
		Raw(datasourceSaveQuery, id).
		Row()

	dbError := row.Scan(&entity.ID, &entity.Name, &entity.CreatedAt,
		&entity.WorkspaceID, &entity.DeletedAt, &entity.PluginSrc)
	if dbError != nil {
		return Response{}, errors.NewError("Save error", dbError.Error()).
			WithOperations("Save.Scan")
	}

	return entity.toResponse(), nil
}

func (entity DataSource) toResponse() Response {
	return Response{
		BaseModel:   entity.BaseModel,
		Name:        entity.Name,
		PluginSrc:   entity.PluginSrc,
		Data:        entity.Data,
		WorkspaceID: entity.WorkspaceID,
		DeletedAt:   entity.DeletedAt,
	}
}
