import os
import uuid

def get_samecluster_request():
   circle_id = str(uuid.uuid4())
   return {
      "appName": "darwin-content",
      "appNamespace": "octopipe-load",
      "git": {
         "provider": "GITHUB",
         "token": os.getenv("GITHUB_TOKEN")
      },
      "helmUrl": os.getenv("HELM_URL"),
      "istio": {
         "virtualService": {
            "apiVersion": "networking.istio.io/v1alpha3",
            "kind": "VirtualService",
            "metadata": {
               "name": "darwin-content",
               "namespace": "octopipe-load"
            },
            "spec": {
               "hosts": [
                  "darwin-content"
               ],
               "http": [
                  {
                     "match": [
                        {
                           "headers": {
                              "cookie": {
                                 "regex": ".*x-circle-id={}.*".format(circle_id)
                              }
                           }
                        }
                     ],
                     "route": [
                        {
                           "destination": {
                              "host": "darwin-content",
                              "subset": "darwin-acarditi"
                           },
                           "headers": {
                              "request": {
                                 "set": {
                                    "x-circle-source": circle_id
                                 }
                              }
                           }
                        }
                     ]
                  },
                  {
                     "match": [
                        {
                           "headers": {
                              "x-circle-id": {
                                 "exact": circle_id
                              }
                           }
                        }
                     ],
                     "route": [
                        {
                           "destination": {
                              "host": "darwin-content",
                              "subset": "darwin-acarditi"
                           },
                           "headers": {
                              "request": {
                                 "set": {
                                    "x-circle-source": circle_id
                                 }
                              }
                           }
                        }
                     ]
                  },
                  {
                     "route": [
                        {
                           "destination": {
                              "host": "darwin-content",
                              "subset": "darwin-acarditi"
                           },
                           "headers": {
                              "request": {
                                 "set": {
                                    "x-circle-source": circle_id
                                 }
                              }
                           }
                        }
                     ]
                  }
               ]
            }
         },
         "destinationRules": {
            "apiVersion": "networking.istio.io/v1alpha3",
            "kind": "DestinationRule",
            "metadata": {
               "name": "darwin-content",
               "namespace": "octopipe-load"
            },
            "spec":{
               "host": "darwin-content",
               "subsets": [
                  {
                     "labels": {
                        "version": "darwin-content-darwin-acarditi"
                     },
                     "name": "darwin-acarditi"
                  }
               ]
            }
         }
      },
      "unusedVersions": [
   
      ],
      "versions": [
         {
            "version": "darwin-content-darwin-acarditi",
            "versionUrl": "realwavelab.azurecr.io/darwin-content:darwin-acarditi"
         }
      ],
      "webHookUrl": os.getenv("BUTLER_WEBHOOK_URL"),
      "circleId": circle_id
   }