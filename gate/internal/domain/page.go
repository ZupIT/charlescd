package domain

import "math"

type Page struct {
	Page  int
	Size  int
	Sort  string
	Total int64
}

func (pg Page) Offset() int {
	return pg.Page * pg.Size
}

func (pg Page) IsLast(tokens []SystemToken) bool {
	return pg.Page + 1 >= pg.TotalPages(tokens)
}

func (pg Page) TotalPages(tokens []SystemToken) int {
	if len(tokens) == 0 && pg.Total == 0 {
		return 1
	} else {
		d := float64(pg.Total) / float64(pg.Size)
		return int(math.Ceil(d))
	}
}
