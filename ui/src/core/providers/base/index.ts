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

import defaultsDeep from 'lodash/defaultsDeep';
import isString from 'lodash/isString';
import isUndefined from 'lodash/isUndefined';
import { getAccessToken, checkStatus } from 'core/utils/auth';
import { getWorkspaceId } from 'core/utils/workspace';
import { getCircleId } from 'core/utils/circle';

export const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json'
};

export const buildHeaders = (isFormData = false) => ({
  Authorization: `Bearer ${getAccessToken()}`,
  'x-workspace-id': getWorkspaceId(),
  'x-circle-id': getCircleId(),
  ...(!isFormData && { 'Content-Type': 'application/json' })
});

export interface EnvVariables {
  REACT_APP_API_URI: string;
  REACT_APP_AUTH_URI: string;
  REACT_APP_AUTH_CLIENT_ID: string;
  REACT_APP_AUTH_REALM: string;
  REACT_APP_WORKSPACE_ID: string;
}

type GlobalApexCharts = {
  exec: Function;
};

declare global {
  interface Window {
    CHARLESCD_ENVIRONMENT: EnvVariables;
    ApexCharts: GlobalApexCharts;
  }
}

export const basePath =
  window.CHARLESCD_ENVIRONMENT?.REACT_APP_API_URI || '/api';
export const authPath = window.CHARLESCD_ENVIRONMENT?.REACT_APP_AUTH_URI;

export const authRequest = (
  url: string,
  body: object | string | undefined = undefined,
  options?: RequestInit
): ((options: RequestInit) => Promise<Response>) => {
  const defaultOptions = {
    body: isString(body) ? body : JSON.stringify(body)
  };
  const mergedOptions = defaultsDeep(options, defaultOptions);

  return (options?: RequestInit) =>
    fetch(`${authPath}${url}`, defaultsDeep(mergedOptions, options)).then(
      (response: Response) => {
        if (!response.ok) {
          return Promise.reject(response);
        } else {
          return response;
        }
      }
    );
};

export const unauthenticatedRequest = (
  url: string,
  body: object | string | undefined = undefined,
  options?: RequestInit
): ((options: RequestInit) => Promise<Response>) => {
  const defaultOptions = {
    headers,
    body: isString(body) ? body : JSON.stringify(body)
  };
  const mergedOptions = defaultsDeep(options, defaultOptions);

  return (options?: RequestInit) =>
    fetch(`${basePath}${url}`, defaultsDeep(mergedOptions, options)).then(
      (response: Response) => {
        if (!response.ok) {
          return Promise.reject(response);
        } else {
          return response;
        }
      }
    );
};

const buildBody = (
  body: object | string | undefined = undefined,
  isFormData: boolean
) => {
  return isString(body) || isFormData ? body : JSON.stringify(body);
};

export const baseRequest = (
  url: string,
  body: object | string | undefined = undefined,
  options?: RequestInit
): ((options: RequestInit) => Promise<Response>) => {
  const isFormData = body instanceof FormData;
  const defaultOptions = {
    headers: buildHeaders(isFormData),
    body: buildBody(body, isFormData)
  };
  const mergedOptions = defaultsDeep(options, defaultOptions);

  return (options?: RequestInit) =>
    fetch(`${basePath}${url}`, defaultsDeep(mergedOptions, options)).then(
      (response: Response) => {
        if (!response.ok) {
          checkStatus(response.status);
          return Promise.reject(response);
        } else {
          return response;
        }
      }
    );
};

export const postRequest = (
  url: string,
  body: object | string | undefined = undefined
): ((options: RequestInit) => Promise<Response>) => {
  return baseRequest(url, body, {
    method: 'POST'
  });
};

export const putRequest = (
  url: string,
  body: object | string | undefined = undefined
): ((options: RequestInit) => Promise<Response>) => {
  return baseRequest(url, body, {
    method: 'PUT'
  });
};

export const deleteRequest = (
  url: string
): ((options: RequestInit) => Promise<Response>) => {
  return baseRequest(url, null, {
    method: 'DELETE'
  });
};

export const patchRequest = (
  url: string,
  opType: string,
  path: string,
  value?: string
): ((options: RequestInit) => Promise<Response>) => {
  const patches = isUndefined(value)
    ? [{ op: opType, path }]
    : [{ op: opType, path, value }];
  return baseRequest(url, { patches }, { method: 'PATCH' });
};
