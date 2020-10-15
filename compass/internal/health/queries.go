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

package health

import "fmt"

func (main Main) getTotalRequestStringQuery(workspaceId, circleSource string, isGrouped bool) string {
	groupBy := ""
	if isGrouped {
		groupBy = "by(destination_component)"
	}

	metricName := "istio_charles_request_total"
	return fmt.Sprintf(`ceil(sum(irate(%s{circle_source="%s"}[1m])) %s)`, metricName, circleSource, groupBy)
}

func (main Main) GetAverageLatencyStringQuery(workspaceId, circleSource string) string {
	query := fmt.Sprintf(`round((sum(irate(istio_charles_request_duration_seconds_sum{circle_source="%s"}[1m])) by(destination_component) / sum(irate(istio_charles_request_duration_seconds_count{circle_source="%s"}[1m])) by(destination_component)) * 1000)`, circleSource, circleSource)

	return query
}

func (main Main) GetAverageHttpErrorsPercentageStringQuery(workspaceId, circleSource string) string {
	metricName := "istio_charles_request_total"
	filter := fmt.Sprintf(`circle_source="%s"`, circleSource)
	finalFilter := fmt.Sprintf(`%s, response_status=~"^5.*$"`, filter)
	query := fmt.Sprintf(`round((sum(irate(%s{%s}[1m])) by(destination_component) / scalar(sum(irate(%s{%s}[1m])) by(destination_component)) * 100), 0.01)`, metricName, finalFilter, metricName, filter)

	return query
}
