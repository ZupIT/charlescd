package datasource

import (
	"github.com/ZupIT/charlescd/compass/internal/logging"
	"github.com/ZupIT/charlescd/compass/internal/repository"
	"github.com/ZupIT/charlescd/compass/pkg/datasource"
	"github.com/google/uuid"
)

type GetMetrics interface {
	Execute(workspaceId uuid.UUID) (datasource.MetricList, error)
}

type getMetrics struct {
	datasourceRepository repository.DatasourceRepository
}

func NewGetMetrics(d repository.DatasourceRepository) GetMetrics {
	return getMetrics{
		datasourceRepository: d,
	}
}

func (g getMetrics) Execute(datasourceId uuid.UUID) (datasource.MetricList, error) {
	metrics, err := g.datasourceRepository.GetMetrics(datasourceId)
	if err != nil {
		return datasource.MetricList{}, logging.WithOperation(err, "getMetrics.Execute")
	}

	return metrics, nil
}
