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

func createQueryByMetric(filters []datasource.MetricFilter, query, period, interval string) string {
	return addPeriodAndIntervalToQuery(addFiltersToQuery(filters, query), period, interval)
}

func addFiltersToQuery(filters []datasource.MetricFilter, query string) string {
	if len(filters) <= 0 {
		return query
	}

	return fmt.Sprintf("%s%s", query, transformFiltersToQuery(filters))
}

func addPeriodAndIntervalToQuery(query, period, interval string) string {
	if period != "" {
		if interval != "" {
			return fmt.Sprintf("%s[%s:%s]", query, period, interval)
		}
		return fmt.Sprintf("%s[%s]", query, period)
	}

	return query
}
