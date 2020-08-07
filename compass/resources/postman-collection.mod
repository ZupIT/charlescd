{
	"info": {
		"_postman_id": "4c1527e0-c7be-4723-bbdb-03fc7893d5d1",
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
							"raw": "{{host}}/v1/datasource",
							"host": [
								"{{host}}"
							],
							"path": [
								"v1",
								"datasource"
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
								"id": "1fb77547-3602-4315-8897-b13bc42fe697",
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
							"raw": "{{host}}/v1/datasource",
							"host": [
								"{{host}}"
							],
							"path": [
								"v1",
								"datasource"
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
							"raw": "{{host}}/v1/datasource/{{datasourceId}}/metrics",
							"host": [
								"{{host}}"
							],
							"path": [
								"v1",
								"datasource",
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
								"id": "209529d3-e04c-469a-8924-a89948522874",
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
		}
	],
	"protocolProfileBehavior": {}
}