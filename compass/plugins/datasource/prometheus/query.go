package main

import (
	"compass/pkg/datasource"
	"fmt"
)

func transformFiltersToQuery(filters []datasource.MetricFilter) string {
	filterQuery := "{"
	for index, filter := range filters {
		filterQuery += fmt.Sprintf(`%s%s"%s"`, filter.Field, filter.Operator, filter.Value)
		if (index + 1) < len(filters) {
			filterQuery += ","
		}
	}
	filterQuery += "}"
	return filterQuery
}

func createQueryByMetric(filters []datasource.MetricFilter, query, period string) string {
	if period == "" {
		return fmt.Sprintf("%s%s", query, transformFiltersToQuery(filters))
	}
	return fmt.Sprintf("%s%s[%s]", query, transformFiltersToQuery(filters), period)
}
