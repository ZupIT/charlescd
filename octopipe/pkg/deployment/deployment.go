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

package deployment

import (
	"context"
	"errors"
	"fmt"
	"strings"

	"github.com/imdario/mergo"
	log "github.com/sirupsen/logrus"

	k8sErrors "k8s.io/apimachinery/pkg/api/errors"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/apis/meta/v1/unstructured"
	"k8s.io/apimachinery/pkg/runtime/schema"
	"k8s.io/client-go/dynamic"
	"k8s.io/client-go/util/retry"
)

const (
	DeployAction   = "DEPLOY"
	UndeployAction = "UNDEPLOY"
)

type UseCases interface {
	Do() error
}

type Deployment struct {
	action    string
	update    bool
	namespace string
	manifest  map[string]interface{}
	config    dynamic.Interface
}

func (main *DeploymentMain) NewDeployment(
	action string,
	update bool,
	namespace string,
	manifest map[string]interface{},
	config dynamic.Interface,
) UseCases {
	return &Deployment{action, update, namespace, manifest, config}
}

func (deployment *Deployment) Do() error {

	switch deployment.action {
	case DeployAction:
		return deployment.deploy()
	case UndeployAction:
		return deployment.undeploy()
	default:
		return errors.New("Failed to execute deployment")
	}
}

func (deployment *Deployment) createResource(manifest *unstructured.Unstructured, resourceInterface dynamic.ResourceInterface) error {
	_, err := resourceInterface.Create(context.TODO(), manifest, metav1.CreateOptions{})
	if err != nil {
		return deployment.getDeploymentError("Failed to create resource in cluster", err, manifest)
	}

	err = newCreateOrUpdateWatcher(manifest, resourceInterface)
	if err != nil {
		return deployment.getDeploymentError("Failed to create resource", err, manifest)
	}

	return nil
}

func (deployment *Deployment) updateResource(
	resource *unstructured.Unstructured,
	manifest *unstructured.Unstructured,
	resourceInterface dynamic.ResourceInterface,
) error {
	retryErr := retry.RetryOnConflict(retry.DefaultRetry, func() error {
		err := mergo.Merge(&resource.Object, manifest.Object, mergo.WithOverride)
		if err != nil {
			return deployment.getDeploymentError("Failed to merge between the existing resource and the new resource", err, manifest)
		}

		_, err = resourceInterface.Update(context.TODO(), resource, metav1.UpdateOptions{})
		if err != nil {
			return deployment.getDeploymentError("Failed to update resource in cluster", err, manifest)
		}

		log.WithFields(log.Fields{"resource": resource.GetName()}).Info("Retry update...")

		return nil
	})

	if retryErr != nil {
		return deployment.getDeploymentError("Failed to retry update deployment", retryErr, manifest)
	}

	log.WithFields(log.Fields{"resource": resource.GetName()}).Info("Retry success...")

	err := newCreateOrUpdateWatcher(manifest, resourceInterface)
	if err != nil {
		return deployment.getDeploymentError("Update failed", err, manifest)
	}

	return nil
}

func (deployment *Deployment) deploy() error {
	manifest := deployment.getUnstructuredManifest()
	resourceSchema := deployment.getResourceSchemaByManifest(manifest)
	resourceInterface := deployment.config.Resource(resourceSchema).Namespace(deployment.namespace)

	resourceInCluster, err := resourceInterface.Get(context.TODO(), manifest.GetName(), metav1.GetOptions{})
	if err != nil && k8sErrors.IsNotFound(err) {
		return deployment.createResource(manifest, resourceInterface)
	}

	if err != nil {
		return deployment.getDeploymentError("Failed to get resource in deploy", err, manifest)
	}

	return deployment.updateResource(resourceInCluster, manifest, resourceInterface)
}

func (deployment *Deployment) undeploy() error {
	manifest := deployment.getUnstructuredManifest()
	resourceSchema := deployment.getResourceSchemaByManifest(manifest)
	resourceInterface := deployment.config.Resource(resourceSchema).Namespace(deployment.namespace)

	resourceInCluster, err := resourceInterface.Get(context.TODO(), manifest.GetName(), metav1.GetOptions{})
	if err != nil && k8sErrors.IsNotFound(err) {
		return nil
	}

	if !isResourController(resourceInCluster) {
		return nil
	}

	deletePolicy := metav1.DeletePropagationBackground
	gracefullPeriod := 1
	deleteOptions := *metav1.NewDeleteOptions(int64(gracefullPeriod))
	deleteOptions.PropagationPolicy = &deletePolicy

	err = resourceInterface.Delete(context.TODO(), manifest.GetName(), deleteOptions)
	if err != nil && k8sErrors.IsNotFound(err) {
		return nil
	}

	if err != nil {
		return deployment.getDeploymentError("Failed to delete resource", err, manifest)
	}

	return nil
}

func (deployment *Deployment) getUnstructuredManifest() *unstructured.Unstructured {
	return &unstructured.Unstructured{
		Object: deployment.manifest,
	}
}

func (deployment *Deployment) getResourceSchemaByManifest(manifest *unstructured.Unstructured) schema.GroupVersionResource {
	group := manifest.GroupVersionKind().Group
	version := manifest.GroupVersionKind().Version
	resource := fmt.Sprintf("%ss", strings.ToLower(manifest.GroupVersionKind().Kind))
	return schema.GroupVersionResource{Group: group, Version: version, Resource: resource}
}

func (deployment *Deployment) getDeploymentError(message string, err error, manifest *unstructured.Unstructured) error {
	res, _ := manifest.MarshalJSON()

	log.WithFields(log.Fields{"error": err.Error(), "resource": string(res)}).Error(message)
	return err
}
