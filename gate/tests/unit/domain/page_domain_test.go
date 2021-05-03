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

package domain

import (
	"github.com/ZupIT/charlescd/gate/internal/domain"
	"github.com/stretchr/testify/require"
)

func (d *DomainSuite) TestPageWithItems() {
	d.page = getDummyPage(0, 20, "", 50)

	totalPages := d.page.TotalPages()
	offset := d.page.Offset()
	isLast := d.page.IsLast()

	require.Equal(d.T(), 3, totalPages)
	require.Equal(d.T(), 0, offset)
	require.Equal(d.T(), false, isLast)
}

func (d *DomainSuite) TestPageEmpty() {
	d.page = getDummyPage(0, 20, "", 0)

	totalPages := d.page.TotalPages()
	offset := d.page.Offset()
	isLast := d.page.IsLast()

	require.Equal(d.T(), 1, totalPages)
	require.Equal(d.T(), 0, offset)
	require.Equal(d.T(), true, isLast)
}

func (d *DomainSuite) TestPageFillDefaults() {
	d.page = getDummyPage(0, 0, "", 50)

	d.page.FillDefaults()

	totalPages := d.page.TotalPages()
	offset := d.page.Offset()
	isLast := d.page.IsLast()

	require.Equal(d.T(), 3, totalPages)
	require.Equal(d.T(), 0, offset)
	require.Equal(d.T(), false, isLast)
	require.Equal(d.T(), 20, d.page.PageSize)
	require.Equal(d.T(), "created_at desc", d.page.Sort)
}

func getDummyPage(pageNumber int, pageSize int, sort string, total int64) domain.Page {
	return domain.Page{
		PageNumber: pageNumber,
		PageSize:   pageSize,
		Sort:       sort,
		Total:      total,
	}
}
