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

export interface Credentials {
  address: string;
  accessToken: string;
  serviceProvider: string;
}

export interface Author {
  id?: string;
  name?: string;
  email?: string;
  photoUrl?: string;
  createdAt?: string;
}

export interface Role {
  id?: string;
  name?: string;
  value?: string;
  description?: string;
  createdAt?: string;
}

export interface UserGroup {
  id?: string;
  name?: string;
  author?: Author;
  roleId?: string;
  createdAt?: string;
}

export interface GroupRoles {
  userGroupId: string;
  roleId?: string;
}

export interface PostResponse {
  id: string;
  name: string;
}
