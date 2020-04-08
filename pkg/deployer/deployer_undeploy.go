package deployer

import (
	k8sErrors "k8s.io/apimachinery/pkg/api/errors"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

const (
	permitedUndeployResource = "deployments"
)

type Undeploy struct {
	*Resource
}

func NewUndeploy(resource *Resource) *Undeploy {
	return &Undeploy{Resource: resource}
}

func (undeploy *Undeploy) Do() error {
	client, err := undeploy.Config.GetClient()
	if err != nil {
		return err
	}

	resourceSchema := getResourceSchemaByManifest(undeploy.Manifest)
	if resourceSchema.Resource != permitedUndeployResource {
		return nil
	}

	k8sResource := client.Resource(resourceSchema)
	namespace := undeploy.Manifest.GetNamespace()
	name := undeploy.Manifest.GetName()
	deletePolicy := metav1.DeletePropagationForeground
	deleteOptions := &metav1.DeleteOptions{
		PropagationPolicy: &deletePolicy,
	}

	err = k8sResource.Namespace(namespace).Delete(name, deleteOptions)
	if err != nil && k8sErrors.IsNotFound(err) {
		return nil
	}

	if err != nil {
		return err
	}

	return nil
}
