package handlers

import (
	"encoding/json"
	"github.com/ZupIT/charlescd/compass/internal/logging"
	"io"
)

func Parse(input io.ReadCloser, output interface{}) (interface{}, error) {
	err := json.NewDecoder(input).Decode(&output)
	if err != nil {
		return nil, logging.NewError("Parse error", err, nil, "Parse json")
	}

	return output, nil
}
