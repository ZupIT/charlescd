{
	"info": {
		"_postman_id": "2dbae7a7-6bdc-4856-b512-bacb07cdde4e",
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
								"id": "55bd0426-92f9-4af3-a077-3b853fc64403",
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
							"raw": "{\n    \"name\": \"Prometheus do maycao\",\n    \"pluginId\": \"{{pluginId}}\",\n    \"health\": true,\n    \"data\": {\n        \"url\": \"http://demo.robustperception.io:9090\"\n    }\n}",
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
								"id": "94aa997d-3ebe-4a05-ad6d-4e57506d351f",
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
										"id": "391c6de0-245e-44c7-a90a-99785c7c43de",
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
										"id": "0a18f51a-5ee8-4093-81d3-f36cd705b3d0",
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
								"id": "f99b21b3-b32e-4411-83ad-2b99c9326b13",
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
							"raw": "{\n    \"name\": \"Metricas de teste2\",\n    \"metrics\": [\n        {\n            \"dataSourceId\": \"{{datasourceId}}\",\n            \"metric\": \"metric 21\",\n            \"filters\": [\n                {\n                    \"field\": \"destination\",\n                    \"value\": \"moove\",\n                    \"operator\": \"EQUAL\"\n                }\n            ],\n            \"groupBy\": [\n                {\n                    \"field\": \"app\"\n                }\n            ],\n            \"condition\": \"EQUAL\",\n            \"threshold\": 30.0\n        }\n    ],\n    \"circleId\": \"{{circleId}}\",\n    \"workspaceId\": \"{{workspaceId}}\"\n}",
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
								"id": "ca15a74d-af77-4e2f-b16f-dd3a2ae2c56a",
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