package deployer

type Deploy struct{}

func NewDeploy() *Deploy {
	return &Deploy{}
}

func (deploy *Deploy) Do(manifest map[string]interface{}) {

}
