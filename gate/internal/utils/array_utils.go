package utils

func RemoveDuplicationOnArray(array []string) []string{
	newArray := make([]string, 0)
	mapArray := make(map[string]bool)
	for _, workspace := range array {
		exists := mapArray[workspace]
		if !exists {
			newArray = append(newArray, workspace)
			mapArray[workspace] = true
		}
	}
	return newArray
}