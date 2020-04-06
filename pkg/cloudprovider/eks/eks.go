package eks

type EKSProvider struct {
	AWSID          string `json:"awsSID"`
	AWSSecret      string `json:"awsSecret"`
	AWSegion       string `json:"awsRegion"`
	AWSClusterName string `json:"awsClusterName"`
}

func NewEKSProvider() *EKSProvider {
	return &EKSProvider{}
}

func (eksProvider *EKSProvider) Connect() {

}
