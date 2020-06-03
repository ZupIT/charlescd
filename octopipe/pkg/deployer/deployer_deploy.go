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
	"errors"
	"os"
	"strconv"
	"time"

	"github.com/imdario/mergo"
	k8sErrors "k8s.io/apimachinery/pkg/api/errors"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/apis/meta/v1/unstructured"
	"k8s.io/apimachinery/pkg/runtime/schema"
	"k8s.io/client-go/dynamic"
)

type Deploy struct {
	*Resource
}

func NewDeploy(resource *Resource) *Deploy {
	return &Deploy{Resource: resource}
}

func (deploy *Deploy) Do() error {
	if deploy.ForceUpdate {
		return deploy.updateResource()
	}

	err := deploy.createResource()
	if err != nil && k8sErrors.IsAlreadyExists(err) {
		return nil
	}

	return err
}

func (deploy *Deploy) updateResource() error {
	client, err := deploy.Config.GetClient()
	if err != nil {
		return err
	}

	resourceSchema := getResourceSchemaByManifest(deploy.Manifest)
	k8sResource := client.Resource(resourceSchema)
	name := deploy.Manifest.GetName()
	namespace := deploy.Namespace

	resource, err := k8sResource.Namespace(namespace).Get(name, metav1.GetOptions{})
	if err != nil {
		return deploy.createResource()
	}

	mergo.Merge(&resource.Object, deploy.Manifest.Object, mergo.WithOverride)
	_, err = client.Resource(resourceSchema).Namespace(namespace).Update(resource, metav1.UpdateOptions{})
	if err != nil {
		return err
	}

	return nil
}

func (deploy *Deploy) createResource() error {
	client, err := deploy.Config.GetClient()
	if err != nil {
		return err
	}

	resourceSchema := getResourceSchemaByManifest(deploy.Manifest)
	k8sResource := client.Resource(resourceSchema)
	resource := k8sResource.Namespace(deploy.Namespace)

	_, err = resource.Create(deploy.Manifest, metav1.CreateOptions{})

	err = deploy.newResourceVerification(resource, resourceSchema)
	if err != nil {
		return err
	}

	if err != nil {
		return err
	}

	return nil
}

func (deploy *Deploy) newResourceVerification(resource dynamic.ResourceInterface, schema schema.GroupVersionResource) error {
	clusterItem, err := resource.Get(deploy.Manifest.GetName(), metav1.GetOptions{})
	if err != nil {
		return err
	}

	replicas, found, _ := unstructured.NestedInt64(clusterItem.Object, "spec", "replicas")
	if !found {
		return nil
	}

	err = deploy.asyncStartResourceVerification(resource, deploy.Manifest.GetName(), int(replicas))
	if err != nil {
		return err
	}

	return nil
}

func (deploy *Deploy) asyncStartResourceVerification(resource dynamic.ResourceInterface, name string, replicas int) error {
	timeout := make(chan struct{})
	done := make(chan struct{})

	go deploy.startTimer(timeout, done)

	err := deploy.startReplicasVerification(resource, replicas, name, done, timeout)
	if err != nil {
		return err
	}

	return nil
}

func (deploy *Deploy) startTimer(timeout chan<- struct{}, done <-chan struct{}) {
	for {
		resourceVerificationTime, _ := strconv.Atoi(os.Getenv("TIMEOUT_RESOURCE_VERIFICATION"))
		select {
		case <-time.After(time.Duration(resourceVerificationTime) * time.Second):
			timeout <- struct{}{}
		case <-done:
			return
		}
	}
}

func (deploy *Deploy) startReplicasVerification(
	resource dynamic.ResourceInterface, replicas int, name string, done chan<- struct{}, timeout <-chan struct{},
) error {
	ticker := time.NewTicker(1 * time.Second)
	for {
		select {
		case <-ticker.C:
			availableReplicas, err := deploy.getAvailableReplicasByName(resource, name)
			if err != nil {
				return err
			}
			if availableReplicas == replicas {
				done <- struct{}{}
				return nil
			}
		case <-timeout:
			return errors.New("Timeout resource verification")
		}
	}
}

func (deploy *Deploy) getAvailableReplicasByName(resource dynamic.ResourceInterface, name string) (int, error) {
	clusterItem, err := resource.Get(deploy.Manifest.GetName(), metav1.GetOptions{})
	if err != nil {
		return 0, err
	}

	availableReplicas, statusFound, _ := unstructured.NestedInt64(clusterItem.Object, "status", "availableReplicas")
	if !statusFound {
		return 0, nil
	}

	return int(availableReplicas), nil
}
