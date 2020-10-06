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
