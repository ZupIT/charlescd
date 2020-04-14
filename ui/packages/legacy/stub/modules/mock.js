const modules = { 
  "content":[ 
     { 
        "id":"4d4cf7a9-d2f5-46b0-852e-e1b586b71c58",
        "name":"Ismaley/payments-tracing-sample",
        "gitRepositoryAddress":"address",
        "gitConfigurationId":"",
        "registryConfigurationId":"",
        "cdConfigurationId":"",
        "createdAt":"2019-09-13 21:22:05",
        "author":{ 
           "id":"9e9d4cc0-c409-4cf7-9a1a-ba08c06267e2",
           "name":"Ismaley Viana",
           "email":"ismaley.viana@zup.com.br",
           "photoUrl":"https://avatars0.githubusercontent.com/u/22107748?s=460&v=4"
        },
        "labels":[ 
           { 
              "id":"e80a8480-7e6f-407e-bae6-3a1ebb23e6db",
              "name":"Darwin - eb42ba9e-99c0-4c65-94be-e42995430b41",
              "createdAt":"2019-09-12 18:34:28",
              "author":{ 
                 "id":"4088f7c0-8fc4-44fa-be96-7784e9ca07b0",
                 "name":"Kadu Artur",
                 "email":"kadu.prussek@zup.com.br",
                 "photoUrl":"https://trello-avatars.s3.amazonaws.com/b25f103e534a60093e5b8977dcf9ddd1/original.png"
              },
              "hexColor":"BBAADD"
           }
        ],
        "components":[ 
           { 
              "id":"89f59cf1-5cea-4c24-ac2f-fe719cdaae8f",
              "name":"payments-tracing-sample",
              "contextPath":"/payments-tracing",
              "port":3000,
              "healthCheck":"/payments-tracing/health",
              "createdAt":"2019-09-13 21:22:06",
              "moduleId":"4d4cf7a9-d2f5-46b0-852e-e1b586b71c58",
              "artifacts":[ 

              ]
           }
        ]
     },
     { 
        "id":"41e218b5-1005-4f7c-9e02-f543be9e03f0",
        "name":"ZupIT/darwin-beagle-framework",
        "gitRepositoryAddress":"https://github.com/ZupIT/darwin-beagle-framework",
        "gitConfigurationId":"91da90cf-38d9-4ee1-944c-382092508387",
        "registryConfigurationId":"9f2228b8-a58f-4fe3-bc87-8bbb9f7515c9",
        "cdConfigurationId":"35c6dad1-f34f-4498-bdb9-38bc19ebac38",
        "createdAt":"2019-10-08 13:19:03",
        "author":{ 
           "id":"b6f84c09-ab56-41b4-81d1-ff85ef40fcaa",
           "name":"Sandokan Dias",
           "email":"sandokan.dias@zup.com.br",
           "photoUrl":"https://trello-avatars.s3.amazonaws.com/2c5310e5abf70c4f4e80c12e23ceadc4/original.png"
        },
        "labels":[ 

        ],
        "components":[ 
           { 
              "id":"2060a5f6-6fbc-455a-8c6a-1bf0a1bf07a5",
              "name":"darwin-beagle-framework",
              "contextPath":"/",
              "port":8080,
              "healthCheck":"/actuator/health",
              "createdAt":"2019-10-08 13:19:03",
              "moduleId":"41e218b5-1005-4f7c-9e02-f543be9e03f0",
              "artifacts":[ 
                 { 
                    "id":"5a15b2b0-f174-4ba3-9aa5-7b645e43c7a0",
                    "artifact":"realwavelab.azurecr.io/darwin-beagle-framework:darwin-initial-version-02",
                    "version":"darwin-initial-version-02",
                    "createdAt":"2019-10-09 18:35:55",
                    "buildId":"847b05a3-8123-4e64-87a7-50b7a1247629",
                    "componentId":"2060a5f6-6fbc-455a-8c6a-1bf0a1bf07a5"
                 },
                 { 
                    "id":"a7d14d2e-c176-4d19-87ec-21c8fbd0961e",
                    "artifact":"realwavelab.azurecr.io/darwin-beagle-framework:darwin-initial-version-03",
                    "version":"darwin-initial-version-03",
                    "createdAt":"2019-10-09 18:59:25",
                    "buildId":"3fbe613b-a1c7-4632-a75f-7653c1659981",
                    "componentId":"2060a5f6-6fbc-455a-8c6a-1bf0a1bf07a5"
                 },
                 { 
                    "id":"80062c52-4dae-45a4-bab8-a9aff821eacb",
                    "artifact":"realwavelab.azurecr.io/darwin-beagle-framework:darwin-initial-version-04",
                    "version":"darwin-initial-version-04",
                    "createdAt":"2019-10-09 19:21:18",
                    "buildId":"c8ca41f9-7b62-4037-8782-cc80f0ed5883",
                    "componentId":"2060a5f6-6fbc-455a-8c6a-1bf0a1bf07a5"
                 }
              ]
           }
        ]
     },
     { 
        "id":"be6f0bf2-9008-4d13-8966-09752cbba8f1",
        "name":"ZupIT/darwin-application",
        "gitRepositoryAddress":"https://github.com/ZupIT/darwin-application",
        "gitConfigurationId":"052789e8-bbab-4c93-9f88-b4bdd8899028",
        "registryConfigurationId":"9f2228b8-a58f-4fe3-bc87-8bbb9f7515c9",
        "cdConfigurationId":"35c6dad1-f34f-4498-bdb9-38bc19ebac38",
        "createdAt":"2019-09-30 21:36:56",
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
              "id":"7224aa97-1f94-4679-917d-9c7bb10074ab",
              "name":"darwin-application",
              "contextPath":"/",
              "port":8080,
              "healthCheck":"/actuator/health",
              "createdAt":"2019-09-30 21:36:56",
              "moduleId":"be6f0bf2-9008-4d13-8966-09752cbba8f1",
              "artifacts":[ 
                 { 
                    "id":"3acc6da9-97c9-4299-af55-253aea02339e",
                    "artifact":"realwavelab.azurecr.io/darwin-application:darwin-fix-docker-file-02",
                    "version":"darwin-fix-docker-file-02",
                    "createdAt":"2019-10-04 20:38:25",
                    "buildId":"c2e3f39c-77fc-4cbe-87ed-68628fba4c04",
                    "componentId":"7224aa97-1f94-4679-917d-9c7bb10074ab"
                 },
                 { 
                    "id":"87a5c732-ea94-4150-add8-228ddca38225",
                    "artifact":"realwavelab.azurecr.io/darwin-application:darwin-fix-docker-file-01",
                    "version":"darwin-fix-docker-file-01",
                    "createdAt":"2019-10-04 19:30:45",
                    "buildId":"a050a93a-22be-49f2-a245-c19c21c9f49e",
                    "componentId":"7224aa97-1f94-4679-917d-9c7bb10074ab"
                 },
                 { 
                    "id":"abfd135d-a6dd-473d-9ca3-98fab61f14db",
                    "artifact":"realwavelab.azurecr.io/darwin-application:darwin-blue-message-updated",
                    "version":"darwin-blue-message-updated",
                    "createdAt":"2019-10-04 21:15:15",
                    "buildId":"98e218f7-9f25-4ea3-a418-79fc6eb03b48",
                    "componentId":"7224aa97-1f94-4679-917d-9c7bb10074ab"
                 },
                 { 
                    "id":"8c3fcb46-b53a-4ebc-a2db-306024a935e7",
                    "artifact":"realwavelab.azurecr.io/darwin-application:darwin-removing-deploy-call-on-villager-callback",
                    "version":"darwin-removing-deploy-call-on-villager-callback",
                    "createdAt":"2019-10-08 13:23:55",
                    "buildId":"de90205b-ae00-45b1-9f27-af44bb1fb59b",
                    "componentId":"7224aa97-1f94-4679-917d-9c7bb10074ab"
                 },
                 { 
                    "id":"9fd97548-7ce9-47db-bf0a-b438ef050637",
                    "artifact":"realwavelab.azurecr.io/darwin-application:darwin-archive-and-delete-builds-and-cards",
                    "version":"darwin-archive-and-delete-builds-and-cards",
                    "createdAt":"2019-10-10 19:37:05",
                    "buildId":"a184c85a-c328-4af6-aae3-d87e0e14eacb",
                    "componentId":"7224aa97-1f94-4679-917d-9c7bb10074ab"
                 },
                 { 
                    "id":"7851c12e-ea13-4425-81f3-be4a808ba086",
                    "artifact":"realwavelab.azurecr.io/darwin-application:darwin-fix-front-archive-delete-04",
                    "version":"darwin-fix-front-archive-delete-04",
                    "createdAt":"2019-10-10 22:24:03",
                    "buildId":"0a2ebc24-df20-4e47-a9ce-75dd8dcbbf5d",
                    "componentId":"7224aa97-1f94-4679-917d-9c7bb10074ab"
                 },
                 { 
                    "id":"7cb4fab9-f516-48f6-af72-e82cdd3a281c",
                    "artifact":"null/darwin-application:darwin-bundle-0-0-6",
                    "version":"darwin-bundle-0-0-6",
                    "createdAt":"2019-10-11 20:10:44",
                    "buildId":"4b1b38e2-878e-4149-bae6-a8e31dfb0c48",
                    "componentId":"7224aa97-1f94-4679-917d-9c7bb10074ab"
                 },
                 { 
                    "id":"6e347fdd-fdd5-4bb2-8654-564f9a3aa39e",
                    "artifact":"realwavelab.azurecr.io/darwin-application:darwin-bundle-0-0-7",
                    "version":"darwin-bundle-0-0-7",
                    "createdAt":"2019-10-11 20:36:45",
                    "buildId":"0e796045-55f6-47a7-97f2-530a644f4527",
                    "componentId":"7224aa97-1f94-4679-917d-9c7bb10074ab"
                 },
                 { 
                    "id":"76852d35-a19a-4848-a9e3-bdcdfd2f2042",
                    "artifact":"realwavelab.azurecr.io/darwin-application:darwin-bundle-0-0-9",
                    "version":"darwin-bundle-0-0-9",
                    "createdAt":"2019-10-11 21:32:06",
                    "buildId":"01c6a677-ccaf-4577-941b-38e32f5c8442",
                    "componentId":"7224aa97-1f94-4679-917d-9c7bb10074ab"
                 },
                 { 
                    "id":"5e2a8fa8-8b65-4aa7-90c5-56a554b9eb26",
                    "artifact":"realwavelab.azurecr.io/darwin-application:darwin-board-events-service-beta-0-0-1",
                    "version":"darwin-board-events-service-beta-0-0-1",
                    "createdAt":"2019-10-14 20:50:57",
                    "buildId":"2f7153dd-90d5-4faf-95b4-752d92f02cfe",
                    "componentId":"7224aa97-1f94-4679-917d-9c7bb10074ab"
                 },
                 { 
                    "id":"d82b9eff-c628-4693-9bca-c2be6d149a82",
                    "artifact":"realwavelab.azurecr.io/darwin-application:darwin-consul-deploy",
                    "version":"darwin-consul-deploy",
                    "createdAt":"2019-10-14 20:51:25",
                    "buildId":"25fc31c6-4aca-4cdf-acaa-0dc52a6728bd",
                    "componentId":"7224aa97-1f94-4679-917d-9c7bb10074ab"
                 },
                 { 
                    "id":"8834223e-c33b-4647-95f0-c4d8cead8057",
                    "artifact":"realwavelab.azurecr.io/darwin-application:darwin-consul-new-deploy",
                    "version":"darwin-consul-new-deploy",
                    "createdAt":"2019-10-14 21:24:45",
                    "buildId":"f0af811b-5de4-497f-89b4-0e6f493c5e83",
                    "componentId":"7224aa97-1f94-4679-917d-9c7bb10074ab"
                 },
                 { 
                    "id":"55880785-7c3a-4c50-bd7e-8c026cfeccec",
                    "artifact":"realwavelab.azurecr.io/darwin-application:darwin-bundle-0-0-10",
                    "version":"darwin-bundle-0-0-10",
                    "createdAt":"2019-10-15 18:54:57",
                    "buildId":"861f4684-c059-42b0-a105-5ae031df88ea",
                    "componentId":"7224aa97-1f94-4679-917d-9c7bb10074ab"
                 },
                 { 
                    "id":"5eb9da50-7bf2-4a43-af13-08726479f08b",
                    "artifact":"realwavelab.azurecr.io/darwin-application:darwin-intermediary-branch",
                    "version":"darwin-intermediary-branch",
                    "createdAt":"2019-10-18 18:00:06",
                    "buildId":"ebaf02a6-17d5-49a4-aadd-c45415a7679b",
                    "componentId":"7224aa97-1f94-4679-917d-9c7bb10074ab"
                 },
                 { 
                    "id":"e5f515cb-d69c-4373-a5f1-a9e7b2f94ba3",
                    "artifact":"realwavelab.azurecr.io/darwin-application:darwin-intermediary-branch-02",
                    "version":"darwin-intermediary-branch-02",
                    "createdAt":"2019-10-18 18:12:47",
                    "buildId":"f9c44346-d2c5-4eb1-8de9-75de65e46082",
                    "componentId":"7224aa97-1f94-4679-917d-9c7bb10074ab"
                 },
                 { 
                    "id":"8e79bcc5-3a51-439e-bad9-bc7a38551fad",
                    "artifact":"realwavelab.azurecr.io/darwin-application:darwin-aws-registry-fields",
                    "version":"darwin-aws-registry-fields",
                    "createdAt":"2019-10-22 13:33:07",
                    "buildId":"bc88c82c-f13e-4fec-8316-c630a6366e4a",
                    "componentId":"7224aa97-1f94-4679-917d-9c7bb10074ab"
                 },
                 { 
                    "id":"8b40dffa-467e-4eef-9402-c780ea86223d",
                    "artifact":"realwavelab.azurecr.io/darwin-application:darwin-tets-release",
                    "version":"darwin-tets-release",
                    "createdAt":"2019-10-23 12:35:35",
                    "buildId":"872d8760-29cf-483c-9528-f5a108f701ce",
                    "componentId":"7224aa97-1f94-4679-917d-9c7bb10074ab"
                 }
              ]
           }
        ]
     },
     { 
        "id":"baf82f10-b5ab-495a-85a7-41ff94824776",
        "name":"ZupIT/darwin-villager",
        "gitRepositoryAddress":"https://github.com/ZupIT/darwin-villager",
        "gitConfigurationId":"052789e8-bbab-4c93-9f88-b4bdd8899028",
        "registryConfigurationId":"9f2228b8-a58f-4fe3-bc87-8bbb9f7515c9",
        "cdConfigurationId":"35c6dad1-f34f-4498-bdb9-38bc19ebac38",
        "createdAt":"2019-09-30 21:38:38",
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
              "id":"d6aa6f5b-13de-4409-ba3f-a6a9753cf7b6",
              "name":"darwin-villager",
              "contextPath":"/",
              "port":8080,
              "healthCheck":"/health",
              "createdAt":"2019-09-30 21:38:38",
              "moduleId":"baf82f10-b5ab-495a-85a7-41ff94824776",
              "artifacts":[ 
                 { 
                    "id":"e335052f-2bfd-421e-bd2d-648c54e4619f",
                    "artifact":"realwavelab.azurecr.io/darwin-villager:darwin-fist-deploy-villager",
                    "version":"darwin-fist-deploy-villager",
                    "createdAt":"2019-10-07 14:47:38",
                    "buildId":"740c8f8d-d5f3-4ce0-b0e5-15a3970bf8c1",
                    "componentId":"d6aa6f5b-13de-4409-ba3f-a6a9753cf7b6"
                 },
                 { 
                    "id":"4f906a8d-b231-467b-8d4d-fcc1f82778a9",
                    "artifact":"realwavelab.azurecr.io/darwin-villager:darwin-fix-villager-image-names-issue",
                    "version":"darwin-fix-villager-image-names-issue",
                    "createdAt":"2019-10-11 19:15:43",
                    "buildId":"d7b31ce1-e72f-4c04-9d11-a4459aa97cd6",
                    "componentId":"d6aa6f5b-13de-4409-ba3f-a6a9753cf7b6"
                 },
                 { 
                    "id":"82bbe41d-d6fd-4e00-a60f-b0753af94386",
                    "artifact":"null/darwin-villager:darwin-bundle-0-0-6",
                    "version":"darwin-bundle-0-0-6",
                    "createdAt":"2019-10-11 20:10:44",
                    "buildId":"4b1b38e2-878e-4149-bae6-a8e31dfb0c48",
                    "componentId":"d6aa6f5b-13de-4409-ba3f-a6a9753cf7b6"
                 },
                 { 
                    "id":"e44dfc7d-5768-43c1-bbbe-a35950f2e76f",
                    "artifact":"realwavelab.azurecr.io/darwin-villager:darwin-bundle-0-0-7",
                    "version":"darwin-bundle-0-0-7",
                    "createdAt":"2019-10-11 20:36:45",
                    "buildId":"0e796045-55f6-47a7-97f2-530a644f4527",
                    "componentId":"d6aa6f5b-13de-4409-ba3f-a6a9753cf7b6"
                 },
                 { 
                    "id":"962c2f31-cc38-4ae6-8e7b-759a99816fee",
                    "artifact":"realwavelab.azurecr.io/darwin-villager:darwin-bundle-0-0-9",
                    "version":"darwin-bundle-0-0-9",
                    "createdAt":"2019-10-11 21:32:05",
                    "buildId":"01c6a677-ccaf-4577-941b-38e32f5c8442",
                    "componentId":"d6aa6f5b-13de-4409-ba3f-a6a9753cf7b6"
                 },
                 { 
                    "id":"c8c53bcd-d6c3-434b-8388-b3d397189521",
                    "artifact":"realwavelab.azurecr.io/darwin-villager:darwin-aws-registry-integration",
                    "version":"darwin-aws-registry-integration",
                    "createdAt":"2019-10-22 16:29:06",
                    "buildId":"3fffef74-967f-4d74-b6f6-4c858ffefaa6",
                    "componentId":"d6aa6f5b-13de-4409-ba3f-a6a9753cf7b6"
                 }
              ]
           }
        ]
     },
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
     },
     { 
        "id":"e9289c98-e017-40f4-9854-aeb529a1482f",
        "name":"ZupIT/darwin-ui",
        "gitRepositoryAddress":"https://github.com/ZupIT/darwin-ui",
        "gitConfigurationId":"052789e8-bbab-4c93-9f88-b4bdd8899028",
        "registryConfigurationId":"9f2228b8-a58f-4fe3-bc87-8bbb9f7515c9",
        "cdConfigurationId":"35c6dad1-f34f-4498-bdb9-38bc19ebac38",
        "createdAt":"2019-09-30 21:47:19",
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
              "id":"e1e51e32-7ceb-4c8a-bd21-f358cb2c3a8d",
              "name":"darwin-ui-auth",
              "contextPath":"/",
              "port":3001,
              "healthCheck":"/auth",
              "createdAt":"2019-09-30 21:47:19",
              "moduleId":"e9289c98-e017-40f4-9854-aeb529a1482f",
              "artifacts":[ 
                 { 
                    "id":"2082e073-ad6e-4e46-ad0b-f74949e5c14b",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-auth:darwin-teste-front-lib-01",
                    "version":"darwin-teste-front-lib-01",
                    "createdAt":"2019-10-04 17:08:45",
                    "buildId":"1b73a17b-5725-461f-9665-ebedc06f1d57",
                    "componentId":"e1e51e32-7ceb-4c8a-bd21-f358cb2c3a8d"
                 },
                 { 
                    "id":"f1995157-20a4-49cb-98b1-6d3dc2f316f6",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-auth:darwin-teste-front-lib-01",
                    "version":"darwin-teste-front-lib-01",
                    "createdAt":"2019-10-04 17:08:55",
                    "buildId":"1b73a17b-5725-461f-9665-ebedc06f1d57",
                    "componentId":"e1e51e32-7ceb-4c8a-bd21-f358cb2c3a8d"
                 },
                 { 
                    "id":"ed4caba8-6648-46ae-a3dd-581bafeddb40",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-auth:darwin-teste-front-lib-01",
                    "version":"darwin-teste-front-lib-01",
                    "createdAt":"2019-10-04 17:09:05",
                    "buildId":"1b73a17b-5725-461f-9665-ebedc06f1d57",
                    "componentId":"e1e51e32-7ceb-4c8a-bd21-f358cb2c3a8d"
                 },
                 { 
                    "id":"9e7e1847-3660-495b-a8f8-7454a2ca2c74",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-auth:darwin-teste-front-lib-01",
                    "version":"darwin-teste-front-lib-01",
                    "createdAt":"2019-10-04 17:09:15",
                    "buildId":"1b73a17b-5725-461f-9665-ebedc06f1d57",
                    "componentId":"e1e51e32-7ceb-4c8a-bd21-f358cb2c3a8d"
                 },
                 { 
                    "id":"ac61099e-eed4-4386-95b6-bc92bd870ebb",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-auth:darwin-send-all-headers",
                    "version":"darwin-send-all-headers",
                    "createdAt":"2019-10-04 18:57:36",
                    "buildId":"26e2987d-efb7-4b7f-a020-93fd688662f7",
                    "componentId":"e1e51e32-7ceb-4c8a-bd21-f358cb2c3a8d"
                 },
                 { 
                    "id":"de6a9de2-2202-4213-bdf0-00412d48a5a3",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-auth:darwin-undo-nginx",
                    "version":"darwin-undo-nginx",
                    "createdAt":"2019-10-05 02:07:55",
                    "buildId":"ff5c41e2-cbc6-422e-a6e5-b0bfb0f5a4d0",
                    "componentId":"e1e51e32-7ceb-4c8a-bd21-f358cb2c3a8d"
                 },
                 { 
                    "id":"dba25be7-1204-49f7-a52b-ae85c140853b",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-auth:darwin-lolo-cache-control",
                    "version":"darwin-lolo-cache-control",
                    "createdAt":"2019-10-07 04:06:55",
                    "buildId":"c4c29a07-8245-4cf0-9301-8f96dc0f9893",
                    "componentId":"e1e51e32-7ceb-4c8a-bd21-f358cb2c3a8d"
                 },
                 { 
                    "id":"be966121-0ae2-4bcb-aa37-79b30b4661af",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-auth:darwin-teste-front-lib-01",
                    "version":"darwin-teste-front-lib-01",
                    "createdAt":"2019-10-04 17:09:25",
                    "buildId":"1b73a17b-5725-461f-9665-ebedc06f1d57",
                    "componentId":"e1e51e32-7ceb-4c8a-bd21-f358cb2c3a8d"
                 },
                 { 
                    "id":"9c9bf5d9-b569-48ba-a0e8-cb526c5aaeb2",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-auth:darwin-fideback",
                    "version":"darwin-fideback",
                    "createdAt":"2019-10-04 21:04:05",
                    "buildId":"0213aff2-9120-4faf-9185-d3c46a317e7e",
                    "componentId":"e1e51e32-7ceb-4c8a-bd21-f358cb2c3a8d"
                 },
                 { 
                    "id":"68d5ea44-be89-4ac5-8f9b-8b3355af3f05",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-auth:darwin-undo-backlog-column-label",
                    "version":"darwin-undo-backlog-column-label",
                    "createdAt":"2019-10-05 03:08:15",
                    "buildId":"4063482d-3656-439d-98be-e51a5af67e2f",
                    "componentId":"e1e51e32-7ceb-4c8a-bd21-f358cb2c3a8d"
                 },
                 { 
                    "id":"e66e4dee-986f-4f57-ab27-a1520b4e54db",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-auth:darwin-teste-includes-headers",
                    "version":"darwin-teste-includes-headers",
                    "createdAt":"2019-10-07 02:56:05",
                    "buildId":"fb085bd7-be7e-47bb-a3e1-5a503b50b804",
                    "componentId":"e1e51e32-7ceb-4c8a-bd21-f358cb2c3a8d"
                 },
                 { 
                    "id":"f49dad36-b1ca-481c-a759-c4a957e8007a",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-auth:darwin-back-lolo-cookie-header",
                    "version":"darwin-back-lolo-cookie-header",
                    "createdAt":"2019-10-07 19:10:05",
                    "buildId":"ff92f4d5-f020-40ea-a0f1-66ad34e86c58",
                    "componentId":"e1e51e32-7ceb-4c8a-bd21-f358cb2c3a8d"
                 },
                 { 
                    "id":"abba20cc-5d1c-4d3b-aa43-d56ca276cda0",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-auth:darwin-remove-service-worker",
                    "version":"darwin-remove-service-worker",
                    "createdAt":"2019-10-07 21:12:45",
                    "buildId":"f5644ece-c3c9-4345-aabf-854be39a4c9e",
                    "componentId":"e1e51e32-7ceb-4c8a-bd21-f358cb2c3a8d"
                 },
                 { 
                    "id":"01e622ee-3fc4-4a65-a768-844a6eed346b",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-auth:darwin-teste-front-lib-01",
                    "version":"darwin-teste-front-lib-01",
                    "createdAt":"2019-10-04 17:09:35",
                    "buildId":"1b73a17b-5725-461f-9665-ebedc06f1d57",
                    "componentId":"e1e51e32-7ceb-4c8a-bd21-f358cb2c3a8d"
                 },
                 { 
                    "id":"53c76f71-92ea-4fd8-a848-105fd3e83e10",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-auth:darwin-send-all-headers",
                    "version":"darwin-send-all-headers",
                    "createdAt":"2019-10-04 18:57:25",
                    "buildId":"26e2987d-efb7-4b7f-a020-93fd688662f7",
                    "componentId":"e1e51e32-7ceb-4c8a-bd21-f358cb2c3a8d"
                 },
                 { 
                    "id":"d153ab36-8edb-4226-8764-c208b67bce9c",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-auth:darwin-intercept-specific-files",
                    "version":"darwin-intercept-specific-files",
                    "createdAt":"2019-10-04 20:36:55",
                    "buildId":"5f42d00e-4f49-4b9e-ad5d-67309ce5ecaa",
                    "componentId":"e1e51e32-7ceb-4c8a-bd21-f358cb2c3a8d"
                 },
                 { 
                    "id":"b01834ff-2d32-4441-bf1c-a82ba2357df9",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-auth:darwin-undo-column-label-02",
                    "version":"darwin-undo-column-label-02",
                    "createdAt":"2019-10-05 03:37:25",
                    "buildId":"71831f79-97eb-433f-babd-20186a0b4720",
                    "componentId":"e1e51e32-7ceb-4c8a-bd21-f358cb2c3a8d"
                 },
                 { 
                    "id":"b33435bf-d078-48cd-876c-997c8836fdb0",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-auth:darwin-fetch-cookie-data",
                    "version":"darwin-fetch-cookie-data",
                    "createdAt":"2019-10-07 18:33:35",
                    "buildId":"c37336f2-6515-4233-b4ac-bbf7eece6e72",
                    "componentId":"e1e51e32-7ceb-4c8a-bd21-f358cb2c3a8d"
                 },
                 { 
                    "id":"2b5f8e55-cba3-4bb4-bd16-e268c48fa221",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-auth:darwin-remove-sw-again",
                    "version":"darwin-remove-sw-again",
                    "createdAt":"2019-10-08 13:03:35",
                    "buildId":"cd001ced-517a-4220-a070-46d22b383d65",
                    "componentId":"e1e51e32-7ceb-4c8a-bd21-f358cb2c3a8d"
                 },
                 { 
                    "id":"a71b6c91-1c44-4dbd-80e2-2e1dfe455ca6",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-auth:darwin-tela-de-modulos",
                    "version":"darwin-tela-de-modulos",
                    "createdAt":"2019-10-08 14:54:05",
                    "buildId":"60f486c4-59fc-4cc9-89a6-ed236736f1af",
                    "componentId":"e1e51e32-7ceb-4c8a-bd21-f358cb2c3a8d"
                 },
                 { 
                    "id":"de5e4f73-e8be-4204-acf6-1f5ced628a5f",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-auth:darwin-fix-reset-state-on-create-problem",
                    "version":"darwin-fix-reset-state-on-create-problem",
                    "createdAt":"2019-10-08 16:45:05",
                    "buildId":"d6e8ffd1-beec-4ccb-ae08-d97072aafd51",
                    "componentId":"e1e51e32-7ceb-4c8a-bd21-f358cb2c3a8d"
                 },
                 { 
                    "id":"7dfd5f05-8706-4669-a730-e9b25a0d8b32",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-auth:darwin-test-create-module",
                    "version":"darwin-test-create-module",
                    "createdAt":"2019-10-08 17:06:29",
                    "buildId":"5266e3cb-30fc-459a-94de-c3f20009a538",
                    "componentId":"e1e51e32-7ceb-4c8a-bd21-f358cb2c3a8d"
                 },
                 { 
                    "id":"9b425c7c-95ee-4c79-9fff-bdf91160e0cc",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-auth:darwin-front-virtual-service-fix",
                    "version":"darwin-front-virtual-service-fix",
                    "createdAt":"2019-10-08 18:07:25",
                    "buildId":"ff680ab4-ec3b-4890-b6d4-eba7ad01618f",
                    "componentId":"e1e51e32-7ceb-4c8a-bd21-f358cb2c3a8d"
                 },
                 { 
                    "id":"a952c8aa-b2d9-472d-b40f-f2fd5771f85c",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-auth:darwin-teste-02-config-modules",
                    "version":"darwin-teste-02-config-modules",
                    "createdAt":"2019-10-08 18:37:05",
                    "buildId":"b377ab89-9867-46c9-9336-54f0dd501a2e",
                    "componentId":"e1e51e32-7ceb-4c8a-bd21-f358cb2c3a8d"
                 },
                 { 
                    "id":"9b8c5369-0d27-4d72-a831-57673bef43dd",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-auth:darwin-enhancemente-darwin",
                    "version":"darwin-enhancemente-darwin",
                    "createdAt":"2019-10-08 20:27:15",
                    "buildId":"929587ba-bb0d-4f68-bbb1-222ea1a3b71a",
                    "componentId":"e1e51e32-7ceb-4c8a-bd21-f358cb2c3a8d"
                 },
                 { 
                    "id":"73c6199f-6925-4200-bfa8-0b7cbfb3cedf",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-auth:darwin-test-bpollisd",
                    "version":"darwin-test-bpollisd",
                    "createdAt":"2019-10-08 22:13:55",
                    "buildId":"8d922089-d087-442f-948c-e96dd21bd2ce",
                    "componentId":"e1e51e32-7ceb-4c8a-bd21-f358cb2c3a8d"
                 },
                 { 
                    "id":"0fabd23b-19ec-43f2-b3ff-4fac92bcd858",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-auth:darwin-fix-get-modules-with-rxjs-redux",
                    "version":"darwin-fix-get-modules-with-rxjs-redux",
                    "createdAt":"2019-10-08 22:28:05",
                    "buildId":"6b96fcb6-ca44-483c-9c0d-e2bd43020a4c",
                    "componentId":"e1e51e32-7ceb-4c8a-bd21-f358cb2c3a8d"
                 },
                 { 
                    "id":"00615856-d383-4931-8d1f-f63ac961d080",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-auth:darwin-test-remove-cach-builds",
                    "version":"darwin-test-remove-cach-builds",
                    "createdAt":"2019-10-09 20:11:15",
                    "buildId":"0f4d24e8-dd3e-4fe2-8623-eb559b56363e",
                    "componentId":"e1e51e32-7ceb-4c8a-bd21-f358cb2c3a8d"
                 },
                 { 
                    "id":"a4964b6f-1cdc-48d6-810a-8b8c42c45af7",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-auth:darwin-test-01-remove-cache-builds",
                    "version":"darwin-test-01-remove-cache-builds",
                    "createdAt":"2019-10-10 03:35:05",
                    "buildId":"0d0ed2a3-955c-4223-a270-ab4afeb14e7d",
                    "componentId":"e1e51e32-7ceb-4c8a-bd21-f358cb2c3a8d"
                 },
                 { 
                    "id":"cbe99019-7413-491c-bc3e-3ea2de94a113",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-auth:darwin-test-02-remove-cache-builds",
                    "version":"darwin-test-02-remove-cache-builds",
                    "createdAt":"2019-10-10 04:45:15",
                    "buildId":"424bc139-5426-4d44-890d-52205ae773ba",
                    "componentId":"e1e51e32-7ceb-4c8a-bd21-f358cb2c3a8d"
                 },
                 { 
                    "id":"d97bad9e-99a0-4552-82dd-12adc4a8ca1f",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-auth:darwin-test-01-lazy-loading",
                    "version":"darwin-test-01-lazy-loading",
                    "createdAt":"2019-10-10 19:15:25",
                    "buildId":"a6e23ee0-b4a7-40a7-a09b-206053ec852d",
                    "componentId":"e1e51e32-7ceb-4c8a-bd21-f358cb2c3a8d"
                 },
                 { 
                    "id":"17df91d1-1724-4a3a-9d1a-5573282252c3",
                    "artifact":"null/darwin-ui-auth:darwin-archive-and-delete-builds-and-cards",
                    "version":"darwin-archive-and-delete-builds-and-cards",
                    "createdAt":"2019-10-10 19:37:05",
                    "buildId":"a184c85a-c328-4af6-aae3-d87e0e14eacb",
                    "componentId":"e1e51e32-7ceb-4c8a-bd21-f358cb2c3a8d"
                 },
                 { 
                    "id":"3522d217-a087-4a9a-8b1c-a0c57a521ec1",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-auth:darwin-fix-front-archive-delete-04",
                    "version":"darwin-fix-front-archive-delete-04",
                    "createdAt":"2019-10-10 22:24:03",
                    "buildId":"0a2ebc24-df20-4e47-a9ce-75dd8dcbbf5d",
                    "componentId":"e1e51e32-7ceb-4c8a-bd21-f358cb2c3a8d"
                 },
                 { 
                    "id":"b5db17ff-a86a-47aa-b31e-b0cd9b3d0217",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-auth:darwin-bundle-0-0-6",
                    "version":"darwin-bundle-0-0-6",
                    "createdAt":"2019-10-11 20:10:44",
                    "buildId":"4b1b38e2-878e-4149-bae6-a8e31dfb0c48",
                    "componentId":"e1e51e32-7ceb-4c8a-bd21-f358cb2c3a8d"
                 },
                 { 
                    "id":"09826158-19de-40f6-acf6-5500c0213e9a",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-auth:darwin-bundle-0-0-7",
                    "version":"darwin-bundle-0-0-7",
                    "createdAt":"2019-10-11 20:36:45",
                    "buildId":"0e796045-55f6-47a7-97f2-530a644f4527",
                    "componentId":"e1e51e32-7ceb-4c8a-bd21-f358cb2c3a8d"
                 },
                 { 
                    "id":"7441860e-e351-4d2e-8a08-27952a86ef04",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-auth:darwin-bundle-0-0-9",
                    "version":"darwin-bundle-0-0-9",
                    "createdAt":"2019-10-11 21:32:06",
                    "buildId":"01c6a677-ccaf-4577-941b-38e32f5c8442",
                    "componentId":"e1e51e32-7ceb-4c8a-bd21-f358cb2c3a8d"
                 },
                 { 
                    "id":"c2d37c68-0af9-49b1-89c6-cb84d1728966",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-auth:darwin-modules-improved",
                    "version":"darwin-modules-improved",
                    "createdAt":"2019-10-15 14:07:57",
                    "buildId":"2f8a4e6f-674b-499e-a327-e1d98a9a8920",
                    "componentId":"e1e51e32-7ceb-4c8a-bd21-f358cb2c3a8d"
                 },
                 { 
                    "id":"fde691e1-7be2-484d-a150-3b73bd041699",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-auth:darwin-bundle-0-0-10",
                    "version":"darwin-bundle-0-0-10",
                    "createdAt":"2019-10-15 18:54:57",
                    "buildId":"861f4684-c059-42b0-a105-5ae031df88ea",
                    "componentId":"e1e51e32-7ceb-4c8a-bd21-f358cb2c3a8d"
                 },
                 { 
                    "id":"cdca694b-dd32-4aa1-ac27-9fe0d233c85a",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-auth:darwin-bundle-0-0-11",
                    "version":"darwin-bundle-0-0-11",
                    "createdAt":"2019-10-15 19:12:07",
                    "buildId":"7750c0b9-6cb4-44da-ba36-3c923df6db73",
                    "componentId":"e1e51e32-7ceb-4c8a-bd21-f358cb2c3a8d"
                 },
                 { 
                    "id":"929bad28-f8e8-4434-b982-e24a9eefdae6",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-auth:darwin-commons-js",
                    "version":"darwin-commons-js",
                    "createdAt":"2019-10-23 14:58:44",
                    "buildId":"47457d69-14ed-4759-ae78-143098f292ab",
                    "componentId":"e1e51e32-7ceb-4c8a-bd21-f358cb2c3a8d"
                 },
                 { 
                    "id":"bb349725-7fbc-4edc-b84d-aa06553f4114",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-auth:darwin-commons-js-02",
                    "version":"darwin-commons-js-02",
                    "createdAt":"2019-10-23 15:25:44",
                    "buildId":"27f38764-bd28-466f-b672-dc225965e1cc",
                    "componentId":"e1e51e32-7ceb-4c8a-bd21-f358cb2c3a8d"
                 },
                 { 
                    "id":"3adbd4c8-0496-4b46-994b-0b1dcfa36d53",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-auth:darwin-commons-js-04",
                    "version":"darwin-commons-js-04",
                    "createdAt":"2019-10-23 18:57:04",
                    "buildId":"45e1c475-2474-45c4-a91e-9ea1e0e1d558",
                    "componentId":"e1e51e32-7ceb-4c8a-bd21-f358cb2c3a8d"
                 },
                 { 
                    "id":"d3e90c19-808b-41a7-a583-c82fb8b739af",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-auth:darwin-commons-js-06",
                    "version":"darwin-commons-js-06",
                    "createdAt":"2019-10-23 20:44:24",
                    "buildId":"da118b82-382d-443a-95f0-fb9f3a2c7646",
                    "componentId":"e1e51e32-7ceb-4c8a-bd21-f358cb2c3a8d"
                 },
                 { 
                    "id":"60ee2a76-b347-456a-a2fe-e0cddaf02a40",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-auth:darwin-commons-js-07",
                    "version":"darwin-commons-js-07",
                    "createdAt":"2019-10-23 21:11:56",
                    "buildId":"b66238a6-b63f-4368-918b-41e0d96fca3f",
                    "componentId":"e1e51e32-7ceb-4c8a-bd21-f358cb2c3a8d"
                 },
                 { 
                    "id":"96284ad7-ba3a-404a-a611-636bcf05d15a",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-auth:darwin-commons-js-09",
                    "version":"darwin-commons-js-09",
                    "createdAt":"2019-10-23 21:28:37",
                    "buildId":"09b3264e-e8a3-4075-8827-c7b199db5261",
                    "componentId":"e1e51e32-7ceb-4c8a-bd21-f358cb2c3a8d"
                 },
                 { 
                    "id":"a0321126-dced-4451-ba36-3e0aeba175f9",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-auth:darwin-commons-js-08",
                    "version":"darwin-commons-js-08",
                    "createdAt":"2019-10-23 21:38:44",
                    "buildId":"559250a7-5320-422a-b939-cd56b0ffc68b",
                    "componentId":"e1e51e32-7ceb-4c8a-bd21-f358cb2c3a8d"
                 },
                 { 
                    "id":"4a4a31bc-629a-49ea-9d05-22ade4ce9988",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-auth:darwin-commons-js-10",
                    "version":"darwin-commons-js-10",
                    "createdAt":"2019-10-23 21:45:36",
                    "buildId":"a6df1030-cd11-4a70-9e5b-ae011250aa5c",
                    "componentId":"e1e51e32-7ceb-4c8a-bd21-f358cb2c3a8d"
                 }
              ]
           },
           { 
              "id":"b0a51dae-0d5c-44f5-af5e-0acfb796cfa6",
              "name":"darwin-ui-moove",
              "contextPath":"/",
              "port":3000,
              "healthCheck":"/",
              "createdAt":"2019-09-30 21:47:19",
              "moduleId":"e9289c98-e017-40f4-9854-aeb529a1482f",
              "artifacts":[ 
                 { 
                    "id":"dc19ebac-b56d-474a-b4ac-abc9324cbabb",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-moove:darwin-teste-front-lib-01",
                    "version":"darwin-teste-front-lib-01",
                    "createdAt":"2019-10-04 17:08:45",
                    "buildId":"1b73a17b-5725-461f-9665-ebedc06f1d57",
                    "componentId":"b0a51dae-0d5c-44f5-af5e-0acfb796cfa6"
                 },
                 { 
                    "id":"e3b670f0-b77c-441b-8859-33ccbae4b486",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-moove:darwin-teste-front-lib-01",
                    "version":"darwin-teste-front-lib-01",
                    "createdAt":"2019-10-04 17:08:55",
                    "buildId":"1b73a17b-5725-461f-9665-ebedc06f1d57",
                    "componentId":"b0a51dae-0d5c-44f5-af5e-0acfb796cfa6"
                 },
                 { 
                    "id":"81f86caf-d762-407e-987c-970737589a92",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-moove:darwin-teste-front-lib-01",
                    "version":"darwin-teste-front-lib-01",
                    "createdAt":"2019-10-04 17:09:05",
                    "buildId":"1b73a17b-5725-461f-9665-ebedc06f1d57",
                    "componentId":"b0a51dae-0d5c-44f5-af5e-0acfb796cfa6"
                 },
                 { 
                    "id":"eea41d8a-4f41-4565-9cd3-c9dc132c49ce",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-moove:darwin-teste-front-lib-01",
                    "version":"darwin-teste-front-lib-01",
                    "createdAt":"2019-10-04 17:09:15",
                    "buildId":"1b73a17b-5725-461f-9665-ebedc06f1d57",
                    "componentId":"b0a51dae-0d5c-44f5-af5e-0acfb796cfa6"
                 },
                 { 
                    "id":"1b15b50b-4a87-4975-993a-46b09bf5e2c2",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-moove:darwin-send-all-headers",
                    "version":"darwin-send-all-headers",
                    "createdAt":"2019-10-04 18:57:36",
                    "buildId":"26e2987d-efb7-4b7f-a020-93fd688662f7",
                    "componentId":"b0a51dae-0d5c-44f5-af5e-0acfb796cfa6"
                 },
                 { 
                    "id":"990236cb-2298-479d-a672-17c1979fdf0f",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-moove:darwin-undo-nginx",
                    "version":"darwin-undo-nginx",
                    "createdAt":"2019-10-05 02:07:55",
                    "buildId":"ff5c41e2-cbc6-422e-a6e5-b0bfb0f5a4d0",
                    "componentId":"b0a51dae-0d5c-44f5-af5e-0acfb796cfa6"
                 },
                 { 
                    "id":"f1b1555f-8b80-44ed-af79-d4a4c3c2b3c9",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-moove:darwin-lolo-cache-control",
                    "version":"darwin-lolo-cache-control",
                    "createdAt":"2019-10-07 04:06:55",
                    "buildId":"c4c29a07-8245-4cf0-9301-8f96dc0f9893",
                    "componentId":"b0a51dae-0d5c-44f5-af5e-0acfb796cfa6"
                 },
                 { 
                    "id":"6680741d-c9bb-4724-be49-ca73b774f1b5",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-moove:darwin-teste-front-lib-01",
                    "version":"darwin-teste-front-lib-01",
                    "createdAt":"2019-10-04 17:09:25",
                    "buildId":"1b73a17b-5725-461f-9665-ebedc06f1d57",
                    "componentId":"b0a51dae-0d5c-44f5-af5e-0acfb796cfa6"
                 },
                 { 
                    "id":"4bb27b37-b08a-4ed2-80a8-ea1da4335459",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-moove:darwin-fideback",
                    "version":"darwin-fideback",
                    "createdAt":"2019-10-04 21:04:05",
                    "buildId":"0213aff2-9120-4faf-9185-d3c46a317e7e",
                    "componentId":"b0a51dae-0d5c-44f5-af5e-0acfb796cfa6"
                 },
                 { 
                    "id":"8e1129b0-a65b-403e-8bfa-09e4f07351ad",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-moove:darwin-undo-backlog-column-label",
                    "version":"darwin-undo-backlog-column-label",
                    "createdAt":"2019-10-05 03:08:15",
                    "buildId":"4063482d-3656-439d-98be-e51a5af67e2f",
                    "componentId":"b0a51dae-0d5c-44f5-af5e-0acfb796cfa6"
                 },
                 { 
                    "id":"00ac3992-067d-4d63-872e-19183d882c9f",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-moove:darwin-teste-includes-headers",
                    "version":"darwin-teste-includes-headers",
                    "createdAt":"2019-10-07 02:56:05",
                    "buildId":"fb085bd7-be7e-47bb-a3e1-5a503b50b804",
                    "componentId":"b0a51dae-0d5c-44f5-af5e-0acfb796cfa6"
                 },
                 { 
                    "id":"a654c498-90b6-419b-98c7-be32338e6e0d",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-moove:darwin-back-lolo-cookie-header",
                    "version":"darwin-back-lolo-cookie-header",
                    "createdAt":"2019-10-07 19:10:05",
                    "buildId":"ff92f4d5-f020-40ea-a0f1-66ad34e86c58",
                    "componentId":"b0a51dae-0d5c-44f5-af5e-0acfb796cfa6"
                 },
                 { 
                    "id":"1801430d-45f6-4bfb-8a51-f12faf190e1a",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-moove:darwin-remove-service-worker",
                    "version":"darwin-remove-service-worker",
                    "createdAt":"2019-10-07 21:12:45",
                    "buildId":"f5644ece-c3c9-4345-aabf-854be39a4c9e",
                    "componentId":"b0a51dae-0d5c-44f5-af5e-0acfb796cfa6"
                 },
                 { 
                    "id":"79667383-f0d4-480d-9734-399d41b07d73",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-moove:darwin-teste-front-lib-01",
                    "version":"darwin-teste-front-lib-01",
                    "createdAt":"2019-10-04 17:09:35",
                    "buildId":"1b73a17b-5725-461f-9665-ebedc06f1d57",
                    "componentId":"b0a51dae-0d5c-44f5-af5e-0acfb796cfa6"
                 },
                 { 
                    "id":"7057e2f7-66d8-47a1-908e-6f41e9a421f0",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-moove:darwin-send-all-headers",
                    "version":"darwin-send-all-headers",
                    "createdAt":"2019-10-04 18:57:25",
                    "buildId":"26e2987d-efb7-4b7f-a020-93fd688662f7",
                    "componentId":"b0a51dae-0d5c-44f5-af5e-0acfb796cfa6"
                 },
                 { 
                    "id":"c89557cd-ae1e-4a1f-8779-d554acd5aba7",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-moove:darwin-intercept-specific-files",
                    "version":"darwin-intercept-specific-files",
                    "createdAt":"2019-10-04 20:36:55",
                    "buildId":"5f42d00e-4f49-4b9e-ad5d-67309ce5ecaa",
                    "componentId":"b0a51dae-0d5c-44f5-af5e-0acfb796cfa6"
                 },
                 { 
                    "id":"310cf4cd-b49d-4661-870a-5c80a951e930",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-moove:darwin-undo-column-label-02",
                    "version":"darwin-undo-column-label-02",
                    "createdAt":"2019-10-05 03:37:25",
                    "buildId":"71831f79-97eb-433f-babd-20186a0b4720",
                    "componentId":"b0a51dae-0d5c-44f5-af5e-0acfb796cfa6"
                 },
                 { 
                    "id":"9dabea30-62c1-46cb-adb2-9a064b48ab61",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-moove:darwin-fetch-cookie-data",
                    "version":"darwin-fetch-cookie-data",
                    "createdAt":"2019-10-07 18:33:35",
                    "buildId":"c37336f2-6515-4233-b4ac-bbf7eece6e72",
                    "componentId":"b0a51dae-0d5c-44f5-af5e-0acfb796cfa6"
                 },
                 { 
                    "id":"8be5788e-872c-4aed-95a7-2afe55600053",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-moove:darwin-remove-sw-again",
                    "version":"darwin-remove-sw-again",
                    "createdAt":"2019-10-08 13:03:35",
                    "buildId":"cd001ced-517a-4220-a070-46d22b383d65",
                    "componentId":"b0a51dae-0d5c-44f5-af5e-0acfb796cfa6"
                 },
                 { 
                    "id":"ffda7bb3-4e94-429d-b6f0-bc1c0d49a04c",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-moove:darwin-tela-de-modulos",
                    "version":"darwin-tela-de-modulos",
                    "createdAt":"2019-10-08 14:54:05",
                    "buildId":"60f486c4-59fc-4cc9-89a6-ed236736f1af",
                    "componentId":"b0a51dae-0d5c-44f5-af5e-0acfb796cfa6"
                 },
                 { 
                    "id":"84e0b47e-7867-48ca-bb32-6e457a227807",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-moove:darwin-fix-reset-state-on-create-problem",
                    "version":"darwin-fix-reset-state-on-create-problem",
                    "createdAt":"2019-10-08 16:45:05",
                    "buildId":"d6e8ffd1-beec-4ccb-ae08-d97072aafd51",
                    "componentId":"b0a51dae-0d5c-44f5-af5e-0acfb796cfa6"
                 },
                 { 
                    "id":"81baa169-ea55-4fbb-8a1a-f27427946822",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-moove:darwin-test-create-module",
                    "version":"darwin-test-create-module",
                    "createdAt":"2019-10-08 17:06:29",
                    "buildId":"5266e3cb-30fc-459a-94de-c3f20009a538",
                    "componentId":"b0a51dae-0d5c-44f5-af5e-0acfb796cfa6"
                 },
                 { 
                    "id":"c2453862-2b0a-4889-988e-f484b271e48d",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-moove:darwin-front-virtual-service-fix",
                    "version":"darwin-front-virtual-service-fix",
                    "createdAt":"2019-10-08 18:07:25",
                    "buildId":"ff680ab4-ec3b-4890-b6d4-eba7ad01618f",
                    "componentId":"b0a51dae-0d5c-44f5-af5e-0acfb796cfa6"
                 },
                 { 
                    "id":"a85c7a7b-9fdf-4375-9e59-2145a54a42b0",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-moove:darwin-teste-02-config-modules",
                    "version":"darwin-teste-02-config-modules",
                    "createdAt":"2019-10-08 18:37:05",
                    "buildId":"b377ab89-9867-46c9-9336-54f0dd501a2e",
                    "componentId":"b0a51dae-0d5c-44f5-af5e-0acfb796cfa6"
                 },
                 { 
                    "id":"7460d7df-8395-49b9-8849-2ce818d20cc5",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-moove:darwin-enhancemente-darwin",
                    "version":"darwin-enhancemente-darwin",
                    "createdAt":"2019-10-08 20:27:15",
                    "buildId":"929587ba-bb0d-4f68-bbb1-222ea1a3b71a",
                    "componentId":"b0a51dae-0d5c-44f5-af5e-0acfb796cfa6"
                 },
                 { 
                    "id":"7be0671b-06df-43d5-b1c6-8f469fd93372",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-moove:darwin-test-bpollisd",
                    "version":"darwin-test-bpollisd",
                    "createdAt":"2019-10-08 22:13:55",
                    "buildId":"8d922089-d087-442f-948c-e96dd21bd2ce",
                    "componentId":"b0a51dae-0d5c-44f5-af5e-0acfb796cfa6"
                 },
                 { 
                    "id":"02f3a249-deea-4565-b337-a6eb38c846e7",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-moove:darwin-fix-get-modules-with-rxjs-redux",
                    "version":"darwin-fix-get-modules-with-rxjs-redux",
                    "createdAt":"2019-10-08 22:28:05",
                    "buildId":"6b96fcb6-ca44-483c-9c0d-e2bd43020a4c",
                    "componentId":"b0a51dae-0d5c-44f5-af5e-0acfb796cfa6"
                 },
                 { 
                    "id":"72293ab8-f2ae-49a7-b756-6e7f688959ed",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-moove:darwin-test-remove-cach-builds",
                    "version":"darwin-test-remove-cach-builds",
                    "createdAt":"2019-10-09 20:11:15",
                    "buildId":"0f4d24e8-dd3e-4fe2-8623-eb559b56363e",
                    "componentId":"b0a51dae-0d5c-44f5-af5e-0acfb796cfa6"
                 },
                 { 
                    "id":"7bf4ca72-c872-4b63-88b5-f9c239c9f208",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-moove:darwin-test-01-remove-cache-builds",
                    "version":"darwin-test-01-remove-cache-builds",
                    "createdAt":"2019-10-10 03:35:05",
                    "buildId":"0d0ed2a3-955c-4223-a270-ab4afeb14e7d",
                    "componentId":"b0a51dae-0d5c-44f5-af5e-0acfb796cfa6"
                 },
                 { 
                    "id":"55dc11b9-0916-4a6d-b349-392ac11d50a1",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-moove:darwin-test-02-remove-cache-builds",
                    "version":"darwin-test-02-remove-cache-builds",
                    "createdAt":"2019-10-10 04:45:15",
                    "buildId":"424bc139-5426-4d44-890d-52205ae773ba",
                    "componentId":"b0a51dae-0d5c-44f5-af5e-0acfb796cfa6"
                 },
                 { 
                    "id":"f3624718-dcfc-4e9f-89be-ed38964d45fd",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-moove:darwin-test-01-lazy-loading",
                    "version":"darwin-test-01-lazy-loading",
                    "createdAt":"2019-10-10 19:15:25",
                    "buildId":"a6e23ee0-b4a7-40a7-a09b-206053ec852d",
                    "componentId":"b0a51dae-0d5c-44f5-af5e-0acfb796cfa6"
                 },
                 { 
                    "id":"b607b076-9d6f-4ba9-9bdf-de4167f5321e",
                    "artifact":"null/darwin-ui-moove:darwin-archive-and-delete-builds-and-cards",
                    "version":"darwin-archive-and-delete-builds-and-cards",
                    "createdAt":"2019-10-10 19:37:05",
                    "buildId":"a184c85a-c328-4af6-aae3-d87e0e14eacb",
                    "componentId":"b0a51dae-0d5c-44f5-af5e-0acfb796cfa6"
                 },
                 { 
                    "id":"a27371b4-4f39-4984-9698-a14da31519e9",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-moove:darwin-fix-front-archive-delete-04",
                    "version":"darwin-fix-front-archive-delete-04",
                    "createdAt":"2019-10-10 22:24:03",
                    "buildId":"0a2ebc24-df20-4e47-a9ce-75dd8dcbbf5d",
                    "componentId":"b0a51dae-0d5c-44f5-af5e-0acfb796cfa6"
                 },
                 { 
                    "id":"98b66b85-ed85-4fc7-a217-91810e976289",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-moove:darwin-bundle-0-0-6",
                    "version":"darwin-bundle-0-0-6",
                    "createdAt":"2019-10-11 20:10:44",
                    "buildId":"4b1b38e2-878e-4149-bae6-a8e31dfb0c48",
                    "componentId":"b0a51dae-0d5c-44f5-af5e-0acfb796cfa6"
                 },
                 { 
                    "id":"8e7be191-252a-4c03-8b57-9129fc0f0a6c",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-moove:darwin-bundle-0-0-7",
                    "version":"darwin-bundle-0-0-7",
                    "createdAt":"2019-10-11 20:36:45",
                    "buildId":"0e796045-55f6-47a7-97f2-530a644f4527",
                    "componentId":"b0a51dae-0d5c-44f5-af5e-0acfb796cfa6"
                 },
                 { 
                    "id":"8c3968de-6bb5-4f8d-b69d-00fc79f073f5",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-moove:darwin-bundle-0-0-9",
                    "version":"darwin-bundle-0-0-9",
                    "createdAt":"2019-10-11 21:32:06",
                    "buildId":"01c6a677-ccaf-4577-941b-38e32f5c8442",
                    "componentId":"b0a51dae-0d5c-44f5-af5e-0acfb796cfa6"
                 },
                 { 
                    "id":"1b2db656-b978-4780-b6ff-a16bbcc47cc5",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-moove:darwin-modules-improved",
                    "version":"darwin-modules-improved",
                    "createdAt":"2019-10-15 14:07:57",
                    "buildId":"2f8a4e6f-674b-499e-a327-e1d98a9a8920",
                    "componentId":"b0a51dae-0d5c-44f5-af5e-0acfb796cfa6"
                 },
                 { 
                    "id":"be88b8be-69f6-4367-b881-e25fc5eeddab",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-moove:darwin-bundle-0-0-10",
                    "version":"darwin-bundle-0-0-10",
                    "createdAt":"2019-10-15 18:54:57",
                    "buildId":"861f4684-c059-42b0-a105-5ae031df88ea",
                    "componentId":"b0a51dae-0d5c-44f5-af5e-0acfb796cfa6"
                 },
                 { 
                    "id":"daaf9477-7fd3-4140-bfd4-68b7fe8a74f3",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-moove:darwin-bundle-0-0-11",
                    "version":"darwin-bundle-0-0-11",
                    "createdAt":"2019-10-15 19:12:07",
                    "buildId":"7750c0b9-6cb4-44da-ba36-3c923df6db73",
                    "componentId":"b0a51dae-0d5c-44f5-af5e-0acfb796cfa6"
                 },
                 { 
                    "id":"f20e61f3-7986-41c1-9910-752599f84fa7",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-moove:darwin-commons-js",
                    "version":"darwin-commons-js",
                    "createdAt":"2019-10-23 14:58:44",
                    "buildId":"47457d69-14ed-4759-ae78-143098f292ab",
                    "componentId":"b0a51dae-0d5c-44f5-af5e-0acfb796cfa6"
                 },
                 { 
                    "id":"4175e5d1-b7f2-4b36-b830-39d550dc0c0d",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-moove:darwin-commons-js-02",
                    "version":"darwin-commons-js-02",
                    "createdAt":"2019-10-23 15:25:44",
                    "buildId":"27f38764-bd28-466f-b672-dc225965e1cc",
                    "componentId":"b0a51dae-0d5c-44f5-af5e-0acfb796cfa6"
                 },
                 { 
                    "id":"48656dc4-40c2-44b0-a20a-385cae0d8507",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-moove:darwin-commons-js-04",
                    "version":"darwin-commons-js-04",
                    "createdAt":"2019-10-23 18:57:04",
                    "buildId":"45e1c475-2474-45c4-a91e-9ea1e0e1d558",
                    "componentId":"b0a51dae-0d5c-44f5-af5e-0acfb796cfa6"
                 },
                 { 
                    "id":"6ba3fbbb-2671-4fd3-9251-5b5c595b0ec5",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-moove:darwin-commons-js-06",
                    "version":"darwin-commons-js-06",
                    "createdAt":"2019-10-23 20:44:24",
                    "buildId":"da118b82-382d-443a-95f0-fb9f3a2c7646",
                    "componentId":"b0a51dae-0d5c-44f5-af5e-0acfb796cfa6"
                 },
                 { 
                    "id":"b6faa222-69a3-4653-b723-08e410561df4",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-moove:darwin-commons-js-07",
                    "version":"darwin-commons-js-07",
                    "createdAt":"2019-10-23 21:11:56",
                    "buildId":"b66238a6-b63f-4368-918b-41e0d96fca3f",
                    "componentId":"b0a51dae-0d5c-44f5-af5e-0acfb796cfa6"
                 },
                 { 
                    "id":"34ca8f13-dcc8-4443-ad97-61746544b03d",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-moove:darwin-commons-js-09",
                    "version":"darwin-commons-js-09",
                    "createdAt":"2019-10-23 21:28:37",
                    "buildId":"09b3264e-e8a3-4075-8827-c7b199db5261",
                    "componentId":"b0a51dae-0d5c-44f5-af5e-0acfb796cfa6"
                 },
                 { 
                    "id":"4a7ffaef-e3d0-4e7e-9f86-1c2555946f32",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-moove:darwin-commons-js-08",
                    "version":"darwin-commons-js-08",
                    "createdAt":"2019-10-23 21:38:44",
                    "buildId":"559250a7-5320-422a-b939-cd56b0ffc68b",
                    "componentId":"b0a51dae-0d5c-44f5-af5e-0acfb796cfa6"
                 },
                 { 
                    "id":"edcf5f74-0f39-4e76-a592-0ba7280d48c2",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-moove:darwin-commons-js-10",
                    "version":"darwin-commons-js-10",
                    "createdAt":"2019-10-23 21:45:36",
                    "buildId":"a6df1030-cd11-4a70-9e5b-ae011250aa5c",
                    "componentId":"b0a51dae-0d5c-44f5-af5e-0acfb796cfa6"
                 }
              ]
           },
           { 
              "id":"7473947d-6d42-4408-aa46-105ea8a7ce71",
              "name":"darwin-ui-aggregator",
              "contextPath":"/",
              "port":8080,
              "healthCheck":"/health",
              "createdAt":"2019-09-30 21:47:19",
              "moduleId":"e9289c98-e017-40f4-9854-aeb529a1482f",
              "artifacts":[ 
                 { 
                    "id":"dfa53dba-1528-4dd7-8a8a-ccf8f7c9cde0",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-aggregator:darwin-teste-front-lib-01",
                    "version":"darwin-teste-front-lib-01",
                    "createdAt":"2019-10-04 17:08:45",
                    "buildId":"1b73a17b-5725-461f-9665-ebedc06f1d57",
                    "componentId":"7473947d-6d42-4408-aa46-105ea8a7ce71"
                 },
                 { 
                    "id":"40363a9a-e1b4-44a1-a91c-b9fa28b9c1a8",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-aggregator:darwin-teste-front-lib-01",
                    "version":"darwin-teste-front-lib-01",
                    "createdAt":"2019-10-04 17:08:55",
                    "buildId":"1b73a17b-5725-461f-9665-ebedc06f1d57",
                    "componentId":"7473947d-6d42-4408-aa46-105ea8a7ce71"
                 },
                 { 
                    "id":"a7762f49-dced-4759-be14-42bc6d14b8e8",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-aggregator:darwin-teste-front-lib-01",
                    "version":"darwin-teste-front-lib-01",
                    "createdAt":"2019-10-04 17:09:05",
                    "buildId":"1b73a17b-5725-461f-9665-ebedc06f1d57",
                    "componentId":"7473947d-6d42-4408-aa46-105ea8a7ce71"
                 },
                 { 
                    "id":"63f286a8-696a-4d27-bc69-f43e4b0ed224",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-aggregator:darwin-teste-front-lib-01",
                    "version":"darwin-teste-front-lib-01",
                    "createdAt":"2019-10-04 17:09:15",
                    "buildId":"1b73a17b-5725-461f-9665-ebedc06f1d57",
                    "componentId":"7473947d-6d42-4408-aa46-105ea8a7ce71"
                 },
                 { 
                    "id":"0cb6a7b4-2236-4880-9b90-71b409501dbc",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-aggregator:darwin-send-all-headers",
                    "version":"darwin-send-all-headers",
                    "createdAt":"2019-10-04 18:57:36",
                    "buildId":"26e2987d-efb7-4b7f-a020-93fd688662f7",
                    "componentId":"7473947d-6d42-4408-aa46-105ea8a7ce71"
                 },
                 { 
                    "id":"d818d801-a329-4eeb-929d-c15f86c56cd0",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-aggregator:darwin-undo-nginx",
                    "version":"darwin-undo-nginx",
                    "createdAt":"2019-10-05 02:07:55",
                    "buildId":"ff5c41e2-cbc6-422e-a6e5-b0bfb0f5a4d0",
                    "componentId":"7473947d-6d42-4408-aa46-105ea8a7ce71"
                 },
                 { 
                    "id":"a1b6e5fd-4186-452c-b0e3-04af08843034",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-aggregator:darwin-lolo-cache-control",
                    "version":"darwin-lolo-cache-control",
                    "createdAt":"2019-10-07 04:06:55",
                    "buildId":"c4c29a07-8245-4cf0-9301-8f96dc0f9893",
                    "componentId":"7473947d-6d42-4408-aa46-105ea8a7ce71"
                 },
                 { 
                    "id":"ce8136fc-213f-4803-8716-462182574d2e",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-aggregator:darwin-teste-front-lib-01",
                    "version":"darwin-teste-front-lib-01",
                    "createdAt":"2019-10-04 17:09:25",
                    "buildId":"1b73a17b-5725-461f-9665-ebedc06f1d57",
                    "componentId":"7473947d-6d42-4408-aa46-105ea8a7ce71"
                 },
                 { 
                    "id":"6078bce3-38d9-473a-aeaf-8a85852df2fa",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-aggregator:darwin-fideback",
                    "version":"darwin-fideback",
                    "createdAt":"2019-10-04 21:04:05",
                    "buildId":"0213aff2-9120-4faf-9185-d3c46a317e7e",
                    "componentId":"7473947d-6d42-4408-aa46-105ea8a7ce71"
                 },
                 { 
                    "id":"40833e90-f472-4c84-87c6-9d957a8750bc",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-aggregator:darwin-undo-backlog-column-label",
                    "version":"darwin-undo-backlog-column-label",
                    "createdAt":"2019-10-05 03:08:15",
                    "buildId":"4063482d-3656-439d-98be-e51a5af67e2f",
                    "componentId":"7473947d-6d42-4408-aa46-105ea8a7ce71"
                 },
                 { 
                    "id":"1f436433-27d7-4cfe-b695-298ddfc4a25d",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-aggregator:darwin-teste-includes-headers",
                    "version":"darwin-teste-includes-headers",
                    "createdAt":"2019-10-07 02:56:05",
                    "buildId":"fb085bd7-be7e-47bb-a3e1-5a503b50b804",
                    "componentId":"7473947d-6d42-4408-aa46-105ea8a7ce71"
                 },
                 { 
                    "id":"7af001cc-6cd1-49a1-b255-f0278328db52",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-aggregator:darwin-back-lolo-cookie-header",
                    "version":"darwin-back-lolo-cookie-header",
                    "createdAt":"2019-10-07 19:10:05",
                    "buildId":"ff92f4d5-f020-40ea-a0f1-66ad34e86c58",
                    "componentId":"7473947d-6d42-4408-aa46-105ea8a7ce71"
                 },
                 { 
                    "id":"ede4eb15-4b2f-47b4-bff8-51ca29b6a99b",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-aggregator:darwin-remove-service-worker",
                    "version":"darwin-remove-service-worker",
                    "createdAt":"2019-10-07 21:12:45",
                    "buildId":"f5644ece-c3c9-4345-aabf-854be39a4c9e",
                    "componentId":"7473947d-6d42-4408-aa46-105ea8a7ce71"
                 },
                 { 
                    "id":"0218b80d-a14f-4c46-9c77-ed678c366cc2",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-aggregator:darwin-teste-front-lib-01",
                    "version":"darwin-teste-front-lib-01",
                    "createdAt":"2019-10-04 17:09:35",
                    "buildId":"1b73a17b-5725-461f-9665-ebedc06f1d57",
                    "componentId":"7473947d-6d42-4408-aa46-105ea8a7ce71"
                 },
                 { 
                    "id":"fc624c97-06f5-475e-a7f7-12e6720ca7f7",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-aggregator:darwin-send-all-headers",
                    "version":"darwin-send-all-headers",
                    "createdAt":"2019-10-04 18:57:25",
                    "buildId":"26e2987d-efb7-4b7f-a020-93fd688662f7",
                    "componentId":"7473947d-6d42-4408-aa46-105ea8a7ce71"
                 },
                 { 
                    "id":"ce2bdc39-cfff-4705-8676-adb5dd45a815",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-aggregator:darwin-intercept-specific-files",
                    "version":"darwin-intercept-specific-files",
                    "createdAt":"2019-10-04 20:36:55",
                    "buildId":"5f42d00e-4f49-4b9e-ad5d-67309ce5ecaa",
                    "componentId":"7473947d-6d42-4408-aa46-105ea8a7ce71"
                 },
                 { 
                    "id":"4bdabec8-d4fc-4795-8bba-106b25a72bbe",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-aggregator:darwin-undo-column-label-02",
                    "version":"darwin-undo-column-label-02",
                    "createdAt":"2019-10-05 03:37:25",
                    "buildId":"71831f79-97eb-433f-babd-20186a0b4720",
                    "componentId":"7473947d-6d42-4408-aa46-105ea8a7ce71"
                 },
                 { 
                    "id":"6ad51a23-cd8e-456b-8c16-0af2d68bd2f4",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-aggregator:darwin-fetch-cookie-data",
                    "version":"darwin-fetch-cookie-data",
                    "createdAt":"2019-10-07 18:33:35",
                    "buildId":"c37336f2-6515-4233-b4ac-bbf7eece6e72",
                    "componentId":"7473947d-6d42-4408-aa46-105ea8a7ce71"
                 },
                 { 
                    "id":"60370815-f83c-4aa3-8cfe-14f64421d786",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-aggregator:darwin-remove-sw-again",
                    "version":"darwin-remove-sw-again",
                    "createdAt":"2019-10-08 13:03:35",
                    "buildId":"cd001ced-517a-4220-a070-46d22b383d65",
                    "componentId":"7473947d-6d42-4408-aa46-105ea8a7ce71"
                 },
                 { 
                    "id":"cc9b13ca-55a7-4a8f-9822-f69d6bca1565",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-aggregator:darwin-tela-de-modulos",
                    "version":"darwin-tela-de-modulos",
                    "createdAt":"2019-10-08 14:54:05",
                    "buildId":"60f486c4-59fc-4cc9-89a6-ed236736f1af",
                    "componentId":"7473947d-6d42-4408-aa46-105ea8a7ce71"
                 },
                 { 
                    "id":"3a6453db-ae6f-4fe2-a22b-19f5f7397b72",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-aggregator:darwin-fix-reset-state-on-create-problem",
                    "version":"darwin-fix-reset-state-on-create-problem",
                    "createdAt":"2019-10-08 16:45:05",
                    "buildId":"d6e8ffd1-beec-4ccb-ae08-d97072aafd51",
                    "componentId":"7473947d-6d42-4408-aa46-105ea8a7ce71"
                 },
                 { 
                    "id":"2a181664-bdcb-46c6-8b22-fea6d3c6aa80",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-aggregator:darwin-test-create-module",
                    "version":"darwin-test-create-module",
                    "createdAt":"2019-10-08 17:06:29",
                    "buildId":"5266e3cb-30fc-459a-94de-c3f20009a538",
                    "componentId":"7473947d-6d42-4408-aa46-105ea8a7ce71"
                 },
                 { 
                    "id":"939cc51b-0f6d-4193-bfc2-d1db46bf8e81",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-aggregator:darwin-front-virtual-service-fix",
                    "version":"darwin-front-virtual-service-fix",
                    "createdAt":"2019-10-08 18:07:25",
                    "buildId":"ff680ab4-ec3b-4890-b6d4-eba7ad01618f",
                    "componentId":"7473947d-6d42-4408-aa46-105ea8a7ce71"
                 },
                 { 
                    "id":"8da9a90c-79fb-43dc-b5c7-0c1b17581459",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-aggregator:darwin-teste-02-config-modules",
                    "version":"darwin-teste-02-config-modules",
                    "createdAt":"2019-10-08 18:37:05",
                    "buildId":"b377ab89-9867-46c9-9336-54f0dd501a2e",
                    "componentId":"7473947d-6d42-4408-aa46-105ea8a7ce71"
                 },
                 { 
                    "id":"9e1bd3dd-8c5d-469c-933e-9a714c6a41f4",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-aggregator:darwin-enhancemente-darwin",
                    "version":"darwin-enhancemente-darwin",
                    "createdAt":"2019-10-08 20:27:15",
                    "buildId":"929587ba-bb0d-4f68-bbb1-222ea1a3b71a",
                    "componentId":"7473947d-6d42-4408-aa46-105ea8a7ce71"
                 },
                 { 
                    "id":"7e8dfdd6-3db9-44ef-a6ee-34344c2ba73b",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-aggregator:darwin-test-bpollisd",
                    "version":"darwin-test-bpollisd",
                    "createdAt":"2019-10-08 22:13:55",
                    "buildId":"8d922089-d087-442f-948c-e96dd21bd2ce",
                    "componentId":"7473947d-6d42-4408-aa46-105ea8a7ce71"
                 },
                 { 
                    "id":"bc36d6ec-f3b1-4497-ab0c-18021c447079",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-aggregator:darwin-fix-get-modules-with-rxjs-redux",
                    "version":"darwin-fix-get-modules-with-rxjs-redux",
                    "createdAt":"2019-10-08 22:28:05",
                    "buildId":"6b96fcb6-ca44-483c-9c0d-e2bd43020a4c",
                    "componentId":"7473947d-6d42-4408-aa46-105ea8a7ce71"
                 },
                 { 
                    "id":"2d828b96-203b-482c-b13c-8eb6a0c5c4b8",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-aggregator:darwin-test-remove-cach-builds",
                    "version":"darwin-test-remove-cach-builds",
                    "createdAt":"2019-10-09 20:11:15",
                    "buildId":"0f4d24e8-dd3e-4fe2-8623-eb559b56363e",
                    "componentId":"7473947d-6d42-4408-aa46-105ea8a7ce71"
                 },
                 { 
                    "id":"94372aff-8a46-472b-9cf7-231cd0bc6f60",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-aggregator:darwin-test-01-remove-cache-builds",
                    "version":"darwin-test-01-remove-cache-builds",
                    "createdAt":"2019-10-10 03:35:05",
                    "buildId":"0d0ed2a3-955c-4223-a270-ab4afeb14e7d",
                    "componentId":"7473947d-6d42-4408-aa46-105ea8a7ce71"
                 },
                 { 
                    "id":"36376d29-0068-4711-b38e-61cd5ec8eaaf",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-aggregator:darwin-test-02-remove-cache-builds",
                    "version":"darwin-test-02-remove-cache-builds",
                    "createdAt":"2019-10-10 04:45:15",
                    "buildId":"424bc139-5426-4d44-890d-52205ae773ba",
                    "componentId":"7473947d-6d42-4408-aa46-105ea8a7ce71"
                 },
                 { 
                    "id":"7b76502e-059a-438b-a7f3-ce74d8d468bb",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-aggregator:darwin-test-01-lazy-loading",
                    "version":"darwin-test-01-lazy-loading",
                    "createdAt":"2019-10-10 19:15:25",
                    "buildId":"a6e23ee0-b4a7-40a7-a09b-206053ec852d",
                    "componentId":"7473947d-6d42-4408-aa46-105ea8a7ce71"
                 },
                 { 
                    "id":"0d7fbc54-acdc-4f6f-b485-73f96faa28c1",
                    "artifact":"null/darwin-ui-aggregator:darwin-archive-and-delete-builds-and-cards",
                    "version":"darwin-archive-and-delete-builds-and-cards",
                    "createdAt":"2019-10-10 19:37:05",
                    "buildId":"a184c85a-c328-4af6-aae3-d87e0e14eacb",
                    "componentId":"7473947d-6d42-4408-aa46-105ea8a7ce71"
                 },
                 { 
                    "id":"0b75c5f7-c70e-47c0-b3ca-f2cb9f029303",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-aggregator:darwin-fix-front-archive-delete-04",
                    "version":"darwin-fix-front-archive-delete-04",
                    "createdAt":"2019-10-10 22:24:03",
                    "buildId":"0a2ebc24-df20-4e47-a9ce-75dd8dcbbf5d",
                    "componentId":"7473947d-6d42-4408-aa46-105ea8a7ce71"
                 },
                 { 
                    "id":"4ae30d8b-2175-45e1-bacf-16bcabfba486",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-aggregator:darwin-bundle-0-0-6",
                    "version":"darwin-bundle-0-0-6",
                    "createdAt":"2019-10-11 20:10:44",
                    "buildId":"4b1b38e2-878e-4149-bae6-a8e31dfb0c48",
                    "componentId":"7473947d-6d42-4408-aa46-105ea8a7ce71"
                 },
                 { 
                    "id":"55b45687-2b01-424a-b95d-638e331818f6",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-aggregator:darwin-bundle-0-0-7",
                    "version":"darwin-bundle-0-0-7",
                    "createdAt":"2019-10-11 20:36:45",
                    "buildId":"0e796045-55f6-47a7-97f2-530a644f4527",
                    "componentId":"7473947d-6d42-4408-aa46-105ea8a7ce71"
                 },
                 { 
                    "id":"6b121c60-e97c-473f-b8e6-c6e74e8b97a0",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-aggregator:darwin-bundle-0-0-9",
                    "version":"darwin-bundle-0-0-9",
                    "createdAt":"2019-10-11 21:32:06",
                    "buildId":"01c6a677-ccaf-4577-941b-38e32f5c8442",
                    "componentId":"7473947d-6d42-4408-aa46-105ea8a7ce71"
                 },
                 { 
                    "id":"7e5de46b-ca4a-4e56-bc94-582c61f1ba11",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-aggregator:darwin-modules-improved",
                    "version":"darwin-modules-improved",
                    "createdAt":"2019-10-15 14:07:57",
                    "buildId":"2f8a4e6f-674b-499e-a327-e1d98a9a8920",
                    "componentId":"7473947d-6d42-4408-aa46-105ea8a7ce71"
                 },
                 { 
                    "id":"acd38f2a-d0f4-4b54-be71-0abdeccf95ef",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-aggregator:darwin-bundle-0-0-10",
                    "version":"darwin-bundle-0-0-10",
                    "createdAt":"2019-10-15 18:54:57",
                    "buildId":"861f4684-c059-42b0-a105-5ae031df88ea",
                    "componentId":"7473947d-6d42-4408-aa46-105ea8a7ce71"
                 },
                 { 
                    "id":"6c852a08-8778-449a-b4a5-f22481d6adbb",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-aggregator:darwin-bundle-0-0-11",
                    "version":"darwin-bundle-0-0-11",
                    "createdAt":"2019-10-15 19:12:07",
                    "buildId":"7750c0b9-6cb4-44da-ba36-3c923df6db73",
                    "componentId":"7473947d-6d42-4408-aa46-105ea8a7ce71"
                 },
                 { 
                    "id":"57635d1a-1a63-4558-92f6-91df5863dfe9",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-aggregator:darwin-commons-js",
                    "version":"darwin-commons-js",
                    "createdAt":"2019-10-23 14:58:44",
                    "buildId":"47457d69-14ed-4759-ae78-143098f292ab",
                    "componentId":"7473947d-6d42-4408-aa46-105ea8a7ce71"
                 },
                 { 
                    "id":"1b47d6e9-b091-4746-a960-c136f9ff142b",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-aggregator:darwin-commons-js-02",
                    "version":"darwin-commons-js-02",
                    "createdAt":"2019-10-23 15:25:44",
                    "buildId":"27f38764-bd28-466f-b672-dc225965e1cc",
                    "componentId":"7473947d-6d42-4408-aa46-105ea8a7ce71"
                 },
                 { 
                    "id":"12e66a99-6cbd-491e-b80c-b847d44c04ef",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-aggregator:darwin-commons-js-04",
                    "version":"darwin-commons-js-04",
                    "createdAt":"2019-10-23 18:57:04",
                    "buildId":"45e1c475-2474-45c4-a91e-9ea1e0e1d558",
                    "componentId":"7473947d-6d42-4408-aa46-105ea8a7ce71"
                 },
                 { 
                    "id":"67257286-48c5-497d-99c9-db5446d8ace2",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-aggregator:darwin-commons-js-06",
                    "version":"darwin-commons-js-06",
                    "createdAt":"2019-10-23 20:44:24",
                    "buildId":"da118b82-382d-443a-95f0-fb9f3a2c7646",
                    "componentId":"7473947d-6d42-4408-aa46-105ea8a7ce71"
                 },
                 { 
                    "id":"aa070fe8-c519-4452-a915-b3a1ff70a236",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-aggregator:darwin-commons-js-07",
                    "version":"darwin-commons-js-07",
                    "createdAt":"2019-10-23 21:11:56",
                    "buildId":"b66238a6-b63f-4368-918b-41e0d96fca3f",
                    "componentId":"7473947d-6d42-4408-aa46-105ea8a7ce71"
                 },
                 { 
                    "id":"63cfa92e-4178-43d4-b5c9-aa2c3200d487",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-aggregator:darwin-commons-js-09",
                    "version":"darwin-commons-js-09",
                    "createdAt":"2019-10-23 21:28:37",
                    "buildId":"09b3264e-e8a3-4075-8827-c7b199db5261",
                    "componentId":"7473947d-6d42-4408-aa46-105ea8a7ce71"
                 },
                 { 
                    "id":"5bdcf64c-98a1-4779-96ea-df27b9d71c0e",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-aggregator:darwin-commons-js-08",
                    "version":"darwin-commons-js-08",
                    "createdAt":"2019-10-23 21:38:44",
                    "buildId":"559250a7-5320-422a-b939-cd56b0ffc68b",
                    "componentId":"7473947d-6d42-4408-aa46-105ea8a7ce71"
                 },
                 { 
                    "id":"5d69cc22-1dc8-4d3f-b805-5e3e899c8a94",
                    "artifact":"realwavelab.azurecr.io/darwin-ui-aggregator:darwin-commons-js-10",
                    "version":"darwin-commons-js-10",
                    "createdAt":"2019-10-23 21:45:36",
                    "buildId":"a6df1030-cd11-4a70-9e5b-ae011250aa5c",
                    "componentId":"7473947d-6d42-4408-aa46-105ea8a7ce71"
                 }
              ]
           }
        ]
     },
     { 
        "id":"d83dcf30-6530-4516-a5a1-2e464a151bec",
        "name":"ZupIT/darwin-content",
        "gitRepositoryAddress":"https://github.com/ZupIT/darwin-content",
        "gitConfigurationId":"052789e8-bbab-4c93-9f88-b4bdd8899028",
        "registryConfigurationId":"9f2228b8-a58f-4fe3-bc87-8bbb9f7515c9",
        "cdConfigurationId":"35c6dad1-f34f-4498-bdb9-38bc19ebac38",
        "createdAt":"2019-08-14 14:10:28",
        "author":{ 
           "id":"9ab35f64-99c4-4db3-9ba6-b002d7b58a5f",
           "name":"Douglas Fernandes",
           "email":"douglas.fernandes@zup.com.br",
           "photoUrl":"https://trello-avatars.s3.amazonaws.com/790ba7e5c8b7f649e8576d47b330c41e/original.png"
        },
        "labels":[ 

        ],
        "components":[ 
           { 
              "id":"874bb891-5764-40de-ac81-9d5f3a91a45d",
              "name":"darwin-content",
              "contextPath":"/darwin-content",
              "port":3000,
              "healthCheck":"/darwin-content/health",
              "createdAt":"2019-08-14 14:10:28",
              "moduleId":"d83dcf30-6530-4516-a5a1-2e464a151bec",
              "artifacts":[ 
                 { 
                    "id":"bb8a0a80-2d6c-434b-88d4-53aff620276f",
                    "artifact":"realwavelab.azurecr.io/darwin-content:darwin-sem-resultado-v-4",
                    "version":"darwin-sem-resultado-v-4",
                    "createdAt":"2019-10-17 13:18:06",
                    "buildId":"665d91ff-e762-4fe8-a366-9c281e6c815c",
                    "componentId":"874bb891-5764-40de-ac81-9d5f3a91a45d"
                 },
                 { 
                    "id":"a2392699-9c1f-40a9-8bdf-b5e8077e669a",
                    "artifact":"realwavelab.azurecr.io/darwin-content:darwin-teste",
                    "version":"darwin-teste",
                    "createdAt":"2019-10-17 12:46:07",
                    "buildId":"d5e357fe-cc11-4bc2-a948-34f4fe20ab93",
                    "componentId":"874bb891-5764-40de-ac81-9d5f3a91a45d"
                 },
                 { 
                    "id":"0271a872-1377-467b-b2c6-e7aeb7c2e1e5",
                    "artifact":"realwavelab.azurecr.io/darwin-content:darwin-header-test-02",
                    "version":"darwin-header-test-02",
                    "createdAt":"2019-10-06 03:37:55",
                    "buildId":"125c99d4-d7ab-47c1-bee4-b381f205b37e",
                    "componentId":"874bb891-5764-40de-ac81-9d5f3a91a45d"
                 },
                 { 
                    "id":"bc385b4c-7bac-4664-8a55-bfa1b4b270be",
                    "artifact":"realwavelab.azurecr.io/darwin-content:darwin-com-resultado-v-4",
                    "version":"darwin-com-resultado-v-4",
                    "createdAt":"2019-10-04 16:51:55",
                    "buildId":"ec268e7b-99df-44c8-ac21-4a8e37ecb66a",
                    "componentId":"874bb891-5764-40de-ac81-9d5f3a91a45d"
                 },
                 { 
                    "id":"c01b0f0d-658d-419c-a8e6-aa7ff3ea4f5b",
                    "artifact":"realwavelab.azurecr.io/darwin-content:darwin-somente-login-v-3",
                    "version":"darwin-somente-login-v-3",
                    "createdAt":"2019-10-04 15:35:55",
                    "buildId":"fc3308bc-17d5-4e8c-b874-2ea186b16770",
                    "componentId":"874bb891-5764-40de-ac81-9d5f3a91a45d"
                 },
                 { 
                    "id":"a48816d8-55b2-4dae-a7e2-4937158c5d3e",
                    "artifact":"realwavelab.azurecr.io/darwin-content:darwin-header-test",
                    "version":"darwin-header-test",
                    "createdAt":"2019-10-06 03:35:35",
                    "buildId":"a26a9150-5281-467a-a695-90dd8d4f0530",
                    "componentId":"874bb891-5764-40de-ac81-9d5f3a91a45d"
                 },
                 { 
                    "id":"56d95d10-fb10-4e66-bed6-a47a26d1c12b",
                    "artifact":"realwavelab.azurecr.io/darwin-content:darwin-com-resultado-v-4",
                    "version":"darwin-com-resultado-v-4",
                    "createdAt":"2019-10-04 16:51:45",
                    "buildId":"ec268e7b-99df-44c8-ac21-4a8e37ecb66a",
                    "componentId":"874bb891-5764-40de-ac81-9d5f3a91a45d"
                 },
                 { 
                    "id":"b5031ec4-2b13-4040-b343-3fd3e8fa27c4",
                    "artifact":"realwavelab.azurecr.io/darwin-content:darwin-com-resultado-v-4",
                    "version":"darwin-com-resultado-v-4",
                    "createdAt":"2019-10-04 16:51:15",
                    "buildId":"ec268e7b-99df-44c8-ac21-4a8e37ecb66a",
                    "componentId":"874bb891-5764-40de-ac81-9d5f3a91a45d"
                 },
                 { 
                    "id":"eaae4c3c-4568-4cf7-b9da-e595b4056b69",
                    "artifact":"realwavelab.azurecr.io/darwin-content:darwin-com-resultado-v-4",
                    "version":"darwin-com-resultado-v-4",
                    "createdAt":"2019-10-04 16:51:05",
                    "buildId":"ec268e7b-99df-44c8-ac21-4a8e37ecb66a",
                    "componentId":"874bb891-5764-40de-ac81-9d5f3a91a45d"
                 },
                 { 
                    "id":"dcebb2ca-1591-443a-a36c-7468ee88908e",
                    "artifact":"realwavelab.azurecr.io/darwin-content:darwin-header-test-03",
                    "version":"darwin-header-test-03",
                    "createdAt":"2019-10-06 04:02:15",
                    "buildId":"da6c46f2-3f86-4e92-b026-62d413b22dd5",
                    "componentId":"874bb891-5764-40de-ac81-9d5f3a91a45d"
                 },
                 { 
                    "id":"751fa9fb-f72e-4a7c-a400-0ace9807b60b",
                    "artifact":"realwavelab.azurecr.io/darwin-content:darwin-somente-login-v-3",
                    "version":"darwin-somente-login-v-3",
                    "createdAt":"2019-10-04 15:36:05",
                    "buildId":"fc3308bc-17d5-4e8c-b874-2ea186b16770",
                    "componentId":"874bb891-5764-40de-ac81-9d5f3a91a45d"
                 },
                 { 
                    "id":"2e91dca4-e057-4823-976f-ae31a0a42c25",
                    "artifact":"realwavelab.azurecr.io/darwin-content:darwin-teste-iti",
                    "version":"darwin-teste-iti",
                    "createdAt":"2019-10-09 17:49:05",
                    "buildId":"7e6be83b-6b56-4fa1-be51-6422c8efee29",
                    "componentId":"874bb891-5764-40de-ac81-9d5f3a91a45d"
                 },
                 { 
                    "id":"f22c9d70-a45a-4395-af17-c2c525acb748",
                    "artifact":"realwavelab.azurecr.io/darwin-content:darwin-release-iti-no-cards",
                    "version":"darwin-release-iti-no-cards",
                    "createdAt":"2019-10-09 14:38:55",
                    "buildId":"35f6e63a-b064-4a2a-bc1f-f450e0d52036",
                    "componentId":"874bb891-5764-40de-ac81-9d5f3a91a45d"
                 },
                 { 
                    "id":"5574fb1d-787d-4234-9cfa-5c76699503af",
                    "artifact":"realwavelab.azurecr.io/darwin-content:darwin-1-0-wallet",
                    "version":"darwin-1-0-wallet",
                    "createdAt":"2019-10-08 17:17:45",
                    "buildId":"889ff9b8-e3c2-440e-b974-f3eecfde32e0",
                    "componentId":"874bb891-5764-40de-ac81-9d5f3a91a45d"
                 },
                 { 
                    "id":"03db9d29-709b-4318-a123-a4bdf126ad0c",
                    "artifact":"realwavelab.azurecr.io/darwin-content:darwin-finish-initial-version",
                    "version":"darwin-finish-initial-version",
                    "createdAt":"2019-10-07 18:48:05",
                    "buildId":"3d653cce-970d-4e73-b87c-14d7b087c5d6",
                    "componentId":"874bb891-5764-40de-ac81-9d5f3a91a45d"
                 },
                 { 
                    "id":"88b6f682-c171-4fbd-8313-623d05270827",
                    "artifact":"realwavelab.azurecr.io/darwin-content:darwin-with-cpf",
                    "version":"darwin-with-cpf",
                    "createdAt":"2019-10-08 03:09:05",
                    "buildId":"7afded51-a62b-4032-9977-5a78387aeead",
                    "componentId":"874bb891-5764-40de-ac81-9d5f3a91a45d"
                 },
                 { 
                    "id":"8a6611d2-b320-4008-b794-5b0836664ffe",
                    "artifact":"realwavelab.azurecr.io/darwin-content:darwin-fix-home",
                    "version":"darwin-fix-home",
                    "createdAt":"2019-10-08 02:50:25",
                    "buildId":"9936e834-268a-4e82-a916-3653f182d52d",
                    "componentId":"874bb891-5764-40de-ac81-9d5f3a91a45d"
                 },
                 { 
                    "id":"f57ffa5a-eccf-4b35-949f-b2bc9dc01d1f",
                    "artifact":"realwavelab.azurecr.io/darwin-content:darwin-new-home",
                    "version":"darwin-new-home",
                    "createdAt":"2019-10-08 01:59:05",
                    "buildId":"d481116e-879b-4ae6-a1fe-60ba40571d80",
                    "componentId":"874bb891-5764-40de-ac81-9d5f3a91a45d"
                 },
                 { 
                    "id":"fc76878b-625c-4f01-a394-a5a88a3baf73",
                    "artifact":"realwavelab.azurecr.io/darwin-content:darwin-with-index",
                    "version":"darwin-with-index",
                    "createdAt":"2019-10-08 01:55:25",
                    "buildId":"bde82249-6b3c-48a6-9183-86aa248a6a9f",
                    "componentId":"874bb891-5764-40de-ac81-9d5f3a91a45d"
                 },
                 { 
                    "id":"d866b5b3-5fbd-4be7-a717-35552e0d74cf",
                    "artifact":"realwavelab.azurecr.io/darwin-content:darwin-orchestrator",
                    "version":"darwin-orchestrator",
                    "createdAt":"2019-10-07 21:24:15",
                    "buildId":"9135a23e-890a-46b7-ad4c-8751aceb039c",
                    "componentId":"874bb891-5764-40de-ac81-9d5f3a91a45d"
                 },
                 { 
                    "id":"b86a223e-91f7-4920-b3d9-d1d7b8b68630",
                    "artifact":"realwavelab.azurecr.io/darwin-content:darwin-hotfix-first-version",
                    "version":"darwin-hotfix-first-version",
                    "createdAt":"2019-10-07 18:31:15",
                    "buildId":"78788c94-8fbb-45a6-be38-d1e2a687b047",
                    "componentId":"874bb891-5764-40de-ac81-9d5f3a91a45d"
                 },
                 { 
                    "id":"7fcf3a07-7811-4d62-a8af-f130dcf34e6f",
                    "artifact":"realwavelab.azurecr.io/darwin-content:darwin-initial-version",
                    "version":"darwin-initial-version",
                    "createdAt":"2019-10-07 13:11:35",
                    "buildId":"602174aa-0b1f-497f-b74c-1b552e476271",
                    "componentId":"874bb891-5764-40de-ac81-9d5f3a91a45d"
                 },
                 { 
                    "id":"5f920b31-1508-494d-a891-f22c0725f37d",
                    "artifact":"realwavelab.azurecr.io/darwin-content:darwin-initial-version-beagle",
                    "version":"darwin-initial-version-beagle",
                    "createdAt":"2019-10-07 15:15:25",
                    "buildId":"e38820fe-670f-4cc4-a808-1a2995897d58",
                    "componentId":"874bb891-5764-40de-ac81-9d5f3a91a45d"
                 },
                 { 
                    "id":"380154ed-c15f-4446-8456-c92aad815b24",
                    "artifact":"realwavelab.azurecr.io/darwin-content:darwin-v-1-do-app",
                    "version":"darwin-v-1-do-app",
                    "createdAt":"2019-10-23 20:45:25",
                    "buildId":"1f7c563f-a3fc-4881-95c6-823902eace1d",
                    "componentId":"874bb891-5764-40de-ac81-9d5f3a91a45d"
                 },
                 { 
                    "id":"0c0d1cf5-dfce-4433-baa9-122c18eeac0f",
                    "artifact":"realwavelab.azurecr.io/darwin-content:darwin-release-geracao-boleto",
                    "version":"darwin-release-geracao-boleto",
                    "createdAt":"2019-10-17 19:17:47",
                    "buildId":"0991ec17-7918-4196-a541-479ea646849f",
                    "componentId":"874bb891-5764-40de-ac81-9d5f3a91a45d"
                 },
                 { 
                    "id":"08ac312f-53a3-48ef-9a36-04d750ea3838",
                    "artifact":"realwavelab.azurecr.io/darwin-content:darwin-version-without-card",
                    "version":"darwin-version-without-card",
                    "createdAt":"2019-10-17 14:19:46",
                    "buildId":"67a52525-9bfe-4e54-952c-316a80e97e3a",
                    "componentId":"874bb891-5764-40de-ac81-9d5f3a91a45d"
                 },
                 { 
                    "id":"34a951df-a486-4601-a1fa-9d914fba7744",
                    "artifact":"realwavelab.azurecr.io/darwin-content:darwin-yeste-12121",
                    "version":"darwin-yeste-12121",
                    "createdAt":"2019-10-14 19:33:06",
                    "buildId":"30d6feab-79dc-4ade-875f-340ccdb31d18",
                    "componentId":"874bb891-5764-40de-ac81-9d5f3a91a45d"
                 },
                 { 
                    "id":"35e966a7-7559-405e-bd27-294fa0ef3375",
                    "artifact":"realwavelab.azurecr.io/darwin-content:darwin-testebcp",
                    "version":"darwin-testebcp",
                    "createdAt":"2019-10-14 15:07:15",
                    "buildId":"848b6424-0073-4520-9c95-6d8c04553902",
                    "componentId":"874bb891-5764-40de-ac81-9d5f3a91a45d"
                 },
                 { 
                    "id":"a0c32520-f22c-4288-b657-5531b97fb81f",
                    "artifact":"realwavelab.azurecr.io/darwin-content:darwin-release-reuniao-resultados",
                    "version":"darwin-release-reuniao-resultados",
                    "createdAt":"2019-10-11 14:14:33",
                    "buildId":"d3d377c7-cf1a-40a9-bc2d-a48bcdfee925",
                    "componentId":"874bb891-5764-40de-ac81-9d5f3a91a45d"
                 },
                 { 
                    "id":"bdb09ca8-5b18-4334-9f8e-c10b6722e572",
                    "artifact":"realwavelab.azurecr.io/darwin-content:darwin-rc-20190909",
                    "version":"darwin-rc-20190909",
                    "createdAt":"2019-10-10 11:38:35",
                    "buildId":"387903fa-1e50-45af-9144-2142c3c41a36",
                    "componentId":"874bb891-5764-40de-ac81-9d5f3a91a45d"
                 },
                 { 
                    "id":"94cc9bc7-8610-4ccb-82f5-2b2b120091b2",
                    "artifact":"realwavelab.azurecr.io/darwin-content:darwin-rc-1-1",
                    "version":"darwin-rc-1-1",
                    "createdAt":"2019-10-08 17:16:25",
                    "buildId":"7e61bc09-96fb-4a37-9d29-e9db8cd47270",
                    "componentId":"874bb891-5764-40de-ac81-9d5f3a91a45d"
                 },
                 { 
                    "id":"fd702ac9-a137-45f5-abd4-e457369d8edf",
                    "artifact":"realwavelab.azurecr.io/darwin-content:darwin-finish-view",
                    "version":"darwin-finish-view",
                    "createdAt":"2019-10-08 12:54:27",
                    "buildId":"33eec6ef-229f-4000-a169-b4fe4c03bc4f",
                    "componentId":"874bb891-5764-40de-ac81-9d5f3a91a45d"
                 },
                 { 
                    "id":"a7dc417f-567a-499a-8f9a-63adc60b7363",
                    "artifact":"realwavelab.azurecr.io/darwin-content:darwin-event-version",
                    "version":"darwin-event-version",
                    "createdAt":"2019-10-08 12:51:55",
                    "buildId":"a2b17fdd-27c4-4738-8aa6-9594be14b0bc",
                    "componentId":"874bb891-5764-40de-ac81-9d5f3a91a45d"
                 },
                 { 
                    "id":"88996146-f8ce-4460-9615-e3d6d432a4f4",
                    "artifact":"realwavelab.azurecr.io/darwin-content:darwin-one-card",
                    "version":"darwin-one-card",
                    "createdAt":"2019-10-08 03:25:25",
                    "buildId":"bc8478de-12d4-4efe-b003-0a1ed33f2150",
                    "componentId":"874bb891-5764-40de-ac81-9d5f3a91a45d"
                 },
                 { 
                    "id":"22bcd76a-8053-49e4-8f64-ed43c2eaa1ef",
                    "artifact":"realwavelab.azurecr.io/darwin-content:darwin-with-cards",
                    "version":"darwin-with-cards",
                    "createdAt":"2019-10-08 03:10:45",
                    "buildId":"7faca1cf-252c-4a3e-9d86-ef37aab31b80",
                    "componentId":"874bb891-5764-40de-ac81-9d5f3a91a45d"
                 },
                 { 
                    "id":"d993108a-561c-44ee-add2-0d5a5339b1ba",
                    "artifact":"realwavelab.azurecr.io/darwin-content:darwin-transfer-card-beagle",
                    "version":"darwin-transfer-card-beagle",
                    "createdAt":"2019-10-07 15:02:35",
                    "buildId":"f01d337c-73af-4c05-bbde-7552506fc338",
                    "componentId":"874bb891-5764-40de-ac81-9d5f3a91a45d"
                 },
                 { 
                    "id":"5a45e7f8-d47d-45ee-aec5-ce60924efe5a",
                    "artifact":"realwavelab.azurecr.io/darwin-content:darwin-versao-full",
                    "version":"darwin-versao-full",
                    "createdAt":"2019-10-08 03:04:45",
                    "buildId":"31e7ede8-a3d9-4c6b-b3af-1b7d47a2350f",
                    "componentId":"874bb891-5764-40de-ac81-9d5f3a91a45d"
                 },
                 { 
                    "id":"7cab539e-3d76-4333-9995-63689e78bbaf",
                    "artifact":"realwavelab.azurecr.io/darwin-content:darwin-with-orchestrator",
                    "version":"darwin-with-orchestrator",
                    "createdAt":"2019-10-07 21:46:25",
                    "buildId":"bcbc3a29-e9d1-4ebc-a070-e689b17a279f",
                    "componentId":"874bb891-5764-40de-ac81-9d5f3a91a45d"
                 },
                 { 
                    "id":"255ca3d5-1117-4604-bd7f-645a70a98888",
                    "artifact":"realwavelab.azurecr.io/darwin-content:darwin-transfer-card",
                    "version":"darwin-transfer-card",
                    "createdAt":"2019-10-07 14:17:35",
                    "buildId":"315374dc-9faa-4b90-9e6c-d34fd9a55744",
                    "componentId":"874bb891-5764-40de-ac81-9d5f3a91a45d"
                 },
                 { 
                    "id":"6ad0aa77-de85-4b32-a300-1302e3d7311a",
                    "artifact":"realwavelab.azurecr.io/darwin-content:darwin-rc-1-0",
                    "version":"darwin-rc-1-0",
                    "createdAt":"2019-10-03 21:08:17",
                    "buildId":"df48119e-ecd6-4a0a-bf4b-ab21cf470f36",
                    "componentId":"874bb891-5764-40de-ac81-9d5f3a91a45d"
                 }
              ]
           }
        ]
     },
     { 
        "id":"c0d3ae1b-2d20-455d-840b-644be1c5e181",
        "name":"ZupIT/iti-bff",
        "gitRepositoryAddress":"https://github.com/ZupIT/iti-bff",
        "gitConfigurationId":"052789e8-bbab-4c93-9f88-b4bdd8899028",
        "registryConfigurationId":"9f2228b8-a58f-4fe3-bc87-8bbb9f7515c9",
        "cdConfigurationId":"35c6dad1-f34f-4498-bdb9-38bc19ebac38",
        "createdAt":"2019-10-23 22:42:05",
        "author":{ 
           "id":"082ed4c8-adb1-4a94-94bd-98b40f1354d3",
           "name":"Pedro Naves",
           "email":"pedro.naves@zup.com.br",
           "photoUrl":"https://trello-avatars.s3.amazonaws.com/4dbd900cac9cf9869250177b70fd5e59/original.png"
        },
        "labels":[ 

        ],
        "components":[ 
           { 
              "id":"cac9dbf5-034c-458b-b34c-cda644807d6c",
              "name":"iti-bff",
              "contextPath":"/",
              "port":8080,
              "healthCheck":"/actuator/health",
              "createdAt":"2019-10-23 22:42:05",
              "moduleId":"c0d3ae1b-2d20-455d-840b-644be1c5e181",
              "artifacts":[ 
                 { 
                    "id":"884a3a72-e021-43b3-ab0f-d76b0a1b21a5",
                    "artifact":"realwavelab.azurecr.io/iti-bff:darwin-sample",
                    "version":"darwin-sample",
                    "createdAt":"2019-10-24 18:41:15",
                    "buildId":"cf157e0b-f779-462a-ae27-0d186140898e",
                    "componentId":"cac9dbf5-034c-458b-b34c-cda644807d6c"
                 },
                 { 
                    "id":"a779713f-5cd5-4089-ae26-d07d9c62f3a0",
                    "artifact":"realwavelab.azurecr.io/iti-bff:darwin-with-flex-component",
                    "version":"darwin-with-flex-component",
                    "createdAt":"2019-10-24 20:33:55",
                    "buildId":"23f3ce2f-7f7e-4117-b8e5-293942ca2f53",
                    "componentId":"cac9dbf5-034c-458b-b34c-cda644807d6c"
                 },
                 { 
                    "id":"770646fc-e185-4c71-b316-86cac228cc48",
                    "artifact":"realwavelab.azurecr.io/iti-bff:darwin-added-flex-path",
                    "version":"darwin-added-flex-path",
                    "createdAt":"2019-10-24 20:10:25",
                    "buildId":"00cfb7db-9d84-4d0a-9f40-973cbaf6c68e",
                    "componentId":"cac9dbf5-034c-458b-b34c-cda644807d6c"
                 }
              ]
           }
        ]
     },
     { 
        "id":"e3dc9dec-a981-4158-b3fb-cd5057e495ac",
        "name":"ZupIT/darwin-notifications",
        "gitRepositoryAddress":"https://github.com/ZupIT/darwin-notifications",
        "gitConfigurationId":"052789e8-bbab-4c93-9f88-b4bdd8899028",
        "registryConfigurationId":"9f2228b8-a58f-4fe3-bc87-8bbb9f7515c9",
        "cdConfigurationId":"35c6dad1-f34f-4498-bdb9-38bc19ebac38",
        "createdAt":"2019-10-24 17:34:14",
        "author":{ 
           "id":"ad3430af-f60e-4574-afa9-2cead12f695b",
           "name":"Jeias Soares",
           "email":"jeias.soares@zup.com.br",
           "photoUrl":"https://avatars1.githubusercontent.com/u/46794198?s=460&v=4"
        },
        "labels":[ 

        ],
        "components":[ 
           { 
              "id":"4d9ecfd8-d4d0-4857-8fa6-5fa2213e4a65",
              "name":"darwin-notifications",
              "contextPath":"/",
              "port":8080,
              "healthCheck":"/actuator/health",
              "createdAt":"2019-10-24 17:34:14",
              "moduleId":"e3dc9dec-a981-4158-b3fb-cd5057e495ac",
              "artifacts":[ 

              ]
           }
        ]
     }
  ],
  "page":0,
  "size":20,
  "totalPages":1,
  "last":true
}

module.exports = {
  modules,
}