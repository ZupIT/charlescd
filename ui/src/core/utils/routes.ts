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

import {
  useHistory,
  useLocation,
  useParams,
  useRouteMatch
} from 'react-router-dom';
import forEach from 'lodash/forEach';
import replace from 'lodash/replace';
import toString from 'lodash/toString';
import routes from 'core/constants/routes';

const replaceRoute = (
  path: string,
  pathParams: string[],
  params: (string | number)[]
) => {
  let newPath = path;

  forEach(params, (param, index) => {
    newPath = replace(newPath, pathParams[index], toString(params[index]));
  });

  return newPath;
};

const getPath = (path = '', params: (string | number)[] = []): string => {
  const pathParams = path.match(/:+\w*/gi);

  if (pathParams === null) {
    return path;
  }

  if (pathParams.length !== params.length) {
    return path;
  }

  return replaceRoute(path, pathParams, params);
};

const useRouter = () => {
  const navigate = useHistory();

  return {
    push: (path: string, ...args: (string | number)[]) =>
      navigate.push(getPath(path, args)),
    goBack: () => navigate.goBack(),
    replace: (path: string, ...args: (string | number)[]) =>
      navigate.replace(getPath(path, args)),
    go: (index: number) => navigate.go(index)
  };
};

const goTo = (path: string) => {
  window.open(path, '_blank');
};

const redirectToLegacy = (path: string) => {
  const { location } = window;
  const { href } = location;

  if (path === routes.login) {
    location.href = `${path}?redirectTo=${href}`;
  } else {
    location.href = path;
  }
};

export {
  useRouter,
  useLocation,
  useParams,
  useRouteMatch,
  redirectToLegacy,
  getPath,
  replaceRoute,
  goTo
};
