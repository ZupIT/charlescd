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

import { baseRequest, putRequest, deleteRequest, postRequest } from './base';
import { Module } from 'modules/Modules/interfaces/Module';

const endpoint = '/moove/cards';

export interface Payload {
  id?: string;
  labels: string[];
  modules: Module[];
  type: 'ACTION';
  branchName: string;
  name: string;
  desription: string;
}

export const findById = (id: string) => baseRequest(`${endpoint}/${id}`);

export const addCardMembers = (
  cardId: string,
  authorId: string,
  memberIds: string[]
) => postRequest(`${endpoint}/${cardId}/members`, { authorId, memberIds });

export const archiveById = (cardId: string) =>
  baseRequest(`${endpoint}/${cardId}/archive`, null, { method: 'PATCH' });

export const updateById = (id: string, payload: Payload) =>
  putRequest(`${endpoint}/${id}`, payload);

export const deleteById = (id: string) => deleteRequest(`${endpoint}/${id}`);

export const createCard = (payload: Payload) =>
  postRequest(`${endpoint}`, payload);
