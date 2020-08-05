package main

import v1 "compass/web/api/v1"

func main() {
	v1 := v1.NewV1()
	v1.Start()
}
