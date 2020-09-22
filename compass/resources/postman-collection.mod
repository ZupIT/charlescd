{
	"info": {
		"_postman_id": "7e20079b-e69e-4cc8-b70a-7a9017a7f12c",
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
								"id": "c401b0f6-2c6d-4ab0-a89f-8cd6affea644",
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
							"raw": "{\n    \"name\": \"Prometheus do maycao\",\n    \"pluginSrc\": \"{{pluginSrc}}\",\n    \"healthy\": true,\n    \"data\": {\n        \"url\": \"http://35.238.107.172:9090\"\n    }\n}",
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
								"id": "7c9878a7-7030-49f0-a9b9-2d6f2e07573f",
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
										"id": "9cdf9732-aa49-4d7a-a282-033f01a2df55",
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
										"id": "b53fc63a-bda0-4d38-971a-a1239d82373a",
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
								"id": "19840d11-f10c-470c-8620-0333f6c15ca0",
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
								"id": "f367d65a-63d8-4ea7-bd64-96dfa4041a66",
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
		},
		{
			"name": "actions",
			"item": [
				{
					"name": "metricsgroupactions",
					"item": [
						{
							"name": "save",
							"event": [
								{
									"listen": "test",
									"script": {
										"id": "47ead285-daff-4e24-8f58-9bfed77c6a12",
										"exec": [
											"const response = JSON.parse(responseBody);",
											"postman.setGlobalVariable(\"actionExecutionId\", response[\"id\"]);"
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
									"raw": "{\n    \"nickname\": \"ExecutionName\",\n    \"metricsGroupId\": \"{{metricsGroupsId}}\",\n    \"actionsId\": \"{{actionId}}\",\n    \"executionParameters\": {\n        \"circleId\": \"123456789\"\n    }\n}",
									"options": {
										"raw": {
											"language": "json"
										}
									}
								},
								"url": {
									"raw": "{{host}}/v1/actions-execution",
									"host": [
										"{{host}}"
									],
									"path": [
										"v1",
										"actions-execution"
									]
								}
							},
							"response": []
						},
						{
							"name": "update",
							"event": [
								{
									"listen": "test",
									"script": {
										"id": "61b62b78-e117-4152-a274-38fef7ffba13",
										"exec": [
											"const response = JSON.parse(responseBody);",
											""
										],
										"type": "text/javascript"
									}
								}
							],
							"request": {
								"method": "PUT",
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
									"raw": "{\n    \"nickname\": \"ExecutionName\",\n    \"metricsGroupId\": \"{{metricsGroupsId}}\",\n    \"actionsId\": \"{{actionId}}\",\n    \"executionParameters\": {\n        \"circleId\": \"1234567891234567890\"\n    }\n}",
									"options": {
										"raw": {
											"language": "json"
										}
									}
								},
								"url": {
									"raw": "{{host}}/v1/actions-execution/{{actionExecutionId}}",
									"host": [
										"{{host}}"
									],
									"path": [
										"v1",
										"actions-execution",
										"{{actionExecutionId}}"
									]
								}
							},
							"response": []
						},
						{
							"name": "find all",
							"event": [
								{
									"listen": "test",
									"script": {
										"id": "c4ee368a-ee00-4d7b-ba30-0fe4f4aa90b6",
										"exec": [
											"const response = JSON.parse(responseBody);",
											"postman.setGlobalVariable(\"actionId\", response[\"id\"]);"
										],
										"type": "text/javascript"
									}
								}
							],
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
										"type": "text",
										"value": "{{circleId}}"
									}
								],
								"url": {
									"raw": "{{host}}/v1/actions-execution",
									"host": [
										"{{host}}"
									],
									"path": [
										"v1",
										"actions-execution"
									]
								}
							},
							"response": []
						},
						{
							"name": "find by id",
							"event": [
								{
									"listen": "test",
									"script": {
										"id": "cf244023-e975-4da7-8c92-6dc3508e5716",
										"exec": [
											"const response = JSON.parse(responseBody);",
											"postman.setGlobalVariable(\"actionId\", response[\"id\"]);"
										],
										"type": "text/javascript"
									}
								}
							],
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
										"type": "text",
										"value": "{{circleId}}"
									}
								],
								"url": {
									"raw": "{{host}}/v1/actions-execution/{{actionExecutionId}}",
									"host": [
										"{{host}}"
									],
									"path": [
										"v1",
										"actions-execution",
										"{{actionExecutionId}}"
									]
								}
							},
							"response": []
						},
						{
							"name": "delete",
							"event": [
								{
									"listen": "test",
									"script": {
										"id": "63667d56-f9cb-49ef-af5c-244aa9ef8588",
										"exec": [
											"const response = JSON.parse(responseBody);",
											""
										],
										"type": "text/javascript"
									}
								}
							],
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
										"type": "text",
										"value": "{{circleId}}"
									}
								],
								"url": {
									"raw": "{{host}}/v1/actions-execution/{{actionExecutionId}}",
									"host": [
										"{{host}}"
									],
									"path": [
										"v1",
										"actions-execution",
										"{{actionExecutionId}}"
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
								"id": "b0bc36de-bf7c-4c46-b7c0-4563862baea7",
								"exec": [
									"const response = JSON.parse(responseBody);",
									"postman.setGlobalVariable(\"actionId\", response[\"id\"]);"
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
							"raw": "{\n    \"nickname\": \"Open-sea up\",\n    \"type\": \"CircleUpstream\",\n    \"configuration\": {\n        \"authorId\": \"123456789\",\n        \"destinyCircle\": \"open-sea\"\n    },\n    \"workspaceId\": \"5b17f1ec-41ab-472a-b307-f0495e480a1c\"\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{host}}/v1/actions",
							"host": [
								"{{host}}"
							],
							"path": [
								"v1",
								"actions"
							]
						}
					},
					"response": []
				},
				{
					"name": "update",
					"event": [
						{
							"listen": "test",
							"script": {
								"id": "b7988dd8-169e-47df-b9e7-b6fca2db4d9e",
								"exec": [
									"const response = JSON.parse(responseBody);",
									""
								],
								"type": "text/javascript"
							}
						}
					],
					"request": {
						"method": "PUT",
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
							"raw": "{\n    \"nickname\": \"Open-sea up\",\n    \"type\": \"CircleUpstream\",\n    \"configuration\": {\n        \"authorId\": \"123456789\",\n        \"destinyCircle\": \"open-ronaldo\"\n    },\n    \"workspaceId\": \"5b17f1ec-41ab-472a-b307-f0495e480a1c\"\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{host}}/v1/actions/{{actionId}}",
							"host": [
								"{{host}}"
							],
							"path": [
								"v1",
								"actions",
								"{{actionId}}"
							]
						}
					},
					"response": []
				},
				{
					"name": "find all",
					"event": [
						{
							"listen": "test",
							"script": {
								"id": "e9ecbdd1-ad7d-46d5-a377-12cf204aed66",
								"exec": [
									"const response = JSON.parse(responseBody);",
									""
								],
								"type": "text/javascript"
							}
						}
					],
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
								"type": "text",
								"value": "{{circleId}}"
							}
						],
						"url": {
							"raw": "{{host}}/v1/actions",
							"host": [
								"{{host}}"
							],
							"path": [
								"v1",
								"actions"
							]
						}
					},
					"response": []
				},
				{
					"name": "find by id",
					"event": [
						{
							"listen": "test",
							"script": {
								"id": "27c8206c-d0f0-45e1-818e-3d6ea3dbd71e",
								"exec": [
									"const response = JSON.parse(responseBody);"
								],
								"type": "text/javascript"
							}
						}
					],
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
								"type": "text",
								"value": "{{circleId}}"
							}
						],
						"url": {
							"raw": "{{host}}/v1/actions/{{actionId}}",
							"host": [
								"{{host}}"
							],
							"path": [
								"v1",
								"actions",
								"{{actionId}}"
							]
						}
					},
					"response": []
				},
				{
					"name": "delete",
					"event": [
						{
							"listen": "test",
							"script": {
								"id": "d401faec-850b-4f72-8609-cfe3104e7987",
								"exec": [
									"const response = JSON.parse(responseBody);",
									""
								],
								"type": "text/javascript"
							}
						}
					],
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
								"type": "text",
								"value": "{{circleId}}"
							}
						],
						"url": {
							"raw": "{{host}}/v1/actions/{{actionId}}",
							"host": [
								"{{host}}"
							],
							"path": [
								"v1",
								"actions",
								"{{actionId}}"
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