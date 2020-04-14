package deployer

import (
	"github.com/imdario/mergo"
	k8sErrors "k8s.io/apimachinery/pkg/api/errors"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

type Deploy struct {
	*Resource
}

func NewDeploy(resource *Resource) *Deploy {
	return &Deploy{Resource: resource}
}

func (deploy *Deploy) Do() error {
	if deploy.ForceUpdate {
		return deploy.createOrUpdateResource()
	}

	err := deploy.createResource()
	if deploy.isAlreadyExistsByError(err) {
		return nil
	}

	return err
}

func (deploy *Deploy) createOrUpdateResource() error {
	err := deploy.createResource()
	if deploy.isAlreadyExistsByError(err) {
		err = deploy.updateResource()
	}

	if err != nil {
		return err
	}

	return nil
}

func (deploy *Deploy) isAlreadyExistsByError(err error) bool {
	if err != nil && k8sErrors.IsAlreadyExists(err) {
		return true
	}

	return false
}

func (deploy *Deploy) createResource() error {
	client, err := deploy.Config.GetClient()
	if err != nil {
		return err
	}

	resourceSchema := getResourceSchemaByManifest(deploy.Manifest)
	k8sResource := client.Resource(resourceSchema)
	namespace := deploy.Namespace

	_, err = k8sResource.Namespace(namespace).Create(deploy.Manifest, metav1.CreateOptions{})
	if err != nil {
		return err
	}

	return nil
}

func (deploy *Deploy) updateResource() error {
	client, err := deploy.Config.GetClient()
	if err != nil {
		return err
	}

	resourceSchema := getResourceSchemaByManifest(deploy.Manifest)
	k8sResource := client.Resource(resourceSchema)
	name := deploy.Manifest.GetName()
	namespace := deploy.Namespace

	resource, err := k8sResource.Namespace(namespace).Get(name, metav1.GetOptions{})
	if err != nil {
		return err
	}

	err = mergo.Merge(&resource.Object, deploy.Manifest.Object, mergo.WithOverride)
	if err != nil {
		return err
	}

	_, err = k8sResource.Namespace(namespace).Update(resource, metav1.UpdateOptions{})
	if err != nil {
		return err
	}

	return nil
}
