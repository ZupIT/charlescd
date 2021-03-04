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
	} else {
		d := float64(pg.Total) / float64(pg.PageSize)
		return int(math.Ceil(d))
	}
}
