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
