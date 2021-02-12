/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package eks

import (
	"encoding/base64"
	"octopipe/pkg/customerror"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	eksService "github.com/aws/aws-sdk-go/service/eks"
	"k8s.io/client-go/rest"
	"sigs.k8s.io/aws-iam-authenticator/pkg/token"
)

type EKSProvider struct {
	AWSID          string `json:"awsSID"`
	AWSSecret      string `json:"awsSecret"`
	AWSRegion      string `json:"awsRegion"`
	AWSClusterName string `json:"awsClusterName"`
}

func NewEKSProvider(eksProvider EKSProvider) EKSProvider {
	return eksProvider
}

func (eksProvider EKSProvider) GetClient() (*rest.Config, error) {
	return eksProvider.getRestConfig()
}

func (eksProvider EKSProvider) getRestConfig() (*rest.Config, error) {
	awsSession := eksProvider.getAWSSession()
	eksClusterData, err := eksProvider.getEKSClusterDataBySession(awsSession)
	if err != nil {
		return nil, customerror.WithOperation(err, "eks.getRestConfig.getEKSClusterDataBySession")
	}

	bearerToken, err := eksProvider.getK8sTokenByAwsClusterAndSession(eksClusterData, awsSession)
	if err != nil {
		return nil, customerror.WithOperation(err, "eks.getRestConfig.getK8sTokenByAwsClusterAndSession")
	}

	encodedCertificate, err := eksProvider.getEncodedCertificateByEKSCluster(eksClusterData)
	if err != nil {
		return nil, customerror.WithOperation(err, "eks.getRestConfig.getEncodedCertificateByEKSCluster")
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

func (eksProvider EKSProvider) getEncodedCertificateByEKSCluster(
	eksClusterData eksService.Cluster,
) ([]byte, error) {
	b, err := base64.StdEncoding.DecodeString(aws.StringValue(eksClusterData.CertificateAuthority.Data))
	if err != nil {
		return nil, customerror.New("Failed decode certificate authority data", err.Error(), nil, "eks.getEncodedCertificateByEKSCluster.DecodeString")
	}

	return b, nil
}

func (eksProvider *EKSProvider) getK8sTokenByAwsClusterAndSession(
	clusterData eksService.Cluster, awsSession session.Session,
) (string, error) {
	tokenGenerator, err := token.NewGenerator(true, false)
	if err != nil {
		return "", customerror.New("Get token failed", err.Error(), nil, "eks.getK8sTokenByAwsClusterAndSession.NewGenerator")
	}

	tokenOptions := token.GetTokenOptions{
		ClusterID: aws.StringValue(clusterData.Name),
		Session:   &awsSession,
	}

	dataToken, err := tokenGenerator.GetWithOptions(&tokenOptions)
	if err != nil {
		return "", customerror.New("Get token failed", err.Error(), nil, "eks.getK8sTokenByAwsClusterAndSession.GetWithOptions")
	}

	return dataToken.Token, nil
}

func (eksProvider EKSProvider) getEKSClusterDataBySession(
	session session.Session,
) (eksService.Cluster, error) {
	clusterName := eksProvider.AWSClusterName
	cluster := eksService.New(&session)

	clusterDescribe, err := cluster.DescribeCluster(&eksService.DescribeClusterInput{
		Name: aws.String(clusterName),
	})

	if err != nil {
		return eksService.Cluster{}, customerror.New("Describe EKS cluster failed", err.Error(), nil, "eks.getEKSClusterDataBySession.DescribeCluster")
	}

	return *clusterDescribe.Cluster, nil
}

func (eksProvider *EKSProvider) getAWSSession() session.Session {
	id := eksProvider.AWSID
	secret := eksProvider.AWSSecret
	bearerToken := ""
	region := eksProvider.AWSRegion
	connectionRetries := 3

	return *session.Must(session.NewSession(&aws.Config{
		Credentials: credentials.NewStaticCredentials(id, secret, bearerToken),
		MaxRetries:  aws.Int(connectionRetries),
		Region:      aws.String(region),
	}))
}
