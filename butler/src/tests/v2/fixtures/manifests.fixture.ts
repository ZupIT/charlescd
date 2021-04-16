/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as fs from 'fs'
import * as path from 'path'
import * as yaml from 'js-yaml'

import { KubernetesManifest } from '../../../app/v2/core/integrations/interfaces/k8s-manifest.interface'
import { AppConstants } from '../../../app/v2/core/constants'

const basePath = path.join(__dirname, '../../../', 'resources/helm-test-chart')

export const simpleManifests: KubernetesManifest[] = yaml.safeLoadAll(fs.readFileSync(`${basePath}/simple-manifests.yaml`, 'utf-8'))

export const getSimpleManifests = (appName: string, namespace: string, image: string): KubernetesManifest[] => {
  const manifests = yaml.safeLoadAll(fs.readFileSync(`${basePath}/simple-manifests.yaml`, 'utf-8'))
  const service = manifests[0]
  service.metadata.labels.app = appName
  service.metadata.labels.service = appName
  service.metadata.labels.component = appName
  service.metadata.name = appName
  service.metadata.namespace = namespace
  service.spec.selector.app = appName

  const deployment = manifests[1]
  deployment.metadata.labels.app = appName
  deployment.metadata.labels.version = appName
  deployment.metadata.labels.component = appName
  deployment.metadata.name = appName
  deployment.metadata.namespace = namespace
  deployment.spec.selector.matchLabels.app = appName
  deployment.spec.selector.matchLabels.version = appName
  deployment.spec.template.metadata.labels.app = appName
  deployment.spec.template.metadata.labels.version = appName
  deployment.spec.template.spec.containers[0].image = image
  deployment.spec.template.spec.containers[0].name = appName

  return [service, deployment]
}

export const getComplexManifests = (appName: string, namespace: string, image: string): KubernetesManifest[] => {
  const manifests = yaml.safeLoadAll(fs.readFileSync(`${basePath}/complex-manifests.yaml`, 'utf-8'))
  const service = manifests[0]
  service.metadata.labels.app = appName
  service.metadata.labels.service = appName
  service.metadata.labels.component = appName
  service.metadata.name = appName
  service.metadata.namespace = namespace
  service.spec.selector.app = appName

  const deployment = manifests[1]
  deployment.metadata.labels.app = appName
  deployment.metadata.labels.version = appName
  deployment.metadata.labels.component = appName
  deployment.metadata.name = appName
  deployment.metadata.namespace = namespace
  deployment.spec.selector.matchLabels.app = appName
  deployment.spec.selector.matchLabels.version = appName
  deployment.spec.template.metadata.labels.app = appName
  deployment.spec.template.metadata.labels.version = appName
  deployment.spec.template.spec.containers[0].image = image
  deployment.spec.template.spec.containers[0].name = appName

  const secret = manifests[2]
  secret.metadata.labels.app = appName
  secret.metadata.labels.version = appName
  secret.metadata.labels.component = appName
  secret.metadata.namespace = namespace

  return [service, deployment, secret]
}

export const routesManifestsSameNamespace: KubernetesManifest[] = [
  {
    apiVersion: AppConstants.ISTIO_RESOURCES_API_VERSION,
    kind: 'DestinationRule',
    metadata: {
      name: 'A',
      namespace: 'namespace',
      annotations: {
        circles: '["circle-1","circle-2"]'
      }
    },
    spec: {
      host: 'A',
      subsets: [
        {
          labels: {
            component: 'A',
            tag: 'v1',
            circleId: 'circle-1',
          },
          name: 'circle-1',
        },
        {
          labels: {
            component: 'A',
            tag: 'v2',
            circleId: 'circle-2',
          },
          name: 'circle-2',
        }
      ],
    },
  } as KubernetesManifest,
  {
    apiVersion: AppConstants.ISTIO_RESOURCES_API_VERSION,
    kind: 'VirtualService',
    metadata: {
      name: 'A',
      namespace: 'namespace',
      annotations: {
        circles: '["circle-1","circle-2"]'
      }
    },
    spec: {
      gateways: [
      ],
      hosts: [
        'A',
      ],
      http: [
        {
          match: [
            {
              headers: {
                cookie: {
                  regex: '.*x-circle-id=circle-2.*'
                }
              }
            }
          ],
          route: [
            {
              destination: {
                host: 'A',
                subset: 'circle-2'
              },
              headers: {
                request: {
                  set: {
                    'x-circle-source': 'circle-2'
                  }
                },
                response: {
                  set: {
                    'x-circle-source': 'circle-2'
                  }
                }
              }
            }
          ]
        },
        {
          match: [
            {
              headers: {
                'x-circle-id': {
                  exact: 'circle-2'
                }
              }
            }
          ],
          route: [
            {
              destination: {
                host: 'A',
                subset: 'circle-2'
              },
              headers: {
                request: {
                  set: {
                    'x-circle-source': 'circle-2'
                  }
                },
                response: {
                  set: {
                    'x-circle-source': 'circle-2'
                  }
                }
              }
            }
          ]
        },
        {
          route: [
            {
              destination: {
                host: 'A',
                subset: 'circle-1'
              },
              headers: {
                request: {
                  set: {
                    'x-circle-source': 'circle-1'
                  }
                },
                response: {
                  set: {
                    'x-circle-source': 'circle-1'
                  }
                }
              }
            }
          ]
        }
      ]
    },
  } as KubernetesManifest,
  {
    apiVersion: AppConstants.ISTIO_RESOURCES_API_VERSION,
    kind: 'DestinationRule',
    metadata: {
      name: 'B',
      namespace: 'namespace',
      annotations: {
        circles: '["circle-2"]'
      }
    },
    spec: {
      host: 'B',
      subsets: [
        {
          labels: {
            component: 'B',
            tag: 'v2',
            circleId: 'circle-2',
          },
          name: 'circle-2',
        },
      ],
    },
  } as KubernetesManifest,
  {
    apiVersion: AppConstants.ISTIO_RESOURCES_API_VERSION,
    kind: 'VirtualService',
    metadata: {
      name: 'B',
      namespace: 'namespace',
      annotations: {
        circles: '["circle-2"]'
      }
    },
    spec: {
      gateways: [
      ],
      hosts: [
        'B',
      ],
      http: [
        {
          match: [
            {
              headers: {
                cookie: {
                  regex: '.*x-circle-id=circle-2.*'
                }
              }
            }
          ],
          route: [
            {
              destination: {
                host: 'B',
                subset: 'circle-2'
              },
              headers: {
                request: {
                  set: {
                    'x-circle-source': 'circle-2'
                  }
                },
                response: {
                  set: {
                    'x-circle-source': 'circle-2'
                  }
                }
              }
            }
          ]
        },
        {
          match: [
            {
              headers: {
                'x-circle-id': {
                  exact: 'circle-2'
                }
              }
            }
          ],
          route: [
            {
              destination: {
                host: 'B',
                subset: 'circle-2'
              },
              headers: {
                request: {
                  set: {
                    'x-circle-source': 'circle-2'
                  }
                },
                response: {
                  set: {
                    'x-circle-source': 'circle-2'
                  }
                }
              }
            }
          ]
        }
      ]
    },
  } as KubernetesManifest,
]

export const routesManifestsSameNamespaceWithService: KubernetesManifest[] = [
  {
    apiVersion: AppConstants.ISTIO_RESOURCES_API_VERSION,
    kind: 'DestinationRule',
    metadata: {
      name: 'A',
      namespace: 'namespace',
      annotations: {
        circles: '["circle-1","circle-2"]'
      }
    },
    spec: {
      host: 'A',
      subsets: [
        {
          labels: {
            component: 'A',
            tag: 'v1',
            circleId: 'circle-1',
          },
          name: 'circle-1',
        },
        {
          labels: {
            component: 'A',
            tag: 'v2',
            circleId: 'circle-2',
          },
          name: 'circle-2',
        }
      ],
    },
  } as KubernetesManifest,
  {
    apiVersion: AppConstants.ISTIO_RESOURCES_API_VERSION,
    kind: 'VirtualService',
    metadata: {
      name: 'A',
      namespace: 'namespace',
      annotations: {
        circles: '["circle-1","circle-2"]'
      }
    },
    spec: {
      gateways: [
      ],
      hosts: [
        'A',
      ],
      http: [
        {
          match: [
            {
              headers: {
                cookie: {
                  regex: '.*x-circle-id=circle-2.*'
                }
              }
            }
          ],
          route: [
            {
              destination: {
                host: 'A',
                subset: 'circle-2'
              },
              headers: {
                request: {
                  set: {
                    'x-circle-source': 'circle-2'
                  }
                },
                response: {
                  set: {
                    'x-circle-source': 'circle-2'
                  }
                }
              }
            }
          ]
        },
        {
          match: [
            {
              headers: {
                'x-circle-id': {
                  exact: 'circle-2'
                }
              }
            }
          ],
          route: [
            {
              destination: {
                host: 'A',
                subset: 'circle-2'
              },
              headers: {
                request: {
                  set: {
                    'x-circle-source': 'circle-2'
                  }
                },
                response: {
                  set: {
                    'x-circle-source': 'circle-2'
                  }
                }
              }
            }
          ]
        },
        {
          route: [
            {
              destination: {
                host: 'A',
                subset: 'circle-1'
              },
              headers: {
                request: {
                  set: {
                    'x-circle-source': 'circle-1'
                  }
                },
                response: {
                  set: {
                    'x-circle-source': 'circle-1'
                  }
                }
              }
            }
          ]
        }
      ]
    },
  } as KubernetesManifest,
  {
    apiVersion: AppConstants.ISTIO_RESOURCES_API_VERSION,
    kind: 'DestinationRule',
    metadata: {
      name: 'B',
      namespace: 'namespace',
      annotations: {
        circles: '["circle-2"]'
      }
    },
    spec: {
      host: 'B',
      subsets: [
        {
          labels: {
            component: 'B',
            tag: 'v2',
            circleId: 'circle-2',
          },
          name: 'circle-2',
        },
      ],
    },
  } as KubernetesManifest,
  {
    apiVersion: AppConstants.ISTIO_RESOURCES_API_VERSION,
    kind: 'VirtualService',
    metadata: {
      name: 'B',
      namespace: 'namespace',
      annotations: {
        circles: '["circle-2"]'
      }
    },
    spec: {
      gateways: [
      ],
      hosts: [
        'B',
      ],
      http: [
        {
          match: [
            {
              headers: {
                cookie: {
                  regex: '.*x-circle-id=circle-2.*'
                }
              }
            }
          ],
          route: [
            {
              destination: {
                host: 'B',
                subset: 'circle-2'
              },
              headers: {
                request: {
                  set: {
                    'x-circle-source': 'circle-2'
                  }
                },
                response: {
                  set: {
                    'x-circle-source': 'circle-2'
                  }
                }
              }
            }
          ]
        },
        {
          match: [
            {
              headers: {
                'x-circle-id': {
                  exact: 'circle-2'
                }
              }
            }
          ],
          route: [
            {
              destination: {
                host: 'B',
                subset: 'circle-2'
              },
              headers: {
                request: {
                  set: {
                    'x-circle-source': 'circle-2'
                  }
                },
                response: {
                  set: {
                    'x-circle-source': 'circle-2'
                  }
                }
              }
            }
          ]
        }
      ]
    },
  } as KubernetesManifest,
  {
    apiVersion: 'v1',
    kind: 'Service',
    metadata: {
      labels: {
        app: 'A',
        circleId: 'circle-1',
        deploymentId: 'b7d08a07-f29d-452e-a667-7a39820f3262',
        component: 'A',
        service: 'A',
        tag: 'tag-example'
      },
      name: 'A',
      namespace: 'namespace'
    },
    spec: {
      ports: [
        {
          name: 'http',
          port: 80,
          targetPort: 80
        }
      ],
      selector: {
        app: 'A'
      },
      type: 'ClusterIP'
    }
  } as KubernetesManifest
]

export const routesManifestsDiffNamespace: KubernetesManifest[] = [
  {
    apiVersion: AppConstants.ISTIO_RESOURCES_API_VERSION,
    kind: 'DestinationRule',
    metadata: {
      name: 'A',
      namespace: 'diff-namespace',
      annotations: {
        circles: '["circle-1"]'
      }
    },
    spec: {
      host: 'A',
      subsets: [
        {
          labels: {
            component: 'A',
            tag: 'v1',
            circleId: 'circle-1',
          },
          name: 'circle-1',
        }
      ],
    },
  } as KubernetesManifest,
  {
    apiVersion: AppConstants.ISTIO_RESOURCES_API_VERSION,
    kind: 'VirtualService',
    metadata: {
      name: 'A',
      namespace: 'diff-namespace',
      annotations: {
        circles: '["circle-1"]'
      }
    },
    spec: {
      gateways: [
      ],
      hosts: [
        'A',
      ],
      http: [
        {
          route: [
            {
              destination: {
                host: 'A',
                subset: 'circle-1'
              },
              headers: {
                request: {
                  set: {
                    'x-circle-source': 'circle-1'
                  }
                },
                response: {
                  set: {
                    'x-circle-source': 'circle-1'
                  }
                }
              }
            }
          ]
        }
      ]
    },
  } as KubernetesManifest,
  {
    apiVersion: AppConstants.ISTIO_RESOURCES_API_VERSION,
    kind: 'DestinationRule',
    metadata: {
      name: 'A',
      namespace: 'namespace',
      annotations: {
        circles: '["circle-2"]'
      }
    },
    spec: {
      host: 'A',
      subsets: [
        {
          labels: {
            component: 'A',
            tag: 'v2',
            circleId: 'circle-2',
          },
          name: 'circle-2',
        }
      ],
    },
  } as KubernetesManifest,
  {
    apiVersion: AppConstants.ISTIO_RESOURCES_API_VERSION,
    kind: 'VirtualService',
    metadata: {
      name: 'A',
      namespace: 'namespace',
      annotations: {
        circles: '["circle-2"]'
      }
    },
    spec: {
      gateways: [
      ],
      hosts: [
        'A',
      ],
      http: [
        {
          match: [
            {
              headers: {
                cookie: {
                  regex: '.*x-circle-id=circle-2.*'
                }
              }
            }
          ],
          route: [
            {
              destination: {
                host: 'A',
                subset: 'circle-2'
              },
              headers: {
                request: {
                  set: {
                    'x-circle-source': 'circle-2'
                  }
                },
                response: {
                  set: {
                    'x-circle-source': 'circle-2'
                  }
                }
              }
            }
          ]
        },
        {
          match: [
            {
              headers: {
                'x-circle-id': {
                  exact: 'circle-2'
                }
              }
            }
          ],
          route: [
            {
              destination: {
                host: 'A',
                subset: 'circle-2'
              },
              headers: {
                request: {
                  set: {
                    'x-circle-source': 'circle-2'
                  }
                },
                response: {
                  set: {
                    'x-circle-source': 'circle-2'
                  }
                }
              }
            }
          ]
        }
      ]
    },
  } as KubernetesManifest,
  {
    apiVersion: AppConstants.ISTIO_RESOURCES_API_VERSION,
    kind: 'DestinationRule',
    metadata: {
      name: 'B',
      namespace: 'namespace',
      annotations: {
        circles: '["circle-2"]'
      }
    },
    spec: {
      host: 'B',
      subsets: [
        {
          labels: {
            component: 'B',
            tag: 'v2',
            circleId: 'circle-2',
          },
          name: 'circle-2',
        },
      ],
    },
  } as KubernetesManifest,
  {
    apiVersion: AppConstants.ISTIO_RESOURCES_API_VERSION,
    kind: 'VirtualService',
    metadata: {
      name: 'B',
      namespace: 'namespace',
      annotations: {
        circles: '["circle-2"]'
      }
    },
    spec: {
      gateways: [
      ],
      hosts: [
        'B',
      ],
      http: [
        {
          match: [
            {
              headers: {
                cookie: {
                  regex: '.*x-circle-id=circle-2.*'
                }
              }
            }
          ],
          route: [
            {
              destination: {
                host: 'B',
                subset: 'circle-2'
              },
              headers: {
                request: {
                  set: {
                    'x-circle-source': 'circle-2'
                  }
                },
                response: {
                  set: {
                    'x-circle-source': 'circle-2'
                  }
                }
              }
            }
          ]
        },
        {
          match: [
            {
              headers: {
                'x-circle-id': {
                  exact: 'circle-2'
                }
              }
            }
          ],
          route: [
            {
              destination: {
                host: 'B',
                subset: 'circle-2'
              },
              headers: {
                request: {
                  set: {
                    'x-circle-source': 'circle-2'
                  }
                },
                response: {
                  set: {
                    'x-circle-source': 'circle-2'
                  }
                }
              }
            }
          ]
        }
      ]
    },
  } as KubernetesManifest,
]
