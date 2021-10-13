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

package domain

import "math"

type Page struct {
	PageNumber int
	PageSize   int
	Sort       string
	Total      int64
}

func (pg Page) Offset() int {
	return pg.PageNumber * pg.PageSize
}

func (pg Page) IsLast() bool {
	return pg.PageNumber+1 >= pg.TotalPages()
}

func (pg Page) TotalPages() int {
	if pg.Total == 0 {
		return 1
	}
	d := float64(pg.Total) / float64(pg.PageSize)
	return int(math.Ceil(d))
}

func (pg *Page) FillDefaults() {
	if pg.PageSize == 0 {
		pg.PageSize = 20
	}
	if pg.Sort == "" {
		pg.Sort = "created_at desc"
	}
}
