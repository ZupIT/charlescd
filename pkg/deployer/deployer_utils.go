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
