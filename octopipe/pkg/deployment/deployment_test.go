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
	"k8s.io/apimachinery/pkg/runtime/schema"
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
