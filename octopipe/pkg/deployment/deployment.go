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
	"octopipe/pkg/customerror"
	"os"
	"strconv"
	"time"

	"github.com/argoproj/gitops-engine/pkg/health"
	"github.com/argoproj/gitops-engine/pkg/utils/kube"
	"k8s.io/client-go/rest"
	"k8s.io/kubectl/pkg/cmd/util"

	k8sErrors "k8s.io/apimachinery/pkg/api/errors"
	"k8s.io/apimachinery/pkg/apis/meta/v1/unstructured"
)

const (
	DeployAction   = "DEPLOY"
	UndeployAction = "UNDEPLOY"
)

type UseCases interface {
	Do() error
	NewWatcher() error
	Deploy() error
	Undeploy() error
}

type Deployment struct {
	action    string
	update    bool
	namespace string
	manifest  map[string]interface{}
	config    *rest.Config
	kubectl   kube.Kubectl
}

func (main *DeploymentMain) NewDeployment(
	action string,
	update bool,
	namespace string,
	manifest map[string]interface{},
	config *rest.Config,
	kubectl kube.Kubectl,
) UseCases {
	return &Deployment{
		action:    action,
		update:    update,
		namespace: namespace,
		manifest:  manifest,
		config:    config,
		kubectl:   kubectl,
	}
}

func (deployment *Deployment) Do() error {
	switch deployment.action {
	case DeployAction:
		return deployment.watchDeploy()
	case UndeployAction:
		return deployment.Undeploy()
	default:
		return customerror.New("Deploy action failed", "Not recognize deploy action", nil, "deployment.Do")
	}
}

func getTimeoutDuration() time.Duration {
	defaultValue := time.Duration(300)
	envStr := os.Getenv("TIMEOUT_RESOURCE_VERIFICATION")
	if envStr == "" {
		return defaultValue
	}

	value, err := strconv.Atoi(envStr)
	if err != nil {
		return defaultValue
	}

	return time.Duration(value)
}

func (deployment *Deployment) NewWatcher() error {
	manifest := deployment.getUnstructuredManifest()
	ticker := time.NewTicker(3 * time.Second)
	timeout := time.After(getTimeoutDuration() * time.Second)
	for {
		select {
		case <-timeout:
			ticker.Stop()
			return customerror.New(
				"Resource watch failed",
				"Timeout",
				map[string]string{
					"resourceName":     manifest.GetName(),
					"groupVersionKind": manifest.GroupVersionKind().String(),
				},
				"deployment.newWatcher.timeout",
			)
		case <-ticker.C:

			gvk := manifest.GroupVersionKind()

			resource, err := deployment.kubectl.GetResource(context.TODO(), deployment.config, gvk, manifest.GetName(), deployment.namespace)
			if err != nil {
				return customerror.New(
					"Resource watch failed",
					err.Error(),
					map[string]string{
						"resourceName":     manifest.GetName(),
						"groupVersionKind": manifest.GroupVersionKind().String(),
					},
					"deployment.newWatcher.GetResource",
				)
			}

			if resource != nil {
				if !isResourController(resource) {
					ticker.Stop()
					return nil
				}

				healthStatus, err := health.GetResourceHealth(resource, nil)
				if err != nil {
					ticker.Stop()
					return customerror.New(
						"Resource watch failed",
						err.Error(),
						map[string]string{
							"resourceName":     manifest.GetName(),
							"groupVersionKind": manifest.GroupVersionKind().String(),
						},
						"deployment.newWatcher.GetResourceHealth",
					)
				}

				if healthStatus != nil && healthStatus.Status == health.HealthStatusHealthy {
					ticker.Stop()
					return nil
				}
			}
		}
	}
}

func (deployment *Deployment) watchDeploy() error {
	err := deployment.Deploy()
	if err != nil {
		return customerror.WithOperation(err, "deployment.deploy.Deploy")
	}

	err = deployment.NewWatcher()
	if err != nil {
		return customerror.WithOperation(err, "deployment.deploy.NewWatcher")
	}

	return nil
}

func (deployment *Deployment) Deploy() error {
	manifest := deployment.getUnstructuredManifest()

	_, err := deployment.kubectl.ApplyResource(
		context.TODO(),
		deployment.config,
		manifest,
		deployment.namespace,
		util.DryRunNone,
		true,
		false,
	)

	if err != nil {
		return customerror.New(
			"Deploy failed",
			err.Error(),
			map[string]string{
				"resourceName":     manifest.GetName(),
				"groupVersionKind": manifest.GroupVersionKind().String(),
			},
			"deployment.deploy.ApplyResource",
		)
	}

	return deployment.NewWatcher()
}

func isResourController(resource *unstructured.Unstructured) bool {
	if resource == nil {
		return false
	}

	_, isRsourceController, _ := unstructured.NestedInt64(resource.Object, "spec", "replicas")
	return isRsourceController
}

func (deployment *Deployment) Undeploy() error {
	manifest := deployment.getUnstructuredManifest()
	gvk := manifest.GroupVersionKind()

	resourceInCluster, err := deployment.kubectl.GetResource(context.TODO(), deployment.config, gvk, manifest.GetName(), deployment.namespace)
	if err != nil && k8sErrors.IsNotFound(err) {
		return nil
	}

	if err != nil {
		return customerror.New(
			"Undeploy failed",
			err.Error(),
			map[string]string{
				"resourceName":     manifest.GetName(),
				"groupVersionKind": manifest.GroupVersionKind().String(),
			},
			"deployment.undeploy.GetResource",
		)
	}

	if !isResourController(resourceInCluster) {
		return nil
	}

	err = deployment.kubectl.DeleteResource(context.TODO(), deployment.config, gvk, manifest.GetName(), deployment.namespace, true)
	if err != nil && k8sErrors.IsNotFound(err) {
		return nil
	}

	if err != nil {
		return customerror.New(
			"Undeploy failed",
			err.Error(),
			map[string]string{
				"resourceName":     manifest.GetName(),
				"groupVersionKind": manifest.GroupVersionKind().String(),
			},
			"deployment.undeploy.DeleteResource",
		)
	}

	return nil
}

func (deployment *Deployment) getUnstructuredManifest() *unstructured.Unstructured {
	return &unstructured.Unstructured{
		Object: deployment.manifest,
	}
}
