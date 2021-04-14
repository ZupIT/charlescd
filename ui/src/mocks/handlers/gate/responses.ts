/*
* Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

export const TOKENS_LIST = {
  "content": [
    {
      "id":"11ad9dbf-e114-4868-a138-4dfa94745495",
      "name":"TOKEN 1",
      "permissions":["circles_read"],
      "workspaces": "",
      "allWorkspaces":true,
      "revoked":false,
      "created_at":"2021-04-13T17:21:06.65322Z",
      "revoked_at": "",
      "last_used_at": "",
      "author":"rootqa@root"
    },
    {
      "id":"abd6efc4-3b98-4049-8bdb-e8919c3d09f4",
      "name":"TOKEN 2",
      "permissions":[
        "maintenance_write",
        "deploy_write",
        "circles_read",
        "circles_write",
        "modules_read"
      ],
      "workspaces":null,
      "allWorkspaces":true,
      "revoked":false,
      "created_at":"2021-04-12T23:02:39.304307Z",
      "revoked_at":null,
      "last_used_at":null,
      "author":"charlesadmin@admin"
    }
  ],
  "page":0,
  "size":50,
  "last":true,
  "totalPages":1
}; 

export const TOKEN = {
  "id":"abd6efc4-3b98-4049-8bdb-e8919c3d09f4",
  "name":"TOKEN 2",
  "permissions":[
    "maintenance_write",
    "deploy_write",
    "circles_read",
    "circles_write",
    "modules_read"
  ],
  "workspaces": "",
  "allWorkspaces": true,
  "revoked": false,
  "created_at": "2021-04-12T23:02:39.304307Z",
  "revoked_at": "",
  "last_used_at": "",
  "author":"charlesadmin@admin"
};

export const TOKEN_CREATE = {
  ...TOKEN,
  "token": "afefef72305d48a8a5a95f2979af9a94",
}

export const TOKEN_REGENERATE = {
  "token":"88a3de885b9a477c9413c9953526fa41"
};
