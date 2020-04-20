package git

import "fmt"

func getDefaultFileNamesByName(name string) []string {
	return []string{
		fmt.Sprintf("%s-darwin.tgz", name),
		fmt.Sprintf("%s.yaml", name),
	}
}
