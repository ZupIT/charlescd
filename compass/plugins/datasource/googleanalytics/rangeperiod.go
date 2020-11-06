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
	"time"

	"google.golang.org/api/analyticsreporting/v4"
)

type AnalyticsPeriod struct {
	StartDate  string
	EndDate    string
	Dimensions []*analyticsreporting.Dimension
	Filters    string
}

var units = map[string]string{
	"m":   "dateHourMinute",
	"h":   "hour",
	"d":   "day",
	"w":   "week",
	"y":   "year",
	"MAX": "MAX",
}

func getFilteredHours(periodValue int64) string {
	currentPeriodValue := periodValue
	hours, _, _ := time.Now().Clock()
	filters := ""

	for currentPeriodValue > 0 && hours > 0 {
		filters += fmt.Sprintf("ga:hour==%d", hours)

		if currentPeriodValue > 1 && hours > 1 {
			filters += ","
		}

		currentPeriodValue--
		hours--
	}

	return filters
}

func getHoursRage(period datasource.Period) AnalyticsPeriod {
	return AnalyticsPeriod{
		StartDate: "today",
		EndDate:   "today",
		Dimensions: []*analyticsreporting.Dimension{
			{
				Name: "ga:dateHourMinute",
			},
			{
				Name: "ga:hour",
			},
		},
		Filters: getFilteredHours(period.Value),
	}
}

func getTodayRageTime(period datasource.Period) AnalyticsPeriod {
	return AnalyticsPeriod{
		StartDate: "today",
		EndDate:   "today",
		Dimensions: []*analyticsreporting.Dimension{
			{
				Name: "ga:dateHourMinute",
			},
			{
				Name: fmt.Sprintf("ga:%s", units[period.Unit]),
			},
		},
	}
}

func getDaysRage(period datasource.Period) AnalyticsPeriod {
	return AnalyticsPeriod{
		StartDate: fmt.Sprintf("%ddaysAgo", period.Value),
		EndDate:   "today",
		Dimensions: []*analyticsreporting.Dimension{
			{
				Name: "ga:dateHourMinute",
			},
			{
				Name: fmt.Sprintf("ga:%s", units["d"]),
			},
		},
	}
}

func getWeeksRage(period datasource.Period) AnalyticsPeriod {
	return AnalyticsPeriod{
		StartDate: fmt.Sprintf("%ddaysAgo", period.Value*7),
		EndDate:   "today",
		Dimensions: []*analyticsreporting.Dimension{
			{
				Name: "ga:dateHourMinute",
			},
			{
				Name: fmt.Sprintf("ga:%s", units["d"]),
			},
		},
	}
}

func getYearsRage(period datasource.Period) AnalyticsPeriod {
	return AnalyticsPeriod{
		StartDate: fmt.Sprintf("%ddaysAgo", period.Value*365),
		EndDate:   "today",
		Dimensions: []*analyticsreporting.Dimension{
			{
				Name: "ga:dateHourMinute",
			},
			{
				Name: fmt.Sprintf("ga:%s", units["d"]),
			},
		},
	}
}

var Periods = map[string]func(period datasource.Period) AnalyticsPeriod{
	"m": getTodayRageTime,
	"h": getHoursRage,
	"d": getDaysRage,
	"w": getWeeksRage,
	"y": getYearsRage,
}
