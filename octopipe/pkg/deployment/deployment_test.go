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
	"fmt"
	"log"
	"os"
	"strings"
	"testing"

	"k8s.io/apimachinery/pkg/apis/meta/v1/unstructured"

	k8sErrors "k8s.io/apimachinery/pkg/api/errors"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/apimachinery/pkg/runtime/schema"
	"k8s.io/client-go/dynamic/fake"
	"k8s.io/client-go/kubernetes/scheme"
)

var deploymentMain = NewDeploymentMain()
var deploymentRes = schema.GroupVersionResource{Group: "apps", Version: "v1", Resource: "deployments"}
var simpleManifest = `
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
`

var simpleManifestForUpdate = `
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
        image: nginx:1.14.1
        ports:
          - containerPort: 80
`

var simpleManifestForRedeploy = `
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
        image: nginx:1.14.1
        ports:
        - containerPort: 80
status:
  replicas: 1
  unavailableReplicas: 1
`

var simpleManifestRunning = `
apiVersion: apps/v1
kind: Deployment
metadata: 
  finalizers: 
    - deleteForeground
  labels: 
    app: nginx
  name: nginx-deployment
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
        - 
          image: "nginx:1.14.1"
          name: nginx
          ports: 
          - containerPort: 80
status:
  replicas: 1
  availableReplicas: 1
`

func toJSON(manifest string) map[string]interface{} {
	decode := scheme.Codecs.UniversalDeserializer().Decode
	obj, _, err := decode([]byte(manifest), nil, nil)
	if err != nil {
		log.Fatal(fmt.Sprintf("Error while decoding YAML object. Err was: %s", err))
	}

	unstructuredObj, err := runtime.DefaultUnstructuredConverter.ToUnstructured(obj)
	if err != nil {
		log.Fatal(err)
	}

	return unstructuredObj
}

func TestActionFailed(t *testing.T) {
	scheme := runtime.NewScheme()
	client := fake.NewSimpleDynamicClient(scheme)

	deployment := deploymentMain.NewDeployment(
		"fake",
		false,
		"default",
		toJSON(simpleManifest),
		client,
	)

	err := deployment.Do()
	if err != nil && !strings.Contains(err.Error(), "Failed to execute deployment") {
		t.Error(err)
	}

}

func TestCreateResource(t *testing.T) {
	scheme := runtime.NewScheme()
	client := fake.NewSimpleDynamicClient(scheme)

	deployment := deploymentMain.NewDeployment(
		DeployAction,
		false,
		"default",
		toJSON(simpleManifest),
		client,
	)

	err := deployment.Do()
	if err != nil {
		t.Fatal(err)
	}

	_, err = client.Resource(deploymentRes).Namespace("default").Get(context.TODO(), "nginx-deployment", metav1.GetOptions{})
	if err != nil {
		t.Error(err)
	}

	client.Fake.ClearActions()
}

func TestUpdateResource(t *testing.T) {
	scheme := runtime.NewScheme()
	client := fake.NewSimpleDynamicClient(scheme)

	unstructuredObj := &unstructured.Unstructured{
		Object: toJSON(simpleManifest),
	}

	deployment := deploymentMain.NewDeployment(
		DeployAction,
		false,
		"default",
		toJSON(simpleManifestRunning),
		client,
	)

	_, err := client.Resource(deploymentRes).Namespace("default").Create(context.TODO(), unstructuredObj, metav1.CreateOptions{})
	if err != nil {
		t.Error(err)
	}

	os.Setenv("TIMEOUT_RESOURCE_VERIFICATION", "1")

	err = deployment.Do()
	if err != nil {
		t.Error(err)
	}
}

func TestUndeployResourceControllerSuccess(t *testing.T) {
	scheme := runtime.NewScheme()
	client := fake.NewSimpleDynamicClient(scheme)

	unstructuredObj := &unstructured.Unstructured{
		Object: toJSON(simpleManifestRunning),
	}

	deployment := deploymentMain.NewDeployment(
		UndeployAction,
		false,
		"default",
		toJSON(simpleManifestRunning),
		client,
	)

	_, err := client.Resource(deploymentRes).Namespace("default").Create(context.TODO(), unstructuredObj, metav1.CreateOptions{})
	if err != nil {
		t.Error(err)
	}

	os.Setenv("TIMEOUT_RESOURCE_VERIFICATION", "1")

	err = deployment.Do()
	if err != nil {
		t.Error(err)
	}

	_, err = client.Resource(deploymentRes).Namespace("default").Get(context.TODO(), "nginx-deployment", metav1.GetOptions{})
	if err != nil && !k8sErrors.IsNotFound(err) {
		t.Error(err)
	}

}

func TestUndeployNonResourceControllerSuccess(t *testing.T) {
	scheme := runtime.NewScheme()
	client := fake.NewSimpleDynamicClient(scheme)

	unstructuredObj := &unstructured.Unstructured{
		Object: toJSON(simpleManifest),
	}

	deployment := deploymentMain.NewDeployment(
		UndeployAction,
		false,
		"default",
		toJSON(simpleManifest),
		client,
	)

	_, err := client.Resource(deploymentRes).Namespace("default").Create(context.TODO(), unstructuredObj, metav1.CreateOptions{})
	if err != nil {
		t.Error(err)
	}

	os.Setenv("TIMEOUT_RESOURCE_VERIFICATION", "1")

	err = deployment.Do()
	if err != nil {
		t.Error(err)
	}

	_, err = client.Resource(deploymentRes).Namespace("default").Get(context.TODO(), "nginx-deployment", metav1.GetOptions{})
	if err != nil && !k8sErrors.IsNotFound(err) {
		t.Error(err)
	}

}

func TestUndeployIfNotExist(t *testing.T) {
	scheme := runtime.NewScheme()
	client := fake.NewSimpleDynamicClient(scheme)

	deployment := deploymentMain.NewDeployment(
		UndeployAction,
		false,
		"default",
		toJSON(simpleManifestForUpdate),
		client,
	)

	err := deployment.Do()
	if err != nil {
		t.Error(err)
	}

	_, err = client.Resource(deploymentRes).Namespace("default").Get(context.TODO(), "nginx-deployment", metav1.GetOptions{})
	if err != nil && !k8sErrors.IsNotFound(err) {
		t.Error(err)
	}

}
