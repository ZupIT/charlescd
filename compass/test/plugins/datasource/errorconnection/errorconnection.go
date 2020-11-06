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
	"errors"
)

func TestConnection(datasourceConfiguration []byte) error {
	return errors.New("Connection error")
}

func GetMetrics(datasourceConfiguration []byte) (datasource.MetricList, error) {
	return datasource.MetricList{}, nil
}

func Query(request datasource.QueryRequest) ([]datasource.Value, error) {
	return []datasource.Value{}, nil
}

func Result(request datasource.ResultRequest) (float64, error) {
	return 0, nil
}
