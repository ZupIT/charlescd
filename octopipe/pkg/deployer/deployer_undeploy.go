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

package deployer

import (
	k8sErrors "k8s.io/apimachinery/pkg/api/errors"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

// TODO: Move const data to received pipeline
const (
	permitedUndeployResource = "deployments"
)

type Undeploy struct {
	*Resource
}

func NewUndeploy(resource *Resource) *Undeploy {
	return &Undeploy{Resource: resource}
}

func (undeploy *Undeploy) Do() error {
	if len(undeploy.Manifest.Object) == 0 || undeploy.Manifest.GetName() == "" {
		return nil
	}

	client, err := undeploy.Config.GetClient()
	if err != nil {
		return err
	}

	resourceSchema := getResourceSchemaByManifest(undeploy.Manifest)

	if resourceSchema.Resource != permitedUndeployResource {
		return nil
	}

	k8sResource := client.Resource(resourceSchema)
	namespace := undeploy.Manifest.GetNamespace()
	name := undeploy.Manifest.GetName()
	deletePolicy := metav1.DeletePropagationForeground
	deleteOptions := &metav1.DeleteOptions{
		PropagationPolicy: &deletePolicy,
	}

	err = k8sResource.Namespace(namespace).Delete(name, deleteOptions)
	if err != nil && k8sErrors.IsNotFound(err) {
		return nil
	}

	if err != nil {
		return err
	}

	return nil
}
