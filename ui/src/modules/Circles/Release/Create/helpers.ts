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

import { Module } from 'modules/Modules/interfaces/Module';
import { Module as IModule } from '../interfaces/Module';
import { Tag } from '../interfaces/Tag';
import map from 'lodash/map';
import find from 'lodash/find';
import forEach from 'lodash/forEach';
import findLastIndex from 'lodash/findLastIndex';
import groupBy from 'lodash/groupBy';
import includes from 'lodash/includes';
import isEmpty from 'lodash/isEmpty';

const MAX_LENGTH = 63;

export const formatModuleOptions = (module: Module[]) => {
  return map(module, content => ({
    label: content.name,
    value: content.id
  }));
};

export const formatComponentOptions = (
  modules: Module[],
  componentId: string
) => {
  const module = find(modules, ({ id }) => id === componentId);
  return map(module?.components, ({ id, name }) => ({
    value: id,
    label: name
  }));
};

export const formatTagOptions = (tags: Tag[]) => {
  return map(tags, ({ name, artifact }) => ({
    value: artifact,
    label: name
  }));
};

interface Error {
  [key: string]: {
    type: string;
    message: string;
  };
}
export const checkIfComponentConflict = (modules: IModule[]) => {
  const matchedList: number[] = [];
  const error: Error = {};
  const NOT_FOUND = -1;

  forEach(modules, (module, index: number) => {
    if (!includes(matchedList, index)) {
      const componentIndex = findLastIndex(
        modules,
        ({ component }) => component === module.component
      );

      if (componentIndex !== NOT_FOUND && componentIndex !== index) {
        error[`modules[${index}].component`] = {
          type: `conflict with ${componentIndex}`,
          message: 'Component conflict'
        };
        error[`modules[${componentIndex}].component`] = {
          type: `conflict with ${index}`,
          message: 'Component conflict'
        };
      }
    }
  });

  return error;
};

export const validationResolver = ({ modules }: { modules: IModule[] }) => {
  const error = checkIfComponentConflict(modules);

  return {
    values: {},
    errors: error
  };
};

const getVersion = (str: string) => {
  const [, version] = str.split(':');
  return version;
};

export const formatDataModules = ({ modules }: { modules: IModule[] }) => {
  const groupedModules = groupBy(modules, 'module');
  return map(groupedModules, modules => {
    const [module] = modules;
    const components = map(modules, module => ({
      id: module.component,
      version: getVersion(module.tag),
      artifact: module.tag
    }));

    return {
      id: module?.module,
      components
    };
  });
};

export const validFields = (fields: object) => {
  let status = true;
  forEach(fields, (value: string | IModule[]) => {
    if (isEmpty(value)) {
      status = false;
    }

    if (Array.isArray(value)) {
      status = !value.some(valueItem => !valueItem.tag);
    }
  });

  return status;
};

interface Props {
  tag?: Tag;
  onError?: (error: boolean) => void;
  setIsError?: (error: boolean) => void;
}

export const checkComponentAndVersionMaxLength = ({tag, onError, setIsError} : Props) => {
  const componentAndVersion = tag?.artifact.split('/');
  const componentAndVersionSplited = componentAndVersion[1].split(':');
  const componentNameLen = componentAndVersionSplited[0].length;
  const versionNameLen = componentAndVersionSplited[1].length;

  if((componentNameLen + versionNameLen) > MAX_LENGTH) {
    onError(true);
    setIsError(true);
  } else {
    onError(false);
    setIsError(false);
  }
};