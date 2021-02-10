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
	"github.com/argoproj/gitops-engine/pkg/health"
	"github.com/argoproj/gitops-engine/pkg/utils/kube"
	"k8s.io/client-go/rest"
	"k8s.io/kubectl/pkg/cmd/util"
	"os"
	"strconv"
	"time"

	log "github.com/sirupsen/logrus"

	k8sErrors "k8s.io/apimachinery/pkg/api/errors"
	"k8s.io/apimachinery/pkg/apis/meta/v1/unstructured"
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
		return deployment.deploy()
	case UndeployAction:
		return deployment.undeploy()
	default:
		return errors.New("Failed to execute deployment")
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

func (deployment *Deployment) newWatcher(manifest *unstructured.Unstructured) error {
	ticker := time.NewTicker(3 * time.Second)
	timeout := time.After(getTimeoutDuration() * time.Second)
	for {
		select {
		case <-timeout:
			ticker.Stop()
			return errors.New("create or update timeout")
		case <-ticker.C:

			gvk := manifest.GroupVersionKind()

			resource, err := deployment.kubectl.GetResource(context.TODO(), deployment.config, gvk, manifest.GetName(), deployment.namespace)
			if err != nil {
				return err
			}

			if resource != nil {
				healthStatus, err := health.GetResourceHealth(resource, nil)
				if err != nil {
					ticker.Stop()
					return err
				}

				if healthStatus != nil && healthStatus.Status == health.HealthStatusHealthy {
					ticker.Stop()
					return nil
				}
			}
		}
	}
}

func (deployment *Deployment) deploy() error {
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
		return err
	}

	err = deployment.newWatcher(manifest)
	if err != nil {
		return deployment.getDeploymentError("Watch failed", err, manifest)
	}

	return nil
}
func isResourController(resource *unstructured.Unstructured) bool {
	if resource == nil {
		return false
	}

	_, isRsourceController, _ := unstructured.NestedInt64(resource.Object, "status", "replicas")
	return isRsourceController
}

func (deployment *Deployment) undeploy() error {
	manifest := deployment.getUnstructuredManifest()
	gvk := manifest.GroupVersionKind()

	resourceInCluster, err := deployment.kubectl.GetResource(context.TODO(), deployment.config, gvk, manifest.GetName(), deployment.namespace)
	if err != nil && k8sErrors.IsNotFound(err) {
		return nil
	}

	if err != nil {
		return err
	}

	if !isResourController(resourceInCluster) {
		return nil
	}

	err = deployment.kubectl.DeleteResource(context.TODO(), deployment.config, gvk, manifest.GetName(), deployment.namespace, false)
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

func (deployment *Deployment) getDeploymentError(message string, err error, manifest *unstructured.Unstructured) error {
	res, _ := manifest.MarshalJSON()

	log.WithFields(log.Fields{"error": err.Error(), "resource": string(res)}).Error(message)
	return err
}
