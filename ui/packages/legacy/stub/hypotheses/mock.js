const board = { 
  "board":[ 
     { 
        "id":"21825c71-12dc-441f-ac5d-9fc05d2bda8b",
        "name":"backlog",
        "cards":[ 

        ],
        "builds":[ 

        ]
     },
     { 
        "id":"eb6dd013-3606-4da3-8324-b630406b7a64",
        "name":"to_do",
        "cards":[ 

        ],
        "builds":[ 

        ]
     },
     { 
        "id":"5bd86112-0900-4eb4-a673-5e71e405796f",
        "name":"doing",
        "cards":[ 

        ],
        "builds":[ 

        ]
     },
     { 
        "id":"dc2bfa97-e87a-49bf-95a9-72b9d77e151b",
        "name":"ready_to_team_validation",
        "cards":[ 
          { 
            "id":"41d37577-97f1-401d-aeff-e473836df230",
            "name":"create /login structure",
            "createdAt":"2019-10-25 13:37:55",
            "labels":[ 

            ],
            "type":"FEATURE",
            "feature":{ 
               "id":"5d1066e4-a79d-4aa9-8202-5e187f743f95",
               "name":"create /login structure",
               "branches":[ 
                  "https://github.com/ZupIT/iti-bff/tree/create_login_structure"
               ],
               "modules":[ 
                  { 
                     "id":"c0d3ae1b-2d20-455d-840b-644be1c5e181",
                     "name":"ZupIT/iti-bff",
                     "labels":[ 

                     ]
                  }
               ]
            },
            "hypothesisId":"56636972-c134-4ce9-ace9-22efbe9db33d",
            "members":[ 
               { 
                  "id":"082ed4c8-adb1-4a94-94bd-98b40f1354d3",
                  "name":"Pedro Naves",
                  "email":"pedro.naves@zup.com.br",
                  "photoUrl":"https://trello-avatars.s3.amazonaws.com/4dbd900cac9cf9869250177b70fd5e59/original.png"
               }
            ],
            "index":0
          }
        ],
        "builds":[ 

        ]
     },
     { 
        "id":"c7884347-8c34-4f35-bd55-736b11fbf517",
        "name":"team_validation",
        "cards":[ 

        ],
        "builds":[ 
          {
            "tag": "release-darwin-teste-loading-generate-release",
            "id": '6ec96f0d-c7d8-4af3-a56d-23501e39c6c9',
            "createdAt": "2020-01-08 17:58:27",
            "status": "BUILDING",
            "deployments": [],
            "features": [],
          }
        ]
     },
     { 
        "id":"75ea93c5-0632-4cd2-93cb-290f5fa1c041",
        "name":"validated",
        "cards":[ 

        ],
        "builds":[ 

        ]
     }
  ]
}

const status = {"events":[]}

const hypothesis = { 
   "id":"56636972-c134-4ce9-ace9-22efbe9db33d",
   "name":"Integrate PTM in login",
   "description":"<p>Integrate PTM in login</p>",
   "author":{ 
      "id":"082ed4c8-adb1-4a94-94bd-98b40f1354d3",
      "name":"Pedro Naves",
      "email":"pedro.naves@zup.com.br",
      "photoUrl":"https://trello-avatars.s3.amazonaws.com/4dbd900cac9cf9869250177b70fd5e59/original.png"
   },
   "problem":{ 
      "id":"91a5de33-d07c-44d2-8202-4b2eee66df00",
      "name":"We don't have integration with PTM",
      "description":"<p>We don't have integration with PTM</p>",
      "authorId":"082ed4c8-adb1-4a94-94bd-98b40f1354d3",
      "authorName":"Pedro Naves"
   },
   "labels":[ 

   ],
   "cards":[ 
      { 
         "id":"41d37577-97f1-401d-aeff-e473836df230",
         "name":"create /login structure",
         "createdAt":"2019-10-25 13:37:55",
         "labels":[ 

         ],
         "type":"FEATURE",
         "feature":{ 
            "id":"5d1066e4-a79d-4aa9-8202-5e187f743f95",
            "name":"create /login structure",
            "branches":[ 
               "https://github.com/ZupIT/iti-bff/tree/create_login_structure"
            ],
            "modules":[ 
               { 
                  "id":"c0d3ae1b-2d20-455d-840b-644be1c5e181",
                  "name":"ZupIT/iti-bff",
                  "labels":[ 

                  ]
               }
            ]
         },
         "hypothesisId":"56636972-c134-4ce9-ace9-22efbe9db33d",
         "members":[ 
            { 
               "id":"082ed4c8-adb1-4a94-94bd-98b40f1354d3",
               "name":"Pedro Naves",
               "email":"pedro.naves@zup.com.br",
               "photoUrl":"https://trello-avatars.s3.amazonaws.com/4dbd900cac9cf9869250177b70fd5e59/original.png"
            }
         ],
         "index":0
      }
   ],
   "builds":[ 

   ],
   "circles":[ 

   ]
}

const deployments = [ 
   { 
      "circleId":"f5d23a57-5607-4306-9993-477e1598cc2a",
      "circleName":"Default",
      "deployments":[ 

      ]
   },
   { 
      "circleId":"83cfca63-25a5-4626-a92b-a2efc4b7346a",
      "circleName":"Developer",
      "deployments":[ 
         { 
            "id":"d03c979f-f9fe-4119-ba53-73ef15c22f13",
            "createdAt":"2019-10-04 21:04:05",
            "buildId":"0213aff2-9120-4faf-9185-d3c46a317e7e",
            "tag":"release-darwin-fideback",
            "status":"DEPLOY_FAILED"
         },
         { 
            "id":"3ebae37e-27b9-4704-ace2-a61ed8e7a9c0",
            "createdAt":"2019-10-10 19:37:05",
            "buildId":"a184c85a-c328-4af6-aae3-d87e0e14eacb",
            "tag":"release-darwin-archive-and-delete-builds-and-cards",
            "status":"DEPLOY_FAILED"
         },
         { 
            "id":"0837d392-93a1-460e-9bcd-19bea2167b50",
            "createdAt":"2019-10-14 20:56:46",
            "buildId":"25fc31c6-4aca-4cdf-acaa-0dc52a6728bd",
            "tag":"release-darwin-consul-deploy",
            "status":"DEPLOY_FAILED"
         },
         { 
            "id":"f678a203-5fbc-4b3f-a201-d14577b0720a",
            "createdAt":"2019-10-11 20:12:35",
            "buildId":"4b1b38e2-878e-4149-bae6-a8e31dfb0c48",
            "tag":"release-darwin-bundle-0-0-6",
            "status":"DEPLOY_FAILED"
         },
         { 
            "id":"4431a7b5-f637-4182-b515-81308d446722",
            "createdAt":"2019-10-23 21:12:23",
            "buildId":"b66238a6-b63f-4368-918b-41e0d96fca3f",
            "tag":"release-darwin-commons-js-07",
            "status":"DEPLOY_FAILED"
         },
         { 
            "id":"81ab9df5-aaad-4144-a9cf-7ff3cb596df3",
            "createdAt":"2019-10-23 21:32:14",
            "buildId":"09b3264e-e8a3-4075-8827-c7b199db5261",
            "tag":"release-darwin-commons-js-09",
            "status":"DEPLOY_FAILED"
         },
         { 
            "id":"2bced6a4-e006-4ea7-8aaf-f4366609b0ef",
            "createdAt":"2019-10-23 21:32:14",
            "buildId":"09b3264e-e8a3-4075-8827-c7b199db5261",
            "tag":"release-darwin-commons-js-09",
            "status":"DEPLOY_FAILED"
         }
      ]
   },
   { 
      "circleId":"00a40de1-bc97-47de-bcd8-f54c28ebad79",
      "circleName":"Men",
      "deployments":[ 

      ]
   },
   { 
      "circleId":"df4551cb-d451-4c08-be8f-29576a667d0c",
      "circleName":"Quality Assurance",
      "deployments":[ 
         { 
            "id":"91802e5a-ff71-4fab-a23d-43fb296452d7",
            "createdAt":"2019-10-25 16:54:23",
            "buildId":"bc88c82c-f13e-4fec-8316-c630a6366e4a",
            "tag":"release-darwin-aws-registry-fields",
            "status":"DEPLOYED"
         }
      ]
   },
   { 
      "circleId":"8a808dc2-44cc-4158-8d66-2f7a02d16724",
      "circleName":"Women",
      "deployments":[ 

      ]
   }
]

const validated = [ 
   { 
      "id":"01c6a677-ccaf-4577-941b-38e32f5c8442",
      "createdAt":"2019-10-11 21:25:43",
      "features":[ 
         { 
            "id":"79ec2095-2082-4dd8-9fdf-3c11348df318",
            "name":"Enhancement Darwin",
            "branches":[ 
               "https://github.com/ZupIT/darwin-ui/tree/enhancement-darwin"
            ],
            "modules":[ 
               { 
                  "id":"e9289c98-e017-40f4-9854-aeb529a1482f",
                  "name":"ZupIT/darwin-ui",
                  "labels":[ 

                  ]
               }
            ]
         },
         { 
            "id":"76013d92-e735-44b9-820d-436f4d42b1a4",
            "name":"Reduzir payload do serviço principal do board",
            "branches":[ 
               "https://github.com/ZupIT/darwin-application/tree/feature/reduce-board-service-payload"
            ],
            "modules":[ 
               { 
                  "id":"be6f0bf2-9008-4d13-8966-09752cbba8f1",
                  "name":"ZupIT/darwin-application",
                  "labels":[ 

                  ]
               }
            ]
         },
         { 
            "id":"25219956-ae0f-4853-b1ba-35a86d6b3a8c",
            "name":"Bug fix villager image names",
            "branches":[ 
               "https://github.com/ZupIT/darwin-villager/tree/bugfix/villager-image-name"
            ],
            "modules":[ 
               { 
                  "id":"baf82f10-b5ab-495a-85a7-41ff94824776",
                  "name":"ZupIT/darwin-villager",
                  "labels":[ 

                  ]
               }
            ]
         }
      ],
      "tag":"release-darwin-bundle-0-0-9",
      "status":"VALIDATED",
      "deployments":[ 
         { 
            "id":"c012c672-87f0-4486-8520-12ce196086c5",
            "createdAt":"2019-10-12 02:35:15",
            "buildId":"01c6a677-ccaf-4577-941b-38e32f5c8442",
            "tag":"release-darwin-bundle-0-0-9",
            "status":"NOT_DEPLOYED"
         },
         { 
            "id":"0b34b63c-7daf-478d-b354-8012feb0d671",
            "createdAt":"2019-10-11 21:42:18",
            "buildId":"01c6a677-ccaf-4577-941b-38e32f5c8442",
            "tag":"release-darwin-bundle-0-0-9",
            "status":"NOT_DEPLOYED"
         },
         { 
            "id":"c63f7311-49d3-4770-b40a-df796af41e66",
            "createdAt":"2019-10-11 21:32:34",
            "buildId":"01c6a677-ccaf-4577-941b-38e32f5c8442",
            "tag":"release-darwin-bundle-0-0-9",
            "status":"NOT_DEPLOYED"
         },
         { 
            "id":"a8e46f17-bc9b-44d2-a5ce-22ed1651cb25",
            "createdAt":"2019-10-12 02:25:53",
            "buildId":"01c6a677-ccaf-4577-941b-38e32f5c8442",
            "tag":"release-darwin-bundle-0-0-9",
            "status":"NOT_DEPLOYED"
         },
         { 
            "id":"dca986ff-25f6-4655-8133-ab9db404c571",
            "createdAt":"2019-10-12 02:21:52",
            "buildId":"01c6a677-ccaf-4577-941b-38e32f5c8442",
            "tag":"release-darwin-bundle-0-0-9",
            "status":"NOT_DEPLOYED"
         },
         { 
            "id":"d5f1a07d-20bb-46d7-8b96-bbe30a0b9418",
            "createdAt":"2019-10-12 02:22:07",
            "buildId":"01c6a677-ccaf-4577-941b-38e32f5c8442",
            "tag":"release-darwin-bundle-0-0-9",
            "status":"NOT_DEPLOYED"
         },
         { 
            "id":"eb03cb71-ef91-4e4b-9205-c9314b9417b6",
            "createdAt":"2019-10-14 17:22:06",
            "buildId":"01c6a677-ccaf-4577-941b-38e32f5c8442",
            "tag":"release-darwin-bundle-0-0-9",
            "status":"NOT_DEPLOYED"
         },
         { 
            "id":"f1a1899b-10bf-448c-8515-be2de3e01778",
            "createdAt":"2019-10-11 21:57:19",
            "buildId":"01c6a677-ccaf-4577-941b-38e32f5c8442",
            "tag":"release-darwin-bundle-0-0-9",
            "status":"NOT_DEPLOYED"
         },
         { 
            "id":"e2e786e9-40ea-4595-946c-16a514884ba3",
            "createdAt":"2019-10-14 17:13:22",
            "buildId":"01c6a677-ccaf-4577-941b-38e32f5c8442",
            "tag":"release-darwin-bundle-0-0-9",
            "status":"NOT_DEPLOYED"
         }
      ]
   },
   { 
      "id":"c864fd8b-c21a-4b84-b5b9-30d3100dbb7e",
      "createdAt":"2019-10-15 19:34:10",
      "features":[ 
         { 
            "id":"495f7f1f-853b-4f83-9e4c-460d0cbf8819",
            "name":"Inserir header x-circle-id no callback do spinnaker",
            "branches":[ 
               "https://github.com/ZupIT/darwin-deploy/tree/feature/spinnaker-callback-header"
            ],
            "modules":[ 
               { 
                  "id":"96b3a57b-0390-4fdc-ba0a-2a15ea021fd7",
                  "name":"ZupIT/darwin-deploy",
                  "labels":[ 

                  ]
               }
            ]
         }
      ],
      "tag":"release-darwin-update-spinnaker-interaction",
      "status":"VALIDATED",
      "deployments":[ 
         { 
            "id":"f50b1821-7eb7-4595-b78c-22e060c037c7",
            "createdAt":"2019-10-15 19:51:20",
            "buildId":"c864fd8b-c21a-4b84-b5b9-30d3100dbb7e",
            "tag":"release-darwin-update-spinnaker-interaction",
            "status":"NOT_DEPLOYED"
         },
         { 
            "id":"c10f9f49-7c64-418b-bcc6-03b1e52ad397",
            "createdAt":"2019-10-15 19:37:07",
            "buildId":"c864fd8b-c21a-4b84-b5b9-30d3100dbb7e",
            "tag":"release-darwin-update-spinnaker-interaction",
            "status":"NOT_DEPLOYED"
         }
      ]
   },
   { 
      "id":"f0af811b-5de4-497f-89b4-0e6f493c5e83",
      "createdAt":"2019-10-14 21:20:00",
      "features":[ 
         { 
            "id":"4688eefc-5ece-4ea6-9576-f9fb19fa3f15",
            "name":"Integração darwin-deploy com consul",
            "branches":[ 
               "https://github.com/ZupIT/darwin-deploy/tree/feature/consul-postgres-integration"
            ],
            "modules":[ 
               { 
                  "id":"96b3a57b-0390-4fdc-ba0a-2a15ea021fd7",
                  "name":"ZupIT/darwin-deploy",
                  "labels":[ 

                  ]
               }
            ]
         },
         { 
            "id":"bfdc5565-60ae-435a-b796-1f847d86d682",
            "name":"Criar serviço de consulta de eventos [builds e deploys]",
            "branches":[ 
               "https://github.com/ZupIT/darwin-application/tree/feature/board-events"
            ],
            "modules":[ 
               { 
                  "id":"be6f0bf2-9008-4d13-8966-09752cbba8f1",
                  "name":"ZupIT/darwin-application",
                  "labels":[ 

                  ]
               }
            ]
         }
      ],
      "tag":"release-darwin-consul-new-deploy",
      "status":"VALIDATED",
      "deployments":[ 
         { 
            "id":"8b2931d7-d926-4799-a6f1-c1b2a8d11f71",
            "createdAt":"2019-10-15 01:22:13",
            "buildId":"f0af811b-5de4-497f-89b4-0e6f493c5e83",
            "tag":"release-darwin-consul-new-deploy",
            "status":"NOT_DEPLOYED"
         },
         { 
            "id":"bc04b857-cc1a-4daa-9e19-41a786a12f00",
            "createdAt":"2019-10-15 01:24:20",
            "buildId":"f0af811b-5de4-497f-89b4-0e6f493c5e83",
            "tag":"release-darwin-consul-new-deploy",
            "status":"NOT_DEPLOYED"
         },
         { 
            "id":"34ede395-e06f-4176-980d-ca4cd70419bd",
            "createdAt":"2019-10-14 21:27:05",
            "buildId":"f0af811b-5de4-497f-89b4-0e6f493c5e83",
            "tag":"release-darwin-consul-new-deploy",
            "status":"NOT_DEPLOYED"
         },
         { 
            "id":"188f7361-2222-4a8d-bae6-67736a85fd09",
            "createdAt":"2019-10-15 12:32:58",
            "buildId":"f0af811b-5de4-497f-89b4-0e6f493c5e83",
            "tag":"release-darwin-consul-new-deploy",
            "status":"NOT_DEPLOYED"
         },
         { 
            "id":"f1e691e0-6a4c-4157-9d14-b5d535abf515",
            "createdAt":"2019-10-15 19:49:46",
            "buildId":"f0af811b-5de4-497f-89b4-0e6f493c5e83",
            "tag":"release-darwin-consul-new-deploy",
            "status":"NOT_DEPLOYED"
         }
      ]
   },
   { 
      "id":"861f4684-c059-42b0-a105-5ae031df88ea",
      "createdAt":"2019-10-15 18:48:20",
      "features":[ 
         { 
            "id":"bfd1859d-4e64-4f5f-b4fd-11c21671cb7c",
            "name":"Reduzir payload de deployments e filtrar por hypothesis",
            "branches":[ 
               "https://github.com/ZupIT/darwin-application/tree/enhancement/reduce-and-fix-deployments-payload"
            ],
            "modules":[ 
               { 
                  "id":"be6f0bf2-9008-4d13-8966-09752cbba8f1",
                  "name":"ZupIT/darwin-application",
                  "labels":[ 

                  ]
               }
            ]
         },
         { 
            "id":"bfdc5565-60ae-435a-b796-1f847d86d682",
            "name":"Criar serviço de consulta de eventos [builds e deploys]",
            "branches":[ 
               "https://github.com/ZupIT/darwin-application/tree/feature/board-events"
            ],
            "modules":[ 
               { 
                  "id":"be6f0bf2-9008-4d13-8966-09752cbba8f1",
                  "name":"ZupIT/darwin-application",
                  "labels":[ 

                  ]
               }
            ]
         },
         { 
            "id":"79ec2095-2082-4dd8-9fdf-3c11348df318",
            "name":"Enhancement Darwin",
            "branches":[ 
               "https://github.com/ZupIT/darwin-ui/tree/enhancement-darwin"
            ],
            "modules":[ 
               { 
                  "id":"e9289c98-e017-40f4-9854-aeb529a1482f",
                  "name":"ZupIT/darwin-ui",
                  "labels":[ 

                  ]
               }
            ]
         },
         { 
            "id":"199d1323-b2a1-47e0-ac7f-69ab8c2ffe67",
            "name":"Modules Improvement",
            "branches":[ 
               "https://github.com/ZupIT/darwin-ui/tree/feature/modules_improvement"
            ],
            "modules":[ 
               { 
                  "id":"e9289c98-e017-40f4-9854-aeb529a1482f",
                  "name":"ZupIT/darwin-ui",
                  "labels":[ 

                  ]
               }
            ]
         },
         { 
            "id":"cf351760-7816-41eb-8ead-8b577fcde58e",
            "name":"Alterar polling frontend",
            "branches":[ 
               "https://github.com/ZupIT/darwin-ui/tree/feature/change-polling-frontend"
            ],
            "modules":[ 
               { 
                  "id":"e9289c98-e017-40f4-9854-aeb529a1482f",
                  "name":"ZupIT/darwin-ui",
                  "labels":[ 

                  ]
               }
            ]
         }
      ],
      "tag":"release-darwin-bundle-0-0-10",
      "status":"VALIDATED",
      "deployments":[ 
         { 
            "id":"f0946ec4-ab14-4f03-a939-b8475c58a86a",
            "createdAt":"2019-10-15 19:25:15",
            "buildId":"861f4684-c059-42b0-a105-5ae031df88ea",
            "tag":"release-darwin-bundle-0-0-10",
            "status":"NOT_DEPLOYED"
         },
         { 
            "id":"e1161c22-933f-464d-9dd6-ba276ac6ece3",
            "createdAt":"2019-10-15 18:55:16",
            "buildId":"861f4684-c059-42b0-a105-5ae031df88ea",
            "tag":"release-darwin-bundle-0-0-10",
            "status":"NOT_DEPLOYED"
         },
         { 
            "id":"500a9db1-c71f-4915-ae72-bc9ca71220e3",
            "createdAt":"2019-10-15 19:42:17",
            "buildId":"861f4684-c059-42b0-a105-5ae031df88ea",
            "tag":"release-darwin-bundle-0-0-10",
            "status":"NOT_DEPLOYED"
         },
         { 
            "id":"f88f4f19-031f-4fdc-81bf-9d68275e9e1b",
            "createdAt":"2019-10-15 19:50:52",
            "buildId":"861f4684-c059-42b0-a105-5ae031df88ea",
            "tag":"release-darwin-bundle-0-0-10",
            "status":"NOT_DEPLOYED"
         }
      ]
   },
   { 
      "id":"b9db3612-f1aa-4920-9b59-81a5d914d069",
      "createdAt":"2019-10-15 19:59:48",
      "features":[ 
         { 
            "id":"495f7f1f-853b-4f83-9e4c-460d0cbf8819",
            "name":"Inserir header x-circle-id no callback do spinnaker",
            "branches":[ 
               "https://github.com/ZupIT/darwin-deploy/tree/feature/spinnaker-callback-header"
            ],
            "modules":[ 
               { 
                  "id":"96b3a57b-0390-4fdc-ba0a-2a15ea021fd7",
                  "name":"ZupIT/darwin-deploy",
                  "labels":[ 

                  ]
               }
            ]
         }
      ],
      "tag":"release-darwin-remove-by-app-name-and-version",
      "status":"VALIDATED",
      "deployments":[ 
         { 
            "id":"473a46dc-088a-4322-b48a-9d62258d86d3",
            "createdAt":"2019-10-15 20:04:27",
            "buildId":"b9db3612-f1aa-4920-9b59-81a5d914d069",
            "tag":"release-darwin-remove-by-app-name-and-version",
            "status":"NOT_DEPLOYED"
         },
         { 
            "id":"2f6ec321-7a0b-4a8e-9371-3d6dec397d66",
            "createdAt":"2019-10-15 20:08:42",
            "buildId":"b9db3612-f1aa-4920-9b59-81a5d914d069",
            "tag":"release-darwin-remove-by-app-name-and-version",
            "status":"NOT_DEPLOYED"
         },
         { 
            "id":"e1003ceb-80cb-4975-b815-4445b6068495",
            "createdAt":"2019-10-15 20:22:03",
            "buildId":"b9db3612-f1aa-4920-9b59-81a5d914d069",
            "tag":"release-darwin-remove-by-app-name-and-version",
            "status":"NOT_DEPLOYED"
         }
      ]
   },
   { 
      "id":"561d81b6-1547-45e0-a3eb-8ca417734f66",
      "createdAt":"2019-10-15 20:10:45",
      "features":[ 
         { 
            "id":"495f7f1f-853b-4f83-9e4c-460d0cbf8819",
            "name":"Inserir header x-circle-id no callback do spinnaker",
            "branches":[ 
               "https://github.com/ZupIT/darwin-deploy/tree/feature/spinnaker-callback-header"
            ],
            "modules":[ 
               { 
                  "id":"96b3a57b-0390-4fdc-ba0a-2a15ea021fd7",
                  "name":"ZupIT/darwin-deploy",
                  "labels":[ 

                  ]
               }
            ]
         }
      ],
      "tag":"release-darwin-delete-with-app-and-version",
      "status":"VALIDATED",
      "deployments":[ 
         { 
            "id":"a7cc047e-1418-414d-82c0-5e0f5d4cae76",
            "createdAt":"2019-10-15 20:19:37",
            "buildId":"561d81b6-1547-45e0-a3eb-8ca417734f66",
            "tag":"release-darwin-delete-with-app-and-version",
            "status":"NOT_DEPLOYED"
         },
         { 
            "id":"0964c342-c316-4c36-8515-0cc23ec01156",
            "createdAt":"2019-10-15 20:13:26",
            "buildId":"561d81b6-1547-45e0-a3eb-8ca417734f66",
            "tag":"release-darwin-delete-with-app-and-version",
            "status":"NOT_DEPLOYED"
         },
         { 
            "id":"998d454b-06ae-4df5-a24e-80ae636b29c3",
            "createdAt":"2019-10-15 20:18:12",
            "buildId":"561d81b6-1547-45e0-a3eb-8ca417734f66",
            "tag":"release-darwin-delete-with-app-and-version",
            "status":"NOT_DEPLOYED"
         },
         { 
            "id":"8d3e080a-2dbe-4d3e-b060-75b8b02cfd76",
            "createdAt":"2019-10-15 20:25:44",
            "buildId":"561d81b6-1547-45e0-a3eb-8ca417734f66",
            "tag":"release-darwin-delete-with-app-and-version",
            "status":"NOT_DEPLOYED"
         }
      ]
   },
   { 
      "id":"929f1dae-44da-40da-b870-a57b0e22160b",
      "createdAt":"2019-10-15 20:29:02",
      "features":[ 
         { 
            "id":"495f7f1f-853b-4f83-9e4c-460d0cbf8819",
            "name":"Inserir header x-circle-id no callback do spinnaker",
            "branches":[ 
               "https://github.com/ZupIT/darwin-deploy/tree/feature/spinnaker-callback-header"
            ],
            "modules":[ 
               { 
                  "id":"96b3a57b-0390-4fdc-ba0a-2a15ea021fd7",
                  "name":"ZupIT/darwin-deploy",
                  "labels":[ 

                  ]
               }
            ]
         }
      ],
      "tag":"release-darwin-app-and-version-labels",
      "status":"VALIDATED",
      "deployments":[ 
         { 
            "id":"5bf862d7-3e16-484d-849d-10cea331a0f4",
            "createdAt":"2019-10-15 20:32:39",
            "buildId":"929f1dae-44da-40da-b870-a57b0e22160b",
            "tag":"release-darwin-app-and-version-labels",
            "status":"NOT_DEPLOYED"
         },
         { 
            "id":"67062873-8c86-4c21-8de7-ee28b23ed56d",
            "createdAt":"2019-10-15 20:38:11",
            "buildId":"929f1dae-44da-40da-b870-a57b0e22160b",
            "tag":"release-darwin-app-and-version-labels",
            "status":"NOT_DEPLOYED"
         }
      ]
   },
   { 
      "id":"d79e1cef-f18f-4871-a2f5-59e8863123de",
      "createdAt":"2019-10-15 20:44:14",
      "features":[ 
         { 
            "id":"495f7f1f-853b-4f83-9e4c-460d0cbf8819",
            "name":"Inserir header x-circle-id no callback do spinnaker",
            "branches":[ 
               "https://github.com/ZupIT/darwin-deploy/tree/feature/spinnaker-callback-header"
            ],
            "modules":[ 
               { 
                  "id":"96b3a57b-0390-4fdc-ba0a-2a15ea021fd7",
                  "name":"ZupIT/darwin-deploy",
                  "labels":[ 

                  ]
               }
            ]
         }
      ],
      "tag":"release-darwin-change-lib-array-of-strings",
      "status":"VALIDATED",
      "deployments":[ 
         { 
            "id":"d5262d4f-b2c3-49e0-9eba-1a6b61575bce",
            "createdAt":"2019-10-15 20:53:23",
            "buildId":"d79e1cef-f18f-4871-a2f5-59e8863123de",
            "tag":"release-darwin-change-lib-array-of-strings",
            "status":"NOT_DEPLOYED"
         },
         { 
            "id":"87267b08-195c-4bdc-b5ab-9e7fcccb225e",
            "createdAt":"2019-10-15 20:46:48",
            "buildId":"d79e1cef-f18f-4871-a2f5-59e8863123de",
            "tag":"release-darwin-change-lib-array-of-strings",
            "status":"NOT_DEPLOYED"
         },
         { 
            "id":"d98e90d3-f7cd-4fd0-8ade-02061b65d15a",
            "createdAt":"2019-10-15 20:51:14",
            "buildId":"d79e1cef-f18f-4871-a2f5-59e8863123de",
            "tag":"release-darwin-change-lib-array-of-strings",
            "status":"NOT_DEPLOYED"
         }
      ]
   },
   { 
      "id":"0a54deec-f8a2-41e3-b5c6-f5282e7b1a8a",
      "createdAt":"2019-10-18 20:22:36",
      "features":[ 
         { 
            "id":"4028eb03-ad80-4ce2-8a1f-a1ee5e745205",
            "name":"Criar stubs + testes unitarios para deploy",
            "branches":[ 
               "https://github.com/ZupIT/darwin-deploy/tree/feature/stub-and-tests"
            ],
            "modules":[ 
               { 
                  "id":"96b3a57b-0390-4fdc-ba0a-2a15ea021fd7",
                  "name":"ZupIT/darwin-deploy",
                  "labels":[ 

                  ]
               }
            ]
         }
      ],
      "tag":"release-darwin-deploy-stub-and-tests",
      "status":"VALIDATED",
      "deployments":[ 
         { 
            "id":"2dfd8352-7f36-4819-a7fe-63ef9b353b58",
            "createdAt":"2019-10-18 20:43:16",
            "buildId":"0a54deec-f8a2-41e3-b5c6-f5282e7b1a8a",
            "tag":"release-darwin-deploy-stub-and-tests",
            "status":"NOT_DEPLOYED"
         },
         { 
            "id":"d821daf4-9e8d-40a1-a4d6-84cb64b7201f",
            "createdAt":"2019-10-18 20:43:35",
            "buildId":"0a54deec-f8a2-41e3-b5c6-f5282e7b1a8a",
            "tag":"release-darwin-deploy-stub-and-tests",
            "status":"NOT_DEPLOYED"
         },
         { 
            "id":"77b4a34e-d781-40c2-bda4-88d3262b644c",
            "createdAt":"2019-10-18 20:25:50",
            "buildId":"0a54deec-f8a2-41e3-b5c6-f5282e7b1a8a",
            "tag":"release-darwin-deploy-stub-and-tests",
            "status":"NOT_DEPLOYED"
         }
      ]
   },
   { 
      "id":"bc88c82c-f13e-4fec-8316-c630a6366e4a",
      "createdAt":"2019-10-22 13:27:26",
      "features":[ 
         { 
            "id":"ede13fd6-131b-459c-9c92-438243c1f6fa",
            "name":"Save AWS registry configurations on vault",
            "branches":[ 
               "https://github.com/ZupIT/darwin-application/tree/enhancement/aws-registry-configurations"
            ],
            "modules":[ 
               { 
                  "id":"be6f0bf2-9008-4d13-8966-09752cbba8f1",
                  "name":"ZupIT/darwin-application",
                  "labels":[ 

                  ]
               }
            ]
         }
      ],
      "tag":"release-darwin-aws-registry-fields",
      "status":"VALIDATED",
      "deployments":[ 
         { 
            "id":"f806c54e-42ae-472b-9acc-8ed64d0f5e63",
            "createdAt":"2019-10-22 13:35:26",
            "buildId":"bc88c82c-f13e-4fec-8316-c630a6366e4a",
            "tag":"release-darwin-aws-registry-fields",
            "status":"NOT_DEPLOYED"
         },
         { 
            "id":"78b40f71-3b65-44d8-be2a-2a1576bfa8ed",
            "createdAt":"2019-10-23 13:01:20",
            "buildId":"bc88c82c-f13e-4fec-8316-c630a6366e4a",
            "tag":"release-darwin-aws-registry-fields",
            "status":"NOT_DEPLOYED"
         },
         { 
            "id":"c1a7acba-d508-4c3f-9f19-ad6d1898ee43",
            "createdAt":"2019-10-23 13:00:20",
            "buildId":"bc88c82c-f13e-4fec-8316-c630a6366e4a",
            "tag":"release-darwin-aws-registry-fields",
            "status":"NOT_DEPLOYED"
         },
         { 
            "id":"91802e5a-ff71-4fab-a23d-43fb296452d7",
            "createdAt":"2019-10-25 16:54:23",
            "buildId":"bc88c82c-f13e-4fec-8316-c630a6366e4a",
            "tag":"release-darwin-aws-registry-fields",
            "status":"DEPLOYED"
         },
         { 
            "id":"62c54008-1565-4943-b2c4-9c66032130e1",
            "createdAt":"2019-10-25 14:54:36",
            "buildId":"bc88c82c-f13e-4fec-8316-c630a6366e4a",
            "tag":"release-darwin-aws-registry-fields",
            "status":"NOT_DEPLOYED"
         }
      ]
   }
]

module.exports = {
  board,
  status,
  hypothesis,
  deployments,
  validated,
}
