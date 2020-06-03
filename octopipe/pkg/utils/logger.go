/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package utils

import (
	"fmt"
	"log"

	"github.com/fatih/color"
)

func CustomLog(logType string, functionName string, description string) {
	colorWhite := color.New(color.FgWhite)
	bg := colorWhite.Add(color.FgCyan)

	if logType == "error" {
		bg = colorWhite.Add(color.BgRed)
	} else if logType == "success" {
		bg = colorWhite.Add(color.BgGreen)
	}

	message := fmt.Sprintf("%s | %s() | %s", bg.Sprintf(" %s ", logType), functionName, description)
	log.Println(message)
}
