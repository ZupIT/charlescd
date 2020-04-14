const card = { 
  "id":"eb885276-75cc-40c1-8260-36078a3d1c65",
  "name":"Notificar moove em todos os casos de falha de deploy",
  "description":"<p>Deploy não está notificando em todos os casos</p>",
  "column":{ 
     "id":"21825c71-12dc-441f-ac5d-9fc05d2bda8b",
     "name":"backlog"
  },
  "author":{ 
     "id":"252ca79e-12b5-4f70-92b0-4d8ad1cbacbb",
     "name":"Lucas Fernandes",
     "email":"lucas.fernandes@zup.com.br",
     "photoUrl":"https://trello-avatars.s3.amazonaws.com/8875e07c0e38cd13be71e51986c661b2/original.png"
  },
  "createdAt":"2019-10-02 18:25:17",
  "labels":[ 

  ],
  "type":"FEATURE",
  "feature":{ 
     "id":"710c5c16-fa43-414e-ad01-7023e8691ff7",
     "name":"Notificar moove em todos os casos de falha de deploy",
     "branchName":"bugfix/deploy-failure-notification",
     "author":{ 
        "id":"252ca79e-12b5-4f70-92b0-4d8ad1cbacbb",
        "name":"Lucas Fernandes",
        "email":"lucas.fernandes@zup.com.br",
        "photoUrl":"https://trello-avatars.s3.amazonaws.com/8875e07c0e38cd13be71e51986c661b2/original.png"
     },
     "modules":[ 
        { 
           "id":"96b3a57b-0390-4fdc-ba0a-2a15ea021fd7",
           "name":"ZupIT/darwin-deploy",
           "gitRepositoryAddress":"https://github.com/ZupIT/darwin-deploy",
           "gitConfigurationId":"052789e8-bbab-4c93-9f88-b4bdd8899028",
           "registryConfigurationId":"9f2228b8-a58f-4fe3-bc87-8bbb9f7515c9",
           "cdConfigurationId":"35c6dad1-f34f-4498-bdb9-38bc19ebac38",
           "createdAt":"2019-09-30 21:40:30",
           "author":{ 
              "id":"a59186d2-ed6c-4a8d-a1cb-b5bfe450804f",
              "name":"Mateus Cruz",
              "email":"mateus.cruz@zup.com.br",
              "photoUrl":"https://avatars1.githubusercontent.com/u/13343278?s=460&v=4"
           },
           "labels":[ 

           ],
           "components":[ 
              { 
                 "id":"0acae832-a024-4628-9043-c17a9056e53f",
                 "name":"darwin-deploy",
                 "contextPath":"/",
                 "port":3000,
                 "healthCheck":"/healthcheck",
                 "createdAt":"2019-09-30 21:40:30",
                 "moduleId":"96b3a57b-0390-4fdc-ba0a-2a15ea021fd7",
                 "artifacts":[ 
                    { 
                       "id":"426105d5-8db1-4966-8ae2-2614d65a9bde",
                       "artifact":"realwavelab.azurecr.io/darwin-deploy:darwin-first-deploy",
                       "version":"darwin-first-deploy",
                       "createdAt":"2019-10-07 15:25:05",
                       "buildId":"7ae21c7b-48b0-43d5-818a-34968648898b",
                       "componentId":"0acae832-a024-4628-9043-c17a9056e53f"
                    },
                    { 
                       "id":"6ed4a085-a40d-4863-8950-29f8b9b3cd3f",
                       "artifact":"realwavelab.azurecr.io/darwin-deploy:darwin-new-lib-spinnaker-with-regex",
                       "version":"darwin-new-lib-spinnaker-with-regex",
                       "createdAt":"2019-10-08 14:41:55",
                       "buildId":"36e20433-e670-478f-85f7-0daca0b9698f",
                       "componentId":"0acae832-a024-4628-9043-c17a9056e53f"
                    },
                    { 
                       "id":"25a8d542-fd94-4db4-8eae-722fcabb088d",
                       "artifact":"realwavelab.azurecr.io/darwin-deploy:darwin-x-circle-id-cookie-header-name",
                       "version":"darwin-x-circle-id-cookie-header-name",
                       "createdAt":"2019-10-08 17:53:08",
                       "buildId":"4d1f1263-54d6-498b-8a3b-96802e01bbe7",
                       "componentId":"0acae832-a024-4628-9043-c17a9056e53f"
                    },
                    { 
                       "id":"feff4756-115a-4345-a379-79284989d060",
                       "artifact":"realwavelab.azurecr.io/darwin-deploy:darwin-consul-integration",
                       "version":"darwin-consul-integration",
                       "createdAt":"2019-10-14 20:51:05",
                       "buildId":"eba6a315-e8c9-471f-ae74-1d9e114de066",
                       "componentId":"0acae832-a024-4628-9043-c17a9056e53f"
                    },
                    { 
                       "id":"9f243e29-88a2-4bc8-81ea-c101399a778c",
                       "artifact":"realwavelab.azurecr.io/darwin-deploy:darwin-consul-deploy",
                       "version":"darwin-consul-deploy",
                       "createdAt":"2019-10-14 20:51:25",
                       "buildId":"25fc31c6-4aca-4cdf-acaa-0dc52a6728bd",
                       "componentId":"0acae832-a024-4628-9043-c17a9056e53f"
                    },
                    { 
                       "id":"3ab6ac81-a754-4fdb-b1d5-1ceb42391ae2",
                       "artifact":"realwavelab.azurecr.io/darwin-deploy:darwin-consul-new-deploy",
                       "version":"darwin-consul-new-deploy",
                       "createdAt":"2019-10-14 21:24:45",
                       "buildId":"f0af811b-5de4-497f-89b4-0e6f493c5e83",
                       "componentId":"0acae832-a024-4628-9043-c17a9056e53f"
                    },
                    { 
                       "id":"f95cb7c0-bac4-4401-80a0-c64af43f829e",
                       "artifact":"realwavelab.azurecr.io/darwin-deploy:darwin-update-spinnaker-interaction",
                       "version":"darwin-update-spinnaker-interaction",
                       "createdAt":"2019-10-15 19:36:47",
                       "buildId":"c864fd8b-c21a-4b84-b5b9-30d3100dbb7e",
                       "componentId":"0acae832-a024-4628-9043-c17a9056e53f"
                    },
                    { 
                       "id":"23f5d554-d497-4e47-ab95-40904d1fcac3",
                       "artifact":"realwavelab.azurecr.io/darwin-deploy:darwin-remove-by-app-name-and-version",
                       "version":"darwin-remove-by-app-name-and-version",
                       "createdAt":"2019-10-15 20:03:06",
                       "buildId":"b9db3612-f1aa-4920-9b59-81a5d914d069",
                       "componentId":"0acae832-a024-4628-9043-c17a9056e53f"
                    },
                    { 
                       "id":"83ce39b1-4d89-441a-b9ad-6b4d6a7a3871",
                       "artifact":"realwavelab.azurecr.io/darwin-deploy:darwin-delete-with-app-and-version",
                       "version":"darwin-delete-with-app-and-version",
                       "createdAt":"2019-10-15 20:13:06",
                       "buildId":"561d81b6-1547-45e0-a3eb-8ca417734f66",
                       "componentId":"0acae832-a024-4628-9043-c17a9056e53f"
                    },
                    { 
                       "id":"06ecbbcf-864f-47c5-8b05-686efc762606",
                       "artifact":"realwavelab.azurecr.io/darwin-deploy:darwin-app-and-version-labels",
                       "version":"darwin-app-and-version-labels",
                       "createdAt":"2019-10-15 20:31:46",
                       "buildId":"929f1dae-44da-40da-b870-a57b0e22160b",
                       "componentId":"0acae832-a024-4628-9043-c17a9056e53f"
                    },
                    { 
                       "id":"e2bac1ea-8e94-48e6-92b8-c0323ef8534b",
                       "artifact":"realwavelab.azurecr.io/darwin-deploy:darwin-change-lib-array-of-strings",
                       "version":"darwin-change-lib-array-of-strings",
                       "createdAt":"2019-10-15 20:46:26",
                       "buildId":"d79e1cef-f18f-4871-a2f5-59e8863123de",
                       "componentId":"0acae832-a024-4628-9043-c17a9056e53f"
                    },
                    { 
                       "id":"f6350cab-b6ef-4dee-90ef-55a78a3c204a",
                       "artifact":"realwavelab.azurecr.io/darwin-deploy:darwin-deploy-stub-and-tests",
                       "version":"darwin-deploy-stub-and-tests",
                       "createdAt":"2019-10-18 20:25:26",
                       "buildId":"0a54deec-f8a2-41e3-b5c6-f5282e7b1a8a",
                       "componentId":"0acae832-a024-4628-9043-c17a9056e53f"
                    }
                 ]
              }
           ]
        }
     ],
     "createdAt":"2019-10-02 18:25:17",
     "branches":[ 
        "https://github.com/ZupIT/darwin-deploy/tree/bugfix/deploy-failure-notification"
     ]
  },
  "comments":[ 
     { 
        "id":"7424a446-faa6-41e8-826a-c9544b6bfdf7",
        "comment":"Em casos de falha, o moove não é notificado",
        "author":{ 
           "id":"252ca79e-12b5-4f70-92b0-4d8ad1cbacbb",
           "name":"Lucas Fernandes",
           "email":"lucas.fernandes@zup.com.br",
           "photoUrl":"https://trello-avatars.s3.amazonaws.com/8875e07c0e38cd13be71e51986c661b2/original.png"
        },
        "createdAt":"2019-10-02 18:26:20"
     }
  ],
  "hypothesisId":"89412d05-2468-4483-bec2-c5e2c052710e",
  "members":[ 
     { 
        "id":"ad3430af-f60e-4574-afa9-2cead12f695b",
        "name":"Jeias Soares",
        "email":"jeias.soares@zup.com.br",
        "photoUrl":"https://avatars1.githubusercontent.com/u/46794198?s=460&v=4"
     },
     { 
        "id":"252ca79e-12b5-4f70-92b0-4d8ad1cbacbb",
        "name":"Lucas Fernandes",
        "email":"lucas.fernandes@zup.com.br",
        "photoUrl":"https://trello-avatars.s3.amazonaws.com/8875e07c0e38cd13be71e51986c661b2/original.png"
     }
  ],
  "index":0
}

module.exports = {
  card,
}
