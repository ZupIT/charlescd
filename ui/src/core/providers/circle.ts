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

import { baseRequest, postRequest } from './base';
import { ParameterPayload } from 'modules/Circles/Matcher/interfaces';
import {
  CreateCircleWithFilePayload,
  CreateCircleManuallyPayload,
  CreateCirclePercentagePayload
} from 'modules/Circles/interfaces/Circle';
import { DEFAULT_PAGE_SIZE } from 'core/constants/request';

export const endpoint = '/moove/v2/circles';

export interface CircleFilter {
  id?: string;
  name?: string;
  active?: boolean;
  page?: number;
}

const initialCircleFilter = {
  name: '',
  active: true,
  page: 0
};

export const findAllCircles = (filter: CircleFilter = initialCircleFilter) => {
  const params = new URLSearchParams({
    active: `${filter?.active}`,
    size: `${DEFAULT_PAGE_SIZE}`,
    name: filter?.name,
    page: `${filter.page ?? 0}`
  });

  return baseRequest(`${endpoint}?${params}`);
};

export const findPercentageCircles = (
  filter: CircleFilter = initialCircleFilter
) => {
  const sizeFixed = 200;
  const params = new URLSearchParams({
    active: `${filter?.active}`,
    size: `${sizeFixed}`,
    name: filter?.name
  });

  return baseRequest(`${endpoint}/percentage?${params}`);
};

export const findComponents = (id: string) =>
  baseRequest(`${endpoint}/${id}/components`);

export const findCircleById = (filter: CircleFilter) =>
  baseRequest(`${endpoint}/${filter?.id}`);

export const deleteCircleById = (id: string) =>
  baseRequest(`${endpoint}/${id}`, null, { method: 'DELETE' });

export const circleMatcherIdentify = (data: ParameterPayload) =>
  postRequest(`${endpoint}/identify`, data);

export const createCircleManually = (data: CreateCircleManuallyPayload) =>
  baseRequest(`${endpoint}`, data, { method: 'POST' });

export const createCirclePercentage = (data: CreateCirclePercentagePayload) =>
  baseRequest(`${endpoint}/percentage`, data, { method: 'POST' });

export const updateCirclePercentage = (
  data: CreateCirclePercentagePayload,
  id: string
) => {
  const payload = {
    patches: [
      {
        op: 'replace',
        path: '/percentage',
        value: data.percentage
      },
      {
        op: 'replace',
        path: '/name',
        value: data.name
      }
    ]
  };
  return baseRequest(`${endpoint}/${id}/percentage`, payload, {
    method: 'PATCH'
  });
};

export const updateCircleManually = (
  data: CreateCircleManuallyPayload,
  circleId: string
) => {
  const payload = {
    patches: [
      {
        op: 'replace',
        path: '/rules',
        value: data.rules
      },
      {
        op: 'replace',
        path: '/name',
        value: data.name
      }
    ]
  };

  return baseRequest(`${endpoint}/${circleId}`, payload, { method: 'PATCH' });
};

export const createCircleWithFile = (data: CreateCircleWithFilePayload) =>
  baseRequest(`${endpoint}/csv`, data, { method: 'POST' });

export const updateCircleWithFile = (
  data: CreateCircleWithFilePayload,
  circleId: string
) => baseRequest(`${endpoint}/${circleId}/csv`, data, { method: 'PUT' });

export const findAllCirclesWithoutActive = (
  filter: CircleFilter = initialCircleFilter
) => {
  const params = new URLSearchParams({
    size: `${DEFAULT_PAGE_SIZE}`,
    name: filter?.name
  });

  return baseRequest(`${endpoint}?${params}`);
};
