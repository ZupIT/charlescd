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
	"fmt"
	"strings"

	"k8s.io/apimachinery/pkg/apis/meta/v1/unstructured"
	"k8s.io/apimachinery/pkg/runtime/schema"
)

func ToUnstructured(manifest map[string]interface{}) *unstructured.Unstructured {
	return &unstructured.Unstructured{
		Object: manifest,
	}
}

func getResourceSchemaByManifest(manifest *unstructured.Unstructured) schema.GroupVersionResource {
	group := manifest.GroupVersionKind().Group
	version := manifest.GroupVersionKind().Version
	resource := fmt.Sprintf("%ss", strings.ToLower(manifest.GroupVersionKind().Kind))
	return schema.GroupVersionResource{Group: group, Version: version, Resource: resource}
}
