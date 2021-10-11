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

package util

const (
	GeneralParseError = "PARSE_ERROR"
	PluginLookupError = "PLUGIN_LOOKUP_ERROR"
	ResultQueryError  = "RESULT_QUERY_ERROR"
)

const (
	DatasourceSaveError       = "DATASOURCE_SAVE_ERROR"
	FindDatasourceError       = "FIND_DATASOURCE_ERROR"
	DeleteDatasourceError     = "DELETE_ERROR"
	OpenPluginGetMetricsError = "OPEN_PLUGIN_GET_METRICS_ERROR"
	PluginListError           = "PLUGIN_LIST_ERROR"
)

const (
	FindMetricByID    = "FIND_METRIC_BY_ID"
	SaveMetricError   = "SAVE_METRIC_ERROR"
	UpdateMetricError = "UPDATE_METRIC_ERROR"
	RemoveMetricError = "REMOVE_METRIC_ERROR"
)

const (
	FindAllMetricExecutionsError = "FIND_ALL_METRIC_EXECUTIONS_ERROR"
	SaveMetricExecutionError     = "SAVE_METRIC_EXECUTION_ERROR"
	UpdateMetricExecutionError   = "UPDATE_METRIC_EXECUTION_ERROR"
	RemoveMetricExecutionError   = "REMOVE_METRIC_EXECUTION_ERROR"
)

const (
	PeriodValidateRegexError    = "PERIOD_VALIDATE_REGEX_ERROR"
	PeriodValidateError         = "PERIOD_VALIDATE_ERROR"
	FindMetricsGroupError       = "FIND_METRICS_GROUP_ERROR"
	ResumeByCircleError         = "RESUME_BY_CIRCLE_ERROR"
	SaveMetricsGroupError       = "SAVE_METRICS_GROUP_ERROR"
	UpdateMetricsGroupError     = "UPDATE_METRICS_GROUP_ERROR"
	UpdateNameMetricsGroupError = "UPDATE_NAME_METRICS_GROUP_ERROR"
	RemoveMetricsGroupError     = "REMOVE_METRICS_GROUP_ERROR"
	QueryFindDatasourceError    = "QUERY_FIND_DATASOURCE_ERROR"
	QueryGetPluginError         = "QUERY_GET_PLUGIN_ERROR"
	QueryByGroupIDError         = "QUERY_BY_GROUP_ID_ERROR"
	ListAllByGroupError         = "LIST_ALL_BY_GROUP_ERROR"
)

const (
	FindPluginError    = "FIND_PLUGIN_ERROR"
	GetPluginByIDError = "GET_PLUGIN_BY_ID_ERROR"
)

const (
	ResultByGroupMetricError = "RESULT_BY_GROUP_METRIC_ERROR"
)

const (
	FindActionError                     = "FIND_ACTION_ERROR"
	SaveActionError                     = "SAVE_ACTION_ERROR"
	UpdateActionError                   = "UPDATE_ACTION_ERROR"
	DeleteActionError                   = "DELETE_ACTION_ERROR"
	ListGroupActionExecutionStatusError = "LIST_GROUP_ACTION_EXECUTION_STATUS_ERROR"
	ActionExecutionValidateError        = "VALIDATE_ACTION_CAN_BE_EXECUTED_ERROR"
)

const (
	FindActionExecutionError        = "FIND_ACTION_EXECUTION_ERROR"
	CreateActionExecutionError      = "CREATE_ACTION_EXECUTION_ERROR"
	SetExecutionFailedError         = "SET_ACTION_EXECUTION_FAILED_ERROR"
	SetExecutionFailedErrorFinding  = "SET_ACTION_EXECUTION_FAILED_FINDING_ERROR"
	SetExecutionSuccessError        = "SET_ACTION_EXECUTION_SUCCESS_ERROR"
	SetExecutionSuccessErrorFinding = "SET_ACTION_EXECUTION_SUCCESS_FINDING_ERROR"
	ExecutionNotInExecution         = "ACTION_EXECUTION_NOT_IN_EXECUTION"
	CountNumberOfExecutionsError    = "ACTION_EXECUTION_COUNT"
)

type ErrorUtil struct {
	Field string `json:"field"`
	Error string `json:"error"`
}
