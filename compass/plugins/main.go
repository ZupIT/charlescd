package main

import (
	"compass/pkg/datasource"
	"encoding/json"
	"fmt"
	"plugin"
)

func main() {

	plugin, err := plugin.Open("./prometheus/prometheus.so")
	if err != nil {
		panic(err)
	}

	getLists, err := plugin.Lookup("GetLists")
	if err != nil {
		panic(err)
	}

	config := datasource.Configuration{
		Data: map[string]string{
			"url": "http://demo.robustperception.io:9090/api/v1/label/__name__/values",
		},
	}

	configurationData, _ := json.Marshal(config.Data)
	list, err := getLists.(func(configurationData []byte) (datasource.MetricList, error))(configurationData)
	if err != nil {
		panic(err)
	}

	fmt.Println("LIST: ", list)
}
