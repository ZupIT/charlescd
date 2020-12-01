interface K8sObect<T> {
  [key: string]: T
}

type Spec = K8sObect<string | K8sObect<string>>

interface DeploymentHookRequest {
  controller: string
  parent: Spec  // Are we typing the k8s object?
  // child obect example
  // {
  //   "Pod.v1": {
  //     "pod-name-1": {},
  //     "pod-name-2": {}
  //   },
  //   "Deployment.v1": {
  //     "deployment-1": {},
  //     "deployment-2": {}
  //   }
  // }
  children: { 'Pod.v1': Spec }
  finalizing: boolean // defaults to false
}


// If the response status is not 200 metacontroller wont apply our desired changes, maybe we can use this behaviour to wait for deployments healthchecks before applying the routes CRD
interface DeploymentHookResponse {
  status: Record<string, string> // we can put any object that we want on the CRDs status field
  children: Spec[] // array of k8s manifests that we want metacontroller to apply on the cluster
}
