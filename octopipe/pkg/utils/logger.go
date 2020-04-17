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
