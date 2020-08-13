{
	"info": {
		"_postman_id": "339facba-c05a-46ed-9fdf-90dbf4cbe6f2",
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
								"id": "f5fe39b6-04d9-48ca-811c-d35cfb392ce5",
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
								"id": "96b841b6-457f-4778-b536-5cf46fe71c43",
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
										"id": "f39e558c-4707-4918-9b51-bf8f4c283137",
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
									"raw": "{\n    \"dataSourceId\": \"{{datasourceId}}\",\n    \"metricGroupId\": \"{{metricsGroupsId}}\",\n    \"metric\": \"metric 213\",\n    \"filters\": [\n        {\n            \"field\": \"destination\",\n            \"value\": \"moove\",\n            \"operator\": \"EQUAL\"\n        }\n    ],\n    \"groupBy\": [\n        {\n            \"field\": \"app\"\n        }\n    ],\n    \"condition\": \"EQUAL\",\n    \"threshold\": 30.0\n}",
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
										"id": "1364f502-aeb8-44b4-a1b6-8638d1bde638",
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
						},
						{
							"name": "delete metric",
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
								}
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
								"id": "2dec2709-f7bf-4156-ace8-cfdcdc650517",
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
							"raw": "{\n    \"name\": \"Metricas de teste2\",\n    \"metrics\": [\n        {\n            \"dataSourceId\": \"{{datasourceId}}\",\n            \"metric\": \"istio_charles_request_total\",\n            \"query\": \"\",\n            \"filters\": [\n                {\n                    \"field\": \"circle_id\",\n                    \"value\": \"5c7979b7-51fd-4c16-8f2e-2c5d93651ed1\",\n                    \"operator\": \"=\"\n                },\n                {\n                    \"field\": \"circle_source\",\n                    \"value\": \"f5d23a57-5607-4306-9993-477e1598cc2a\",\n                    \"operator\": \"=\"\n                }\n            ],\n            \"groupBy\": [\n                {\n                    \"field\": \"app\"\n                }\n            ],\n            \"condition\": \"EQUAL\",\n            \"threshold\": 30.0\n        }\n    ],\n    \"circleId\": \"{{circleId}}\"\n}",
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
								"id": "feb2e963-bc2e-4e25-bb17-a96a802d1d85",
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