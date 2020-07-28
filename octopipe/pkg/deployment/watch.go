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
	"os"
	"strconv"
	"time"

	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/apis/meta/v1/unstructured"
	"k8s.io/client-go/dynamic"
)

func getTimeoutDuration() time.Duration {
	defaultValue := time.Duration(100)
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

func isResourController(resource *unstructured.Unstructured) bool {
	_, isRsourceController, _ := unstructured.NestedInt64(resource.Object, "status", "replicas")
	return isRsourceController
}

func getReplicasByResourceControllet(resource *unstructured.Unstructured) int64 {
	replicas, _, _ := unstructured.NestedInt64(resource.Object, "status", "replicas")
	return replicas
}

func isCreatedOrUpdatedResourceController(resource *unstructured.Unstructured) bool {
	availableReplicas, found, _ := unstructured.NestedInt64(resource.Object, "status", "availableReplicas")
	_, foundUnavailableReplicas, _ := unstructured.NestedInt64(resource.Object, "status", "unavailableReplicas")
	return found && int64(availableReplicas) == getReplicasByResourceControllet(resource) && !foundUnavailableReplicas
}

func newCreateOrUpdateWatcher(manifest *unstructured.Unstructured, resourceInterface dynamic.ResourceInterface) error {
	ticker := time.NewTicker(500 * time.Millisecond)
	timeout := time.After(getTimeoutDuration() * time.Second)
	for {
		select {
		case <-timeout:
			ticker.Stop()
			return errors.New("create or update timeout")
		case <-ticker.C:
			resource, err := resourceInterface.Get(context.TODO(), manifest.GetName(), metav1.GetOptions{})
			if err != nil {
				return err
			}

			if !isResourController(resource) {
				ticker.Stop()
				return nil
			}

			if isCreatedOrUpdatedResourceController(resource) {
				ticker.Stop()
				return nil
			}
		}
	}
}
