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
	"os"
	"strings"
	"testing"

	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/apis/meta/v1/unstructured"

	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/client-go/dynamic/fake"
)

var simpleWatchManifestFailed = `
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80
status:
  replicas: 1
  availableReplicas: 1
  unavailableReplicas: 1
`

var simpleWatchManifestSuccess = `
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80
status:
  replicas: 1
  availableReplicas: 1
`

func TestNewWatcherTimeout(t *testing.T) {
	scheme := runtime.NewScheme()
	client := fake.NewSimpleDynamicClient(scheme)
	unstructuredObj := &unstructured.Unstructured{
		Object: toJSON(simpleWatchManifestFailed),
	}

	_, err := client.Resource(deploymentRes).Namespace("default").Create(context.TODO(), unstructuredObj, metav1.CreateOptions{})
	if err != nil {
		t.Error(err)
	}

	os.Setenv("TIMEOUT_RESOURCE_VERIFICATION", "1")

	err = newCreateOrUpdateWatcher(unstructuredObj, client.Resource(deploymentRes).Namespace("default"))
	if err != nil && !strings.Contains(err.Error(), "timeout") {
		t.Error(err)
	}
}

func TestNewWatcherSuccess(t *testing.T) {
	scheme := runtime.NewScheme()
	client := fake.NewSimpleDynamicClient(scheme)
	unstructuredObj := &unstructured.Unstructured{
		Object: toJSON(simpleWatchManifestSuccess),
	}

	_, err := client.Resource(deploymentRes).Namespace("default").Create(context.TODO(), unstructuredObj, metav1.CreateOptions{})
	if err != nil {
		t.Error(err)
	}

	os.Setenv("TIMEOUT_RESOURCE_VERIFICATION", "1")

	err = newCreateOrUpdateWatcher(unstructuredObj, client.Resource(deploymentRes).Namespace("default"))
	if err != nil {
		t.Error(err)
	}
}

func TestNewWatcherEnvError(t *testing.T) {
	scheme := runtime.NewScheme()
	client := fake.NewSimpleDynamicClient(scheme)
	unstructuredObj := &unstructured.Unstructured{
		Object: toJSON(simpleManifest),
	}

	_, err := client.Resource(deploymentRes).Namespace("default").Create(context.TODO(), unstructuredObj, metav1.CreateOptions{})
	if err != nil {
		t.Error(err)
	}

	os.Setenv("TIMEOUT_RESOURCE_VERIFICATION", "test")

	err = newCreateOrUpdateWatcher(unstructuredObj, client.Resource(deploymentRes).Namespace("default"))
	if err != nil {
		t.Error(err)
	}
}
