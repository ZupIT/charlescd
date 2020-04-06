package eks

import (
	"encoding/base64"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	eksService "github.com/aws/aws-sdk-go/service/eks"
	"k8s.io/client-go/dynamic"
	"k8s.io/client-go/rest"
	"sigs.k8s.io/aws-iam-authenticator/pkg/token"
)

type EKSProvider struct {
	AWSID          string `json:"awsSID"`
	AWSSecret      string `json:"awsSecret"`
	AWSRegion      string `json:"awsRegion"`
	AWSClusterName string `json:"awsClusterName"`
}

func NewEKSProvider() *EKSProvider {
	return &EKSProvider{}
}

func (eksProvider *EKSProvider) Connect() (dynamic.Interface, error) {
	restConfig, err := eksProvider.getRestConfig()
	if err != nil {
		return nil, err
	}

	return dynamic.NewForConfig(restConfig)
}

func (eksProvider *EKSProvider) getRestConfig() (*rest.Config, error) {
	awsSession := eksProvider.getAWSSession()
	eksClusterData, err := eksProvider.getEKSClusterDataBySession(awsSession)
	if err != nil {
		return nil, err
	}

	bearerToken, err := eksProvider.getK8sTokenByAwsClusterAndSession(eksClusterData, awsSession)
	if err != nil {
		return nil, err
	}

	encodedCertificate, err := eksProvider.getEncodedCertificateByEKSCluster(eksClusterData)
	if err != nil {
		return nil, err
	}

	restConfig := &rest.Config{
		Host:        aws.StringValue(eksClusterData.Endpoint),
		BearerToken: bearerToken,
		TLSClientConfig: rest.TLSClientConfig{
			CAData: encodedCertificate,
		},
	}

	return restConfig, nil
}

func (eksProvider *EKSProvider) getEncodedCertificateByEKSCluster(
	eksClusterData *eksService.Cluster,
) ([]byte, error) {
	return base64.StdEncoding.DecodeString(aws.StringValue(eksClusterData.CertificateAuthority.Data))
}

func (eksProvider *EKSProvider) getK8sTokenByAwsClusterAndSession(
	clusterData *eksService.Cluster, awsSession *session.Session,
) (string, error) {
	tokenGenerator, err := token.NewGenerator(true, false)
	if err != nil {
		return "", err
	}

	tokenOptions := &token.GetTokenOptions{
		ClusterID: aws.StringValue(clusterData.Name),
		Session:   awsSession,
	}

	dataToken, err := tokenGenerator.GetWithOptions(tokenOptions)
	if err != nil {
		return "", err
	}

	return dataToken.Token, nil
}

func (eksProvider *EKSProvider) getEKSClusterDataBySession(
	session *session.Session,
) (*eksService.Cluster, error) {
	clusterName := eksProvider.AWSClusterName
	cluster := eksService.New(session)

	clusterDescribe, err := cluster.DescribeCluster(&eksService.DescribeClusterInput{
		Name: aws.String(clusterName),
	})

	if err != nil {
		return nil, err
	}

	return clusterDescribe.Cluster, nil
}

func (eksProvider *EKSProvider) getAWSSession() *session.Session {
	id := eksProvider.AWSID
	secret := eksProvider.AWSSecret
	bearerToken := ""
	region := eksProvider.AWSRegion
	connectionRetries := 3

	return session.Must(session.NewSession(&aws.Config{
		Credentials: credentials.NewStaticCredentials(id, secret, bearerToken),
		MaxRetries:  aws.Int(connectionRetries),
		Region:      aws.String(region),
	}))
}
