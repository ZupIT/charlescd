{
	"info": {
		"_postman_id": "f6c9b76c-2e54-4162-a2e7-1e3abcbd2116",
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
								"id": "653ece8e-13e5-49a0-9b8f-edb7f8fbb102",
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
								"id": "1f0cdc21-df67-440c-bfe8-5a8d39cced16",
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
										"id": "e10462e2-429f-4910-ba9c-151c87a503c5",
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
										"key": "",
										"type": "text",
										"value": "",
										"disabled": true
									}
								],
								"body": {
									"mode": "raw",
									"raw": "{\n    \"dataSourceId\": \"{{datasourceId}}\",\n    \"metricGroupId\": \"{{metricsGroupsId}}\",\n    \"name\": \"metric 213\",\n    \"filters\": [\n        {\n            \"field\": \"destination\",\n            \"value\": \"moove\",\n            \"operator\": \"EQUAL\"\n        }\n    ],\n    \"groupBy\": [\n        {\n            \"field\": \"app\"\n        }\n    ],\n    \"condition\": \"EQUAL\",\n    \"threshold\": 30.0\n}",
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
										"id": "1b5912fc-aa3b-4d5e-bc0a-4a67be5d866d",
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
										"key": "",
										"type": "text",
										"value": "",
										"disabled": true
									}
								],
								"body": {
									"mode": "raw",
									"raw": "{\n    \"name\": \"metric 2134das\"\n}",
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
								"id": "f05b078e-051d-4749-9679-528244666ff1",
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
								"key": "",
								"value": "",
								"type": "text",
								"disabled": true
							}
						],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"name\": \"Metricas de teste2\",\n    \"metrics\": [\n        {\n            \"dataSourceId\": \"{{datasourceId}}\",\n            \"metric\": \"group_metric_example_2\",\n            \"query\": \"\",\n            \"filters\": [\n                {\n                    \"field\": \"label1\",\n                    \"value\": \"test 999\",\n                    \"operator\": \"=\"\n                }\n            ],\n            \"groupBy\": [\n                {\n                    \"field\": \"app\"\n                }\n            ],\n            \"condition\": \"EQUAL\",\n            \"threshold\": 30.0\n        }\n    ],\n    \"circleId\": \"{{circleId}}\"\n}",
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
					"name": "update",
					"event": [
						{
							"listen": "test",
							"script": {
								"id": "0d509ad4-0c44-4aa6-bfb4-3e40b82794e2",
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
								"key": "",
								"type": "text",
								"value": "",
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
					"name": "find all",
					"request": {
						"method": "GET",
						"header": [
							{
								"key": "x-workspace-id",
								"value": "{{workspaceId}}",
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
					"name": "resume",
					"request": {
						"method": "GET",
						"header": [
							{
								"key": "x-workspace-id",
								"type": "text",
								"value": "{{workspaceId}}"
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
							}
						],
						"url": {
							"raw": "{{host}}/v1/metrics-groups/{{metricsGroupsId}}/query",
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
				}
			],
			"protocolProfileBehavior": {}
		}
	],
	"protocolProfileBehavior": {}
}