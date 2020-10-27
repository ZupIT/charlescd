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

import { OctopipeDeploymentRequest } from '../../../../../../app/v2/core/integrations/octopipe/interfaces/octopipe-deployment.interface'
import { GitProvidersEnum } from '../../../../../../app/v1/core/integrations/configuration/interfaces'
import { AppConstants } from '../../../../../../app/v1/core/constants'

export const completeOctopipeDeploymentRequest: OctopipeDeploymentRequest = {
  namespace: 'sandbox',
  deployments: [
    {
      componentName: 'A',
      helmRepositoryConfig: {
        type: GitProvidersEnum.GITHUB,
        url: 'http://localhost:2222/helm',
        token: 'git-token'
      },
      helmConfig: {
        overrideValues: {
          'image.tag': 'https://repository.com/A:v2',
          deploymentName: 'A-v2-circle-id',
          component: 'A',
          tag: 'v2',
          circleId: 'circle-id'
        }
      },
      rollbackIfFailed: true
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
          'image.tag': 'https://repository.com/B:v2',
          deploymentName: 'B-v2-circle-id',
          component: 'B',
          tag: 'v2',
          circleId: 'circle-id'
        }
      },
      rollbackIfFailed: true
    },
    {
      componentName: 'C',
      helmRepositoryConfig: {
        type: GitProvidersEnum.GITHUB,
        url: 'http://localhost:2222/helm',
        token: 'git-token'
      },
      helmConfig: {
        overrideValues: {
          'image.tag': 'https://repository.com/C:v2',
          deploymentName: 'C-v2-circle-id',
          component: 'C',
          tag: 'v2',
          circleId: 'circle-id'
        }
      },
      rollbackIfFailed: true
    }
  ],
  unusedDeployments: [
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
              tag: 'v2',
              circleId: 'circle-id'
            },
            name: 'circle-id'
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
                    regex: '.*x-circle-id=circle-id.*'
                  }
                }
              }
            ],
            route: [
              {
                destination: {
                  host: 'A',
                  subset: 'circle-id'
                },
                headers: {
                  request: {
                    set: {
                      'x-circle-source': 'circle-id'
                    }
                  },
                  response: {
                    set: {
                      'x-circle-source': 'circle-id'
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
                    exact: 'circle-id'
                  }
                }
              }
            ],
            route: [
              {
                destination: {
                  host: 'A',
                  subset: 'circle-id'
                },
                headers: {
                  request: {
                    set: {
                      'x-circle-source': 'circle-id'
                    }
                  },
                  response: {
                    set: {
                      'x-circle-source': 'circle-id'
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
              tag: 'v2',
              circleId: 'circle-id'
            },
            name: 'circle-id'
          },
          {
            labels: {
              component: 'B',
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
            match: [
              {
                headers: {
                  cookie: {
                    regex: '.*x-circle-id=circle-id.*'
                  }
                }
              }
            ],
            route: [
              {
                destination: {
                  host: 'B',
                  subset: 'circle-id'
                },
                headers: {
                  request: {
                    set: {
                      'x-circle-source': 'circle-id'
                    }
                  },
                  response: {
                    set: {
                      'x-circle-source': 'circle-id'
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
                    exact: 'circle-id'
                  }
                }
              }
            ],
            route: [
              {
                destination: {
                  host: 'B',
                  subset: 'circle-id'
                },
                headers: {
                  request: {
                    set: {
                      'x-circle-source': 'circle-id'
                    }
                  },
                  response: {
                    set: {
                      'x-circle-source': 'circle-id'
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
    },
    {
      apiVersion: 'networking.istio.io/v1alpha3',
      kind: 'DestinationRule',
      metadata: {
        name: 'C',
        namespace: 'sandbox'
      },
      spec: {
        host: 'C',
        subsets: [
          {
            labels: {
              component: 'C',
              tag: 'v2',
              circleId: 'circle-id'
            },
            name: 'circle-id'
          },
          {
            labels: {
              component: 'C',
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
        name: 'C',
        namespace: 'sandbox'
      },
      spec: {
        gateways: [],
        hosts: [
          'C'
        ],
        http: [
          {
            match: [
              {
                headers: {
                  cookie: {
                    regex: '.*x-circle-id=circle-id.*'
                  }
                }
              }
            ],
            route: [
              {
                destination: {
                  host: 'C',
                  subset: 'circle-id'
                },
                headers: {
                  request: {
                    set: {
                      'x-circle-source': 'circle-id'
                    }
                  },
                  response: {
                    set: {
                      'x-circle-source': 'circle-id'
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
                    exact: 'circle-id'
                  }
                }
              }
            ],
            route: [
              {
                destination: {
                  host: 'C',
                  subset: 'circle-id'
                },
                headers: {
                  request: {
                    set: {
                      'x-circle-source': 'circle-id'
                    }
                  },
                  response: {
                    set: {
                      'x-circle-source': 'circle-id'
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
                  host: 'C',
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