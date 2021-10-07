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

package questions

import (
	"fmt"
	"quiz_app/internal/repositories"
	"quiz_app/internal/types"
)

func GetQuestions() ([]types.Question, error) {
	questions, err := repositories.GetQuestions()
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	return questions, nil
}
