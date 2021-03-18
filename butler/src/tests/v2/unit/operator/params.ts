import { HookParams } from '../../../../app/v2/operator/params.interface'

export const reconcileFixtures = {
  currentDeploymentId: '8210509b-2432-4e2c-bfc3-af01be918816',
  previousDeploymentId: '7c182579-7e69-414b-aae9-000a471b5549'
}

const previousDeploymentparams : HookParams = {
  'controller': {
    'kind': 'CompositeController',
    'apiVersion': 'metacontroller.k8s.io/v1alpha1',
    'metadata': {
      'name': 'charlesdeployments-controller',
      'uid': 'a486b001-f635-4c40-b807-6f725953a07e',
      'resourceVersion': '832',
      'generation': 1,
      'creationTimestamp': '2021-01-15T19:48:24Z',
      'labels': {
        'app.kubernetes.io/managed-by': 'Helm'
      },
      'annotations': {
        'meta.helm.sh/release-name': 'charlescd',
        'meta.helm.sh/release-namespace': 'default'
      }
    },
    'spec': {
      'parentResource': {
        'apiVersion': 'charlescd.io/v1',
        'resource': 'charlesdeployments'
      },
      'childResources': [
        {
          'apiVersion': 'v1',
          'resource': 'services',
          'updateStrategy': {
            'method': 'Recreate',
            'statusChecks': {}
          }
        },
        {
          'apiVersion': 'apps/v1',
          'resource': 'deployments',
          'updateStrategy': {
            'method': 'Recreate',
            'statusChecks': {}
          }
        }
      ],
      'hooks': {
        'sync': {
          'webhook': {
            'url': 'http://charlescd-butler.default.svc.cluster.local:3000/v2/operator/deployment/hook/reconcile'
          }
        },
        'finalize': {
          'webhook': {
            'url': 'http://charlescd-butler.default.svc.cluster.local:3000/v2/operator/deployment/hook/finalize'
          }
        }
      },
      'generateSelector': true
    },
    'status': {}
  },
  'parent': {
    'apiVersion': 'charlescd.io/v1',
    'kind': 'CharlesDeployment',
    'metadata': {
      'creationTimestamp': '2021-01-15T20:59:17Z',
      'finalizers': [
        'metacontroller.app/compositecontroller-charlesdeployments-controller'
      ],
      'generation': 3,
      'labels': {
        'deployment_id': reconcileFixtures.currentDeploymentId
      },
      'name': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60',
      'namespace': 'default',
      'resourceVersion': '10537',
      'uid': '5c6e0a99-f05b-4198-8499-469fa34f755b'
    },
    'spec': {
      'circleId': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60',
      'components': [
        {
          'chart': 'http://fake-repo/repos/charlescd-fake/helm-chart',
          'name': 'abobora',
          'tag': 'latest'
        },
        {
          'chart': 'http://fake-repo/repos/charlescd-fake/helm-chart',
          'name': 'jilo',
          'tag': 'latest'
        }
      ],
      'deploymentId': reconcileFixtures.currentDeploymentId
    }
  },
  'children': {
    'Deployment.apps/v1': {
      'batata-ed2a1669-34b8-4af2-b42c-acbad2ec6b60': {
        'apiVersion': 'apps/v1',
        'kind': 'Deployment',
        'metadata': {
          'creationTimestamp': '2021-01-15T21:01:22Z',
          'generation': 1,
          'labels': {
            'app': 'batata',
            'circleId': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60',
            'controller-uid': '5c6e0a99-f05b-4198-8499-469fa34f755b',
            'deploymentId': reconcileFixtures.previousDeploymentId,
            'version': 'batata'
          },
          'name': 'batata-ed2a1669-34b8-4af2-b42c-acbad2ec6b60',
          'namespace': 'default',
          'ownerReferences': [
            {
              'apiVersion': 'charlescd.io/v1',
              'blockOwnerDeletion': true,
              'controller': true,
              'kind': 'CharlesDeployment',
              'name': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60',
              'uid': '5c6e0a99-f05b-4198-8499-469fa34f755b'
            }
          ],
          'resourceVersion': '6755',
          'uid': '1127f97a-4288-4dfc-8cc3-6c9a039b26cf'
        },
        'spec': {
          'progressDeadlineSeconds': 600,
          'replicas': 1,
          'revisionHistoryLimit': 10,
          'selector': {
            'matchLabels': {
              'app': 'batata',
              'version': 'batata'
            }
          },
          'strategy': {
            'rollingUpdate': {
              'maxSurge': '25%',
              'maxUnavailable': '25%'
            },
            'type': 'RollingUpdate'
          },
          'template': {
            'metadata': {
              'annotations': {
                'sidecar.istio.io/inject': 'true'
              },
              'creationTimestamp': null,
              'labels': {
                'app': 'batata',
                'version': 'batata'
              }
            },
            'spec': {
              'containers': [
                {
                  'args': [
                    '-text',
                    'hello'
                  ],
                  'image': 'hashicorp/http-echo',
                  'imagePullPolicy': 'Always',
                  'livenessProbe': {
                    'failureThreshold': 3,
                    'httpGet': {
                      'path': '/',
                      'port': 5678,
                      'scheme': 'HTTP'
                    },
                    'initialDelaySeconds': 30,
                    'periodSeconds': 20,
                    'successThreshold': 1,
                    'timeoutSeconds': 1
                  },
                  'name': 'batata',
                  'readinessProbe': {
                    'failureThreshold': 3,
                    'httpGet': {
                      'path': '/',
                      'port': 5678,
                      'scheme': 'HTTP'
                    },
                    'initialDelaySeconds': 30,
                    'periodSeconds': 20,
                    'successThreshold': 1,
                    'timeoutSeconds': 1
                  },
                  'resources': {
                    'limits': {
                      'cpu': '128m',
                      'memory': '128Mi'
                    },
                    'requests': {
                      'cpu': '64m',
                      'memory': '64Mi'
                    }
                  },
                  'terminationMessagePath': '/dev/termination-log',
                  'terminationMessagePolicy': 'File'
                }
              ],
              'dnsPolicy': 'ClusterFirst',
              'restartPolicy': 'Always',
              'schedulerName': 'default-scheduler',
              'securityContext': {},
              'terminationGracePeriodSeconds': 30
            }
          }
        },
        'status': {
          'availableReplicas': 1,
          'conditions': [
            {
              'lastTransitionTime': '2021-01-15T21:02:06Z',
              'lastUpdateTime': '2021-01-15T21:02:06Z',
              'message': 'Deployment has minimum availability.',
              'reason': 'MinimumReplicasAvailable',
              'status': 'True',
              'type': 'Available'
            },
            {
              'lastTransitionTime': '2021-01-15T21:01:22Z',
              'lastUpdateTime': '2021-01-15T21:02:06Z',
              'message': 'ReplicaSet "batata-ed2a1669-34b8-4af2-b42c-acbad2ec6b60-7f7dfc545f" has successfully progressed.',
              'reason': 'NewReplicaSetAvailable',
              'status': 'True',
              'type': 'Progressing'
            }
          ],
          'observedGeneration': 1,
          'readyReplicas': 1,
          'replicas': 1,
          'updatedReplicas': 1
        }
      },
      'jilo-ed2a1669-34b8-4af2-b42c-acbad2ec6b60': {
        'apiVersion': 'apps/v1',
        'kind': 'Deployment',
        'metadata': {
          'creationTimestamp': '2021-01-15T21:01:21Z',
          'generation': 1,
          'labels': {
            'app': 'jilo',
            'circleId': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60',
            'controller-uid': '5c6e0a99-f05b-4198-8499-469fa34f755b',
            'deploymentId': reconcileFixtures.previousDeploymentId,
            'version': 'jilo'
          },
          'name': 'jilo-ed2a1669-34b8-4af2-b42c-acbad2ec6b60',
          'namespace': 'default',
          'ownerReferences': [
            {
              'apiVersion': 'charlescd.io/v1',
              'blockOwnerDeletion': true,
              'controller': true,
              'kind': 'CharlesDeployment',
              'name': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60',
              'uid': '5c6e0a99-f05b-4198-8499-469fa34f755b'
            }
          ],
          'resourceVersion': '6734',
          'uid': 'dfdfa186-2f7b-4e45-b740-0d87c2c0d6bf'
        },
        'spec': {
          'progressDeadlineSeconds': 600,
          'replicas': 1,
          'revisionHistoryLimit': 10,
          'selector': {
            'matchLabels': {
              'app': 'jilo',
              'version': 'jilo'
            }
          },
          'strategy': {
            'rollingUpdate': {
              'maxSurge': '25%',
              'maxUnavailable': '25%'
            },
            'type': 'RollingUpdate'
          },
          'template': {
            'metadata': {
              'annotations': {
                'sidecar.istio.io/inject': 'true'
              },
              'creationTimestamp': null,
              'labels': {
                'app': 'jilo',
                'version': 'jilo'
              }
            },
            'spec': {
              'containers': [
                {
                  'args': [
                    '-text',
                    'hello'
                  ],
                  'image': 'hashicorp/http-echo',
                  'imagePullPolicy': 'Always',
                  'livenessProbe': {
                    'failureThreshold': 3,
                    'httpGet': {
                      'path': '/',
                      'port': 5678,
                      'scheme': 'HTTP'
                    },
                    'initialDelaySeconds': 30,
                    'periodSeconds': 20,
                    'successThreshold': 1,
                    'timeoutSeconds': 1
                  },
                  'name': 'jilo',
                  'readinessProbe': {
                    'failureThreshold': 3,
                    'httpGet': {
                      'path': '/',
                      'port': 5678,
                      'scheme': 'HTTP'
                    },
                    'initialDelaySeconds': 30,
                    'periodSeconds': 20,
                    'successThreshold': 1,
                    'timeoutSeconds': 1
                  },
                  'resources': {
                    'limits': {
                      'cpu': '128m',
                      'memory': '128Mi'
                    },
                    'requests': {
                      'cpu': '64m',
                      'memory': '64Mi'
                    }
                  },
                  'terminationMessagePath': '/dev/termination-log',
                  'terminationMessagePolicy': 'File'
                }
              ],
              'dnsPolicy': 'ClusterFirst',
              'restartPolicy': 'Always',
              'schedulerName': 'default-scheduler',
              'securityContext': {},
              'terminationGracePeriodSeconds': 30
            }
          }
        },
        'status': {
          'availableReplicas': 1,
          'conditions': [
            {
              'lastTransitionTime': '2021-01-15T21:01:56Z',
              'lastUpdateTime': '2021-01-15T21:01:56Z',
              'message': 'Deployment has minimum availability.',
              'reason': 'MinimumReplicasAvailable',
              'status': 'True',
              'type': 'Available'
            },
            {
              'lastTransitionTime': '2021-01-15T21:01:21Z',
              'lastUpdateTime': '2021-01-15T21:01:56Z',
              'message': 'ReplicaSet "jilo-ed2a1669-34b8-4af2-b42c-acbad2ec6b60-76fcc6c494" has successfully progressed.',
              'reason': 'NewReplicaSetAvailable',
              'status': 'True',
              'type': 'Progressing'
            }
          ],
          'observedGeneration': 1,
          'readyReplicas': 1,
          'replicas': 1,
          'updatedReplicas': 1
        }
      }
    },
    'Service.v1': {
      'batata-ed2a1669-34b8-4af2-b42c-acbad2ec6b60': {
        'apiVersion': 'v1',
        'kind': 'Service',
        'metadata': {
          'creationTimestamp': '2021-01-15T21:02:06Z',
          'labels': {
            'app': 'batata',
            'circleId': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60',
            'controller-uid': '5c6e0a99-f05b-4198-8499-469fa34f755b',
            'deploymentId': reconcileFixtures.previousDeploymentId,
            'service': 'batata'
          },
          'name': 'batata-ed2a1669-34b8-4af2-b42c-acbad2ec6b60',
          'namespace': 'default',
          'ownerReferences': [
            {
              'apiVersion': 'charlescd.io/v1',
              'blockOwnerDeletion': true,
              'controller': true,
              'kind': 'CharlesDeployment',
              'name': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60',
              'uid': '5c6e0a99-f05b-4198-8499-469fa34f755b'
            }
          ],
          'resourceVersion': '6763',
          'uid': '1f2aa658-20aa-4a93-9c33-a2f2d2234d21'
        },
        'spec': {
          'clusterIP': '10.97.147.13',
          'clusterIPs': [
            '10.97.147.13'
          ],
          'ports': [
            {
              'name': 'http',
              'port': 80,
              'protocol': 'TCP',
              'targetPort': 80
            }
          ],
          'selector': {
            'app': 'batata'
          },
          'sessionAffinity': 'None',
          'type': 'ClusterIP'
        },
        'status': {
          'loadBalancer': {}
        }
      },
      'jilo-ed2a1669-34b8-4af2-b42c-acbad2ec6b60': {
        'apiVersion': 'v1',
        'kind': 'Service',
        'metadata': {
          'creationTimestamp': '2021-01-15T21:01:21Z',
          'labels': {
            'app': 'jilo',
            'circleId': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60',
            'controller-uid': '5c6e0a99-f05b-4198-8499-469fa34f755b',
            'deploymentId': reconcileFixtures.previousDeploymentId,
            'service': 'jilo'
          },
          'name': 'jilo-ed2a1669-34b8-4af2-b42c-acbad2ec6b60',
          'namespace': 'default',
          'ownerReferences': [
            {
              'apiVersion': 'charlescd.io/v1',
              'blockOwnerDeletion': true,
              'controller': true,
              'kind': 'CharlesDeployment',
              'name': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60',
              'uid': '5c6e0a99-f05b-4198-8499-469fa34f755b'
            }
          ],
          'resourceVersion': '6616',
          'uid': '6f0190a9-2bf0-4531-8adb-0d94ed883c02'
        },
        'spec': {
          'clusterIP': '10.98.248.219',
          'clusterIPs': [
            '10.98.248.219'
          ],
          'ports': [
            {
              'name': 'http',
              'port': 80,
              'protocol': 'TCP',
              'targetPort': 80
            }
          ],
          'selector': {
            'app': 'jilo'
          },
          'sessionAffinity': 'None',
          'type': 'ClusterIP'
        },
        'status': {
          'loadBalancer': {}
        }
      }
    }
  },
  'finalizing': false
}
export const reconcileFixturesParams = {
  paramsWithPreviousDeployment: previousDeploymentparams
}

const firstDeploymentParams: HookParams = {
  'controller': {
    'kind': 'CompositeController',
    'apiVersion': 'metacontroller.k8s.io/v1alpha1',
    'metadata': {
      'name': 'charlesdeployments-controller',
      'uid': '67a4c2e9-4a27-4c8c-8c99-735c96ead809',
      'resourceVersion': '834',
      'generation': 1,
      'creationTimestamp': '2021-01-18T13:29:13Z',
      'labels': {
        'app.kubernetes.io/managed-by': 'Helm'
      },
      'annotations': {
        'meta.helm.sh/release-name': 'charlescd',
        'meta.helm.sh/release-namespace': 'default'
      }
    },
    'spec': {
      'parentResource': {
        'apiVersion': 'charlescd.io/v1',
        'resource': 'charlesdeployments'
      },
      'childResources': [
        {
          'apiVersion': 'v1',
          'resource': 'services',
          'updateStrategy': {
            'method': 'Recreate',
            'statusChecks': {}
          }
        },
        {
          'apiVersion': 'apps/v1',
          'resource': 'deployments',
          'updateStrategy': {
            'method': 'Recreate',
            'statusChecks': {}
          }
        }
      ],
      'hooks': {
        'sync': {
          'webhook': {
            'url': 'http://charlescd-butler.default.svc.cluster.local:3000/v2/operator/deployment/hook/reconcile'
          }
        },
        'finalize': {
          'webhook': {
            'url': 'http://charlescd-butler.default.svc.cluster.local:3000/v2/operator/deployment/hook/finalize'
          }
        }
      },
      'generateSelector': true
    },
    'status': {}
  },
  'parent': {
    'apiVersion': 'charlescd.io/v1',
    'kind': 'CharlesDeployment',
    'metadata': {
      'creationTimestamp': '2021-01-18T13:33:14Z',
      'finalizers': [
        'metacontroller.app/compositecontroller-charlesdeployments-controller'
      ],
      'generation': 1,
      'labels': {
        'deployment_id': 'b1e16c7d-15dd-4e4d-8d4b-d8c73ddf847c'
      },
      'name': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60',
      'namespace': 'default',
      'resourceVersion': '1368',
      'uid': 'aeb60d21-75d8-40d5-8639-9c5623c35921'
    },
    'spec': {
      'circleId': 'ed2a1669-34b8-4af2-b42c-acbad2ec6b60',
      'components': [
        {
          'chart': 'http://fake-repo/repos/charlescd-fake/helm-chart',
          'name': 'batata',
          'tag': 'latest'
        },
        {
          'chart': 'http://fake-repo/repos/charlescd-fake/helm-chart',
          'name': 'jilo',
          'tag': 'latest'
        }
      ],
      'deploymentId': 'b1e16c7d-15dd-4e4d-8d4b-d8c73ddf847c'
    }
  },
  'children': {
    'Deployment.apps/v1': {},
    'Service.v1': {}
  },
  'finalizing': false
}
export const reconcileFirstDeploymentParams = {
  paramsWithEmptyCircle: firstDeploymentParams
}
