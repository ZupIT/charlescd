package deployer

type Undeploy struct{}

func NewUndeploy() *Undeploy {
	return &Undeploy{}
}

func (undeploy *Undeploy) Do(manifest map[string]interface{}) {

}
