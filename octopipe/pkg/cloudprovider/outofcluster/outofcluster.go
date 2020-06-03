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

package outofcluster

import (
	"os"
	"path/filepath"

	"k8s.io/client-go/dynamic"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/clientcmd"
)

type OutOfCluster struct{}

func NewOutOfCluster() *OutOfCluster {
	return &OutOfCluster{}
}

func (outOfCluster *OutOfCluster) GetClient() (dynamic.Interface, error) {
	config, err := outOfCluster.getRestConfig()
	if err != nil {
		return nil, err
	}

	return dynamic.NewForConfig(config)
}

func (outOfCluster *OutOfCluster) getRestConfig() (*rest.Config, error) {
	var kubeconfig *string
	if home := os.Getenv("HOME"); home != "" {
		kubeConfigPath := filepath.Join(home, ".kube", "config")
		kubeconfig = &kubeConfigPath
	}

	return clientcmd.BuildConfigFromFlags("", *kubeconfig)
}
