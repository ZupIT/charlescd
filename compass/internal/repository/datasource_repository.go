package repository

import (
	"database/sql"
	"encoding/json"
	"github.com/ZupIT/charlescd/compass/internal/domain"
	"github.com/ZupIT/charlescd/compass/internal/plugin"
	"github.com/ZupIT/charlescd/compass/internal/repository/models"
	"github.com/ZupIT/charlescd/compass/internal/repository/queries"
	"github.com/ZupIT/charlescd/compass/internal/util/mapper"
	"github.com/ZupIT/charlescd/compass/pkg/datasource"
	"github.com/ZupIT/charlescd/compass/pkg/errors"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type DatasourceRepository interface {
	FindAllByWorkspace(workspaceID uuid.UUID) ([]domain.Datasource, error)
	FindById(id string) (domain.Datasource, errors.Error)
	Save(dataSource domain.Datasource) (domain.Datasource, error)
	Delete(id uuid.UUID) error
	GetMetrics(dataSourceID string) (datasource.MetricList, error)
	TestConnection(pluginSrc string, datasourceData json.RawMessage) error
}

type datasourceRepository struct {
	db         *gorm.DB
	pluginMain plugin.UseCases
}

func NewDatasourceRepository(db *gorm.DB, pluginMain plugin.UseCases) DatasourceRepository {
	return datasourceRepository{db, pluginMain}
}

func (main datasourceRepository) FindAllByWorkspace(workspaceID uuid.UUID) ([]domain.Datasource, error) {
	var rows *sql.Rows
	var err error
	dataSources := make([]models.DataSource, 0)

	rows, err = main.db.Raw(queries.workspaceDatasourceQuery, workspaceID).Rows()
	if err != nil {
		return []domain.Datasource{}, err
	}

	for rows.Next() {
		var dataSource models.DataSource

		err = main.db.ScanRows(rows, &dataSource)
		if err != nil {
			return []domain.Datasource{}, err
		}

		dataSources = append(dataSources, dataSource)
	}

	return mapper.DatasourceModelToDomains(dataSources), nil
}

func (main datasourceRepository) FindById(id string) (domain.Datasource, errors.Error) {
	dataSource := models.DataSource{}
	row := main.db.Raw(queries.datasourceDecryptedQuery, id).Row()

	dbError := row.Scan(&dataSource.ID, &dataSource.Name, &dataSource.CreatedAt, &dataSource.Data,
		&dataSource.WorkspaceID, &dataSource.DeletedAt, &dataSource.PluginSrc)
	if dbError != nil {
		return domain.Datasource{}, errors.NewError("Find by id error", dbError.Error()).
			WithOperations("FindById.ScanRows")
	}

	return mapper.DatasourceModelToDomain(dataSource), nil
}

func (main datasourceRepository) Delete(id uuid.UUID) error {
	db := main.db.Model(&models.DataSource{}).Where("id = ?", id).Delete(&models.DataSource{})
	if db.Error != nil {
		return db.Error
	}

	return nil
}

func (main datasourceRepository) GetMetrics(dataSourceID string) (datasource.MetricList, error) {
	dataSourceResult, err := main.FindById(dataSourceID)
	if err != nil {
		return datasource.MetricList{}, err.WithOperations("GetMetrics.FindById")
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

func (main datasourceRepository) TestConnection(pluginSrc string, datasourceData json.RawMessage) error {
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

func (main datasourceRepository) Save(dataSource domain.Datasource) (domain.Datasource, error) {

	id := uuid.New().String()
	entity := models.DataSource{}

	row := main.db.Exec(queries.Insert(id, dataSource.Name, dataSource.PluginSrc, dataSource.Data, dataSource.WorkspaceID)).
		Raw(queries.datasourceSaveQuery, id).
		Row()

	dbError := row.Scan(&entity.ID, &entity.Name, &entity.CreatedAt,
		&entity.WorkspaceID, &entity.DeletedAt, &entity.PluginSrc)
	if dbError != nil {
		return domain.Datasource{}, dbError
	}

	return dataSource, nil
}
