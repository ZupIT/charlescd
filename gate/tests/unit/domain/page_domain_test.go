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
