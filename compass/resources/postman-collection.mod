{
	"info": {
		"_postman_id": "7bb710d6-0512-4b3b-afd0-664647cc0bbe",
		"name": "Compass",
		"schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
	},
	"item": [
		{
			"name": "datasources",
			"item": [
				{
					"name": "find all",
					"request": {
						"method": "GET",
						"header": [
							{
								"key": "x-workspace-id",
								"value": "{{workspaceId}}",
								"type": "text"
							},
							{
								"key": "x-circle-id",
								"value": "{{circleId}}",
								"type": "text"
							}
						],
						"url": {
							"raw": "{{host}}/v1/datasources",
							"host": [
								"{{host}}"
							],
							"path": [
								"v1",
								"datasources"
							]
						}
					},
					"response": []
				},
				{
					"name": "remove",
					"request": {
						"method": "DELETE",
						"header": [
							{
								"key": "x-workspace-id",
								"type": "text",
								"value": "{{workspaceId}}"
							},
							{
								"key": "x-circle-id",
								"value": "{{circleId}}",
								"type": "text"
							}
						],
						"url": {
							"raw": "{{host}}/v1/datasources/{{datasourceId}}",
							"host": [
								"{{host}}"
							],
							"path": [
								"v1",
								"datasources",
								"{{datasourceId}}"
							]
						}
					},
					"response": []
				},
				{
					"name": "save",
					"event": [
						{
							"listen": "test",
							"script": {
								"id": "e2d8fcc3-1d4e-4997-85b9-d67458c75a89",
								"exec": [
									"const response = JSON.parse(responseBody);",
									"postman.setGlobalVariable(\"datasourceId\", response[\"id\"]);"
								],
								"type": "text/javascript"
							}
						}
					],
					"request": {
						"method": "POST",
						"header": [
							{
								"key": "x-workspace-id",
								"value": "{{workspaceId}}",
								"type": "text"
							},
							{
								"key": "x-circle-id",
								"value": "{{circleId}}",
								"type": "text"
							}
						],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"name\": \"Prometheus do maycao\",\n    \"pluginId\": \"{{pluginId}}\",\n    \"health\": true,\n    \"data\": {\n        \"url\": \"http://35.238.107.172:9090\"\n    }\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{host}}/v1/datasources",
							"host": [
								"{{host}}"
							],
							"path": [
								"v1",
								"datasources"
							]
						}
					},
					"response": []
				},
				{
					"name": "get metrics",
					"request": {
						"method": "GET",
						"header": [
							{
								"key": "x-workspace-id",
								"value": "{{workspaceId}}",
								"type": "text"
							},
							{
								"key": "x-circle-id",
								"value": "{{circleId}}",
								"type": "text"
							}
						],
						"url": {
							"raw": "{{host}}/v1/datasources/{{datasourceId}}/metrics",
							"host": [
								"{{host}}"
							],
							"path": [
								"v1",
								"datasources",
								"{{datasourceId}}",
								"metrics"
							]
						}
					},
					"response": []
				}
			],
			"protocolProfileBehavior": {}
		},
		{
			"name": "plugins",
			"item": [
				{
					"name": "save",
					"event": [
						{
							"listen": "test",
							"script": {
								"id": "25657d6e-c4fc-4a8f-8a94-0f01de12f36d",
								"exec": [
									"const response = JSON.parse(responseBody);",
									"postman.setGlobalVariable(\"pluginId\", response[\"id\"]);"
								],
								"type": "text/javascript"
							}
						}
					],
					"request": {
						"method": "POST",
						"header": [
							{
								"key": "x-workspace-id",
								"value": "{{workspaceId}}",
								"type": "text"
							},
							{
								"key": "x-circle-id",
								"value": "{{circleId}}",
								"type": "text"
							}
						],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"name\": \"Prometheus\",\n    \"src\": \"prometheus\"\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{host}}/v1/plugins",
							"host": [
								"{{host}}"
							],
							"path": [
								"v1",
								"plugins"
							]
						}
					},
					"response": []
				},
				{
					"name": "find by id",
					"request": {
						"method": "GET",
						"header": [
							{
								"key": "x-workspace-id",
								"value": "{{workspaceId}}",
								"type": "text"
							},
							{
								"key": "x-circle-id",
								"value": "{{circleId}}",
								"type": "text"
							}
						],
						"url": {
							"raw": "{{host}}/v1/plugins/{{pluginId}}",
							"host": [
								"{{host}}"
							],
							"path": [
								"v1",
								"plugins",
								"{{pluginId}}"
							]
						}
					},
					"response": []
				},
				{
					"name": "find all",
					"request": {
						"method": "GET",
						"header": [
							{
								"key": "x-workspace-id",
								"value": "{{workspaceId}}",
								"type": "text"
							},
							{
								"key": "x-circle-id",
								"value": "{{circleId}}",
								"type": "text"
							}
						],
						"url": {
							"raw": "{{host}}/v1/plugins",
							"host": [
								"{{host}}"
							],
							"path": [
								"v1",
								"plugins"
							]
						}
					},
					"response": []
				}
			],
			"protocolProfileBehavior": {}
		},
		{
			"name": "metricsgroups",
			"item": [
				{
					"name": "metrics",
					"item": [
						{
							"name": "save metric",
							"event": [
								{
									"listen": "test",
									"script": {
										"id": "3accd799-6aff-4a14-8873-c92796a4e507",
										"exec": [
											"const response = JSON.parse(responseBody);",
											"pm.environment.set(\"metricsId\", response[\"id\"]);"
										],
										"type": "text/javascript"
									}
								}
							],
							"request": {
								"method": "POST",
								"header": [
									{
										"key": "x-workspace-id",
										"type": "text",
										"value": "{{workspaceId}}"
									},
									{
										"key": "x-circle-id",
										"type": "text",
										"value": "{{circleId}}"
									}
								],
								"body": {
									"mode": "raw",
									"raw": "{\n    \"dataSourceId\": \"{{datasourceId}}\",\n    \"nickname\": \"Nickname 1\",\n    \"query\": \"\",\n    \"metric\": \"group_metric_example_2\",\n    \"filters\": [\n        {\n            \"field\": \"label1\",\n            \"value\": \"test 999\",\n            \"operator\": \"=\"\n        }\n    ],\n    \"groupBy\": [\n        {\n            \"field\": \"app\"\n        }\n    ],\n    \"condition\": \"EQUAL\",\n    \"threshold\": 30.0\n}",
									"options": {
										"raw": {
											"language": "json"
										}
									}
								},
								"url": {
									"raw": "{{host}}/v1/metrics-groups/{{metricsGroupsId}}/metrics",
									"host": [
										"{{host}}"
									],
									"path": [
										"v1",
										"metrics-groups",
										"{{metricsGroupsId}}",
										"metrics"
									],
									"query": [
										{
											"key": "providerType",
											"value": "PROMETHEUS",
											"disabled": true
										},
										{
											"key": "workspaceId",
											"value": "02ab0517-c795-4b66-b0ec-fea140b8d4e6",
											"disabled": true
										}
									]
								},
								"description": "Save metrics group"
							},
							"response": []
						},
						{
							"name": "update metric",
							"event": [
								{
									"listen": "test",
									"script": {
										"id": "afcb4302-45dc-4f8c-8d31-f8b0d091725b",
										"exec": [
											"const response = JSON.parse(responseBody);",
											"pm.environment.set(\"metricsId\", response[\"id\"]);"
										],
										"type": "text/javascript"
									}
								}
							],
							"request": {
								"method": "PATCH",
								"header": [
									{
										"key": "x-workspace-id",
										"type": "text",
										"value": "{{workspaceId}}"
									},
									{
										"key": "x-circle-id",
										"type": "text",
										"value": "{{circleId}}"
									}
								],
								"body": {
									"mode": "raw",
									"raw": "{\n    \"metric\": \"metric 2134das\"\n}",
									"options": {
										"raw": {
											"language": "json"
										}
									}
								},
								"url": {
									"raw": "{{host}}/v1/metrics-groups/{{metricsGroupsId}}/metrics/{{metricsId}}",
									"host": [
										"{{host}}"
									],
									"path": [
										"v1",
										"metrics-groups",
										"{{metricsGroupsId}}",
										"metrics",
										"{{metricsId}}"
									]
								},
								"description": "Save metrics group"
							},
							"response": []
						}
					],
					"protocolProfileBehavior": {},
					"_postman_isSubFolder": true
				},
				{
					"name": "save",
					"event": [
						{
							"listen": "test",
							"script": {
								"id": "8077c28b-771d-45f3-a378-09781c07984c",
								"exec": [
									"const response = JSON.parse(responseBody);",
									"pm.environment.set(\"metricsGroupsId\", response[\"id\"]);"
								],
								"type": "text/javascript"
							}
						}
					],
					"request": {
						"method": "POST",
						"header": [
							{
								"key": "x-workspace-id",
								"value": "{{workspaceId}}",
								"type": "text"
							},
							{
								"key": "x-circle-id",
								"value": "{{circleId}}",
								"type": "text",
								"disabled": true
							}
						],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"name\": \"Metricas de teste2\",\n    \"circleId\": \"{{circleId}}\"\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{host}}/v1/metrics-groups",
							"host": [
								"{{host}}"
							],
							"path": [
								"v1",
								"metrics-groups"
							]
						},
						"description": "Save metrics group"
					},
					"response": []
				},
				{
					"name": "update",
					"event": [
						{
							"listen": "test",
							"script": {
								"id": "ffd930f8-fd37-40ca-95e3-0d9268c9ad39",
								"exec": [
									"const response = JSON.parse(responseBody);",
									"postman.setGlobalVariable(\"metricsGroupsId\", response[\"id\"]);"
								],
								"type": "text/javascript"
							}
						}
					],
					"request": {
						"method": "PATCH",
						"header": [
							{
								"key": "x-workspace-id",
								"type": "text",
								"value": "{{workspaceId}}"
							},
							{
								"key": "x-circle-id",
								"type": "text",
								"value": "{{circleId}}",
								"disabled": true
							}
						],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"name\": \"Metricas de teste222\",\n    \"circleId\": \"{{circleId}}\",\n    \"workspaceId\": \"{{workspaceId}}\"\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{host}}/v1/metrics-groups/{{metricsGroupsId}}",
							"host": [
								"{{host}}"
							],
							"path": [
								"v1",
								"metrics-groups",
								"{{metricsGroupsId}}"
							]
						},
						"description": "Save metrics group"
					},
					"response": []
				},
				{
					"name": "find all",
					"request": {
						"method": "GET",
						"header": [
							{
								"key": "x-workspace-id",
								"value": "{{workspaceId}}",
								"type": "text"
							},
							{
								"key": "x-circle-id",
								"value": "{{circleId}}",
								"type": "text"
							}
						],
						"url": {
							"raw": "{{host}}/v1/metrics-groups",
							"host": [
								"{{host}}"
							],
							"path": [
								"v1",
								"metrics-groups"
							]
						}
					},
					"response": []
				},
				{
					"name": "find all by circle id",
					"request": {
						"method": "GET",
						"header": [
							{
								"key": "x-workspace-id",
								"type": "text",
								"value": "{{workspaceId}}"
							},
							{
								"key": "x-circle-id",
								"value": "{{circleId}}",
								"type": "text"
							}
						],
						"url": {
							"raw": "{{host}}/v1/circles/{{circleId}}/metrics-groups",
							"host": [
								"{{host}}"
							],
							"path": [
								"v1",
								"circles",
								"{{circleId}}",
								"metrics-groups"
							]
						}
					},
					"response": []
				},
				{
					"name": "resume",
					"request": {
						"method": "GET",
						"header": [
							{
								"key": "x-workspace-id",
								"type": "text",
								"value": "{{workspaceId}}"
							},
							{
								"key": "x-circle-id",
								"value": "{{circleId}}",
								"type": "text"
							}
						],
						"url": {
							"raw": "{{host}}/v1/resume/metrics-groups",
							"host": [
								"{{host}}"
							],
							"path": [
								"v1",
								"resume",
								"metrics-groups"
							]
						}
					},
					"response": []
				},
				{
					"name": "query",
					"request": {
						"method": "GET",
						"header": [
							{
								"key": "x-workspace-id",
								"type": "text",
								"value": "{{workspaceId}}"
							},
							{
								"key": "x-circle-id",
								"value": "{{circleId}}",
								"type": "text"
							}
						],
						"url": {
							"raw": "{{host}}/v1/metrics-groups/{{metricsGroupsId}}/query?period=5d",
							"host": [
								"{{host}}"
							],
							"path": [
								"v1",
								"metrics-groups",
								"{{metricsGroupsId}}",
								"query"
							],
							"query": [
								{
									"key": "period",
									"value": "1d",
									"disabled": true
								},
								{
									"key": "period",
									"value": "5d"
								}
							]
						}
					},
					"response": []
				},
				{
					"name": "result",
					"request": {
						"method": "GET",
						"header": [
							{
								"key": "x-workspace-id",
								"type": "text",
								"value": "{{workspaceId}}"
							},
							{
								"key": "x-circle-id",
								"value": "{{circleId}}",
								"type": "text"
							}
						],
						"url": {
							"raw": "{{host}}/v1/metrics-groups/{{metricsGroupsId}}/result",
							"host": [
								"{{host}}"
							],
							"path": [
								"v1",
								"metrics-groups",
								"{{metricsGroupsId}}",
								"result"
							]
						}
					},
					"response": []
				},
				{
					"name": "find by id",
					"request": {
						"method": "GET",
						"header": [
							{
								"key": "x-workspace-id",
								"type": "text",
								"value": "{{workspaceId}}"
							},
							{
								"key": "x-circle-id",
								"value": "{{circleId}}",
								"type": "text"
							}
						],
						"url": {
							"raw": "{{host}}/v1/metrics-groups/{{metricsGroupsId}}",
							"host": [
								"{{host}}"
							],
							"path": [
								"v1",
								"metrics-groups",
								"{{metricsGroupsId}}"
							]
						}
					},
					"response": []
				},
				{
					"name": "delete by id",
					"request": {
						"method": "DELETE",
						"header": [
							{
								"key": "x-workspace-id",
								"type": "text",
								"value": "{{workspaceId}}"
							}
						],
						"url": {
							"raw": "{{host}}/v1/metrics-groups/{{metricsGroupsId}}?x-circle-id={{circleId}}",
							"host": [
								"{{host}}"
							],
							"path": [
								"v1",
								"metrics-groups",
								"{{metricsGroupsId}}"
							],
							"query": [
								{
									"key": "x-circle-id",
									"value": "{{circleId}}"
								}
							]
						}
					},
					"response": []
				}
			],
			"protocolProfileBehavior": {}
		}
	],
	"protocolProfileBehavior": {}
}