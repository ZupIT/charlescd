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

export interface Token {
  id: string,
  name: string,
  permissions: string[],
  workspaces: string[],
  allWorkspaces?: boolean,
  token?: string,
  author: string,
  revoked?: boolean,
  created_at?: string,
  revoked_at?: string,
  last_used_at?: string,
};

export type TokenCreate = {
  name: string,
  permissions: string[],
  workspaces: string[],
  allWorkspaces: boolean,
  subjects?: { [k: string]: boolean }
}