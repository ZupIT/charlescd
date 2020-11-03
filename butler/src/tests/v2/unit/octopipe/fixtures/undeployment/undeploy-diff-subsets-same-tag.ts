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

import { GitProvidersEnum } from '../../../../../../app/v1/core/integrations/configuration/interfaces'
import { AppConstants } from '../../../../../../app/v1/core/constants'
import { OctopipeUndeploymentRequest } from '../../../../../../app/v2/core/integrations/octopipe/interfaces/octopipe-undeployment.interface'

export const undeployDiffSubsetsSameTagOctopipe: OctopipeUndeploymentRequest = {
  namespace: 'sandbox',
  undeployments: [
    {
      componentName: 'A',
      helmRepositoryConfig: {
        type: GitProvidersEnum.GITHUB,
        url: 'http://localhost:2222/helm',
        token: 'git-token'
      },
      helmConfig: {
        overrideValues: {
          'image.tag': 'https://repository.com/A:v1',
          deploymentName: 'A-v1-circle-id',
          component: 'A',
          tag: 'v1',
          circleId: 'circle-id'
        }
      },
      rollbackIfFailed: false
    },
    {
      componentName: 'B',
      helmRepositoryConfig: {
        type: GitProvidersEnum.GITHUB,
        url: 'http://localhost:2222/helm',
        token: 'git-token'
      },
      helmConfig: {
        overrideValues: {
          'image.tag': 'https://repository.com/B:v1',
          deploymentName: 'B-v1-circle-id',
          component: 'B',
          tag: 'v1',
          circleId: 'circle-id'
        }
      },
      rollbackIfFailed: false
    }
  ],
  proxyDeployments: [
    {
      apiVersion: 'networking.istio.io/v1alpha3',
      kind: 'DestinationRule',
      metadata: {
        name: 'A',
        namespace: 'sandbox'
      },
      spec: {
        host: 'A',
        subsets: [
          {
            labels: {
              component: 'A',
              tag: 'v0',
              circleId: 'circle-id2'
            },
            name: 'circle-id2'
          },
          {
            labels: {
              component: 'A',
              tag: 'v0',
              circleId: 'circle-id3'
            },
            name: 'circle-id3'
          },
          {
            labels: {
              component: 'A',
              tag: 'v0',
              circleId: AppConstants.DEFAULT_CIRCLE_ID
            },
            name: AppConstants.DEFAULT_CIRCLE_ID
          }
        ]
      }
    },
    {
      apiVersion: 'networking.istio.io/v1alpha3',
      kind: 'VirtualService',
      metadata: {
        name: 'A',
        namespace: 'sandbox'
      },
      spec: {
        gateways: [],
        hosts: [
          'A'
        ],
        http: [
          {
            match: [
              {
                headers: {
                  cookie: {
                    regex: '.*x-circle-id=circle-id2.*'
                  }
                }
              }
            ],
            route: [
              {
                destination: {
                  host: 'A',
                  subset: 'circle-id2'
                },
                headers: {
                  request: {
                    set: {
                      'x-circle-source': 'circle-id2'
                    }
                  },
                  response: {
                    set: {
                      'x-circle-source': 'circle-id2'
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
                    exact: 'circle-id2'
                  }
                }
              }
            ],
            route: [
              {
                destination: {
                  host: 'A',
                  subset: 'circle-id2'
                },
                headers: {
                  request: {
                    set: {
                      'x-circle-source': 'circle-id2'
                    }
                  },
                  response: {
                    set: {
                      'x-circle-source': 'circle-id2'
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
                  cookie: {
                    regex: '.*x-circle-id=circle-id3.*'
                  }
                }
              }
            ],
            route: [
              {
                destination: {
                  host: 'A',
                  subset: 'circle-id3'
                },
                headers: {
                  request: {
                    set: {
                      'x-circle-source': 'circle-id3'
                    }
                  },
                  response: {
                    set: {
                      'x-circle-source': 'circle-id3'
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
                    exact: 'circle-id3'
                  }
                }
              }
            ],
            route: [
              {
                destination: {
                  host: 'A',
                  subset: 'circle-id3'
                },
                headers: {
                  request: {
                    set: {
                      'x-circle-source': 'circle-id3'
                    }
                  },
                  response: {
                    set: {
                      'x-circle-source': 'circle-id3'
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
                  subset: AppConstants.DEFAULT_CIRCLE_ID
                },
                headers: {
                  request: {
                    set: {
                      'x-circle-source': AppConstants.DEFAULT_CIRCLE_ID
                    }
                  },
                  response: {
                    set: {
                      'x-circle-source': AppConstants.DEFAULT_CIRCLE_ID
                    }
                  }
                }
              }
            ]
          }
        ]
      }
    },
    {
      apiVersion: 'networking.istio.io/v1alpha3',
      kind: 'DestinationRule',
      metadata: {
        name: 'B',
        namespace: 'sandbox'
      },
      spec: {
        host: 'B',
        subsets: [
          {
            labels: {
              component: 'B',
              tag: 'v1',
              circleId: AppConstants.DEFAULT_CIRCLE_ID
            },
            name: AppConstants.DEFAULT_CIRCLE_ID
          }
        ]
      }
    },
    {
      apiVersion: 'networking.istio.io/v1alpha3',
      kind: 'VirtualService',
      metadata: {
        name: 'B',
        namespace: 'sandbox'
      },
      spec: {
        gateways: [],
        hosts: [
          'B'
        ],
        http: [
          {
            route: [
              {
                destination: {
                  host: 'B',
                  subset: AppConstants.DEFAULT_CIRCLE_ID
                },
                headers: {
                  request: {
                    set: {
                      'x-circle-source': AppConstants.DEFAULT_CIRCLE_ID
                    }
                  },
                  response: {
                    set: {
                      'x-circle-source': AppConstants.DEFAULT_CIRCLE_ID
                    }
                  }
                }
              }
            ]
          }
        ]
      }
    }
  ],
  callbackUrl: 'http://localhost:8883/butler/v2/executions/execution-id/notify',
  clusterConfig: null
}