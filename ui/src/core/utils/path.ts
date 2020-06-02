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

import { generatePath } from 'react-router';
import map from 'lodash/map';
import reverse from 'lodash/reverse';
import filter from 'lodash/filter';
import { History } from 'history';
import { portLegacyDevelopment } from 'core/utils/development';
import getQueryStrings from 'core/utils/query';
import includes from 'lodash/includes';
import { NEW_TAB } from 'core/components/TabPanel/constants';

export const generatePathV1 = (
  path: string,
  params: { [paramName: string]: string | number | boolean }
) => {
  const skipLegacyPort = {
    [portLegacyDevelopment]: `:${portLegacyDevelopment}`
  };

  return generatePath(path, { ...skipLegacyPort, ...params });
};

export const goToV2 = (path: string) => {
  window.location.href = path;
};

export const addParam = (
  paramName: string,
  route: string,
  history: History,
  param: string
) => {
  const query = getQueryStrings();
  query.append(paramName, param);

  history.push({
    pathname: route,
    search: query.toString()
  });
};

export const delParam = (
  paramName: string,
  route: string,
  history: History,
  param: string
) => {
  const query = getQueryStrings();
  const queries = query.getAll(paramName);
  const remaineds = filter(queries, q => !includes(q, param));
  const params = new URLSearchParams();

  map(remaineds, id => params.append(paramName, id));

  history.push({
    pathname: route,
    search: params.toString()
  });
};

export const updateParam = (
  paramName: string,
  route: string,
  history: History,
  oldParam: string,
  newParam: string
) => {
  const query = getQueryStrings();
  const queries = query.getAll(paramName);
  const params = new URLSearchParams();

  map(queries, param => {
    if (includes(param, oldParam)) {
      params.append(paramName, newParam);
    } else {
      params.append(paramName, param);
    }
  });

  history.push({
    pathname: route,
    search: params.toString()
  });
};

export const updateUntitledParam = (paramName: string, param: string) => {
  const query = getQueryStrings();
  const queries = query.getAll(paramName);
  const params = new URLSearchParams();
  const getParam = (p: string) => (p === NEW_TAB ? param : p);

  map(queries, q => params.append(paramName, getParam(q)));
  window.history.pushState(null, '', `?${params.toString()}`);
};

export const getAllParams = (paramName: string) => {
  const query = getQueryStrings();
  return reverse(query.getAll(paramName));
};

export const isParamExists = (paramName: string, param: string) => {
  const params = getAllParams(paramName);

  return includes(params, param);
};
