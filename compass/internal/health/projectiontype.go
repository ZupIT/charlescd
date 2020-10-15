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

import "compass/pkg/datasource"

var allProjectionsType = map[string][]datasource.Period{
	"FIVE_MINUTES": {
		{Value: 5, Unit: "m"},
		{Value: 10, Unit: "s"},
	},
	"FIFTEEN_MINUTES": {
		{Value: 15, Unit: "m"},
		{Value: 30, Unit: "s"},
	},
	"THIRTY_MINUTES": {
		{Value: 30, Unit: "m"},
		{Value: 1, Unit: "m"},
	},
	"ONE_HOUR": {
		{Value: 1, Unit: "h"},
		{Value: 2, Unit: "m"},
	},
	"THREE_HOUR": {
		{Value: 3, Unit: "h"},
		{Value: 6, Unit: "m"},
	},
	"EIGHT_HOUR": {
		{Value: 8, Unit: "h"},
		{Value: 15, Unit: "m"},
	},
	"TWELVE_HOUR": {
		{Value: 12, Unit: "h"},
		{Value: 24, Unit: "m"},
	},
	"TWENTY_FOUR_HOUR": {
		{Value: 24, Unit: "h"},
		{Value: 48, Unit: "m"},
	},
}
