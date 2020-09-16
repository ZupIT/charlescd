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
