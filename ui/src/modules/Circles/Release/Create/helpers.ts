/*
 * Copyright 2020, 2021 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
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
import {
  Module as ModuleProps,
  ModuleForm,
  SearchModuleForm,
} from '../interfaces/Module';
import { Tag } from '../interfaces/Tag';
import map from 'lodash/map';
import find from 'lodash/find';
import forEach from 'lodash/forEach';
import findLastIndex from 'lodash/findLastIndex';
import groupBy from 'lodash/groupBy';
import includes from 'lodash/includes';
import isEmpty from 'lodash/isEmpty';
import { Metadata } from '../Metadata/interfaces';

const MAX_LENGTH = 3;

export const formatModuleOptions = (module: Module[]) => {
  return map(module, (content) => ({
    label: content.name,
    value: content.id,
  }));
};

export const formatComponentOptions = (
  modules: Module[],
  componentId: string
) => {
  const module = find(modules, ({ id }) => id === componentId);
  return map(module?.components, ({ id, name }) => ({
    value: id,
    label: name,
  }));
};

export const formatTagOptions = (tags: Tag[]) => {
  return map(tags, ({ name, artifact }) => ({
    value: artifact,
    label: name,
  }));
};

const checkComponentVersionSize = (module: ModuleProps) => {
  const [image] = module?.tag?.split('/')?.reverse() || [''];

  return image.length - 1 > MAX_LENGTH;
};

interface Error {
  [key: string]: {
    type: string;
    message: string;
  };
}
export const checkIfComponentConflict = (modules: ModuleProps[]) => {
  const matchedList: number[] = [];
  const error: Error = {};
  const NOT_FOUND = -1;

  forEach(modules, (module, index: number) => {
    if (checkComponentVersionSize(module)) {
      error[`modules[${index}].component`] = {
        type: `Component size`,
        message:
          'Sum of component name and version name cannot be greater than 63 characters.',
      };
    }

    if (!includes(matchedList, index)) {
      const componentIndex = findLastIndex(
        modules,
        ({ component }) => component === module.component
      );

      if (componentIndex !== NOT_FOUND && componentIndex !== index) {
        error[`modules[${index}].component`] = {
          type: `conflict with ${componentIndex}`,
          message: 'Component conflict',
        };
        error[`modules[${componentIndex}].component`] = {
          type: `conflict with ${index}`,
          message: 'Component conflict',
        };
      }
    }
  });

  return error;
};

export const checkMetadata = (metadata: Metadata) => {
  const error: Error = {};
  const metadataRegex = /^[a-zA-Z0-9]+([a-zA-Z0-9-_.]*[a-zA-Z0-9])?$/gi;

  forEach(metadata?.content, (content, index) => {
    if (isEmpty(content?.key)) {
      error[`metadata.content[${index}].key`] = {
        type: `metadata.content[${index}].key.required`,
        message: 'This field is required',
      };
    }

    if (content?.key?.length > 63) {
      error[`metadata.content[${index}].key`] = {
        type: `metadata.content[${index}].key.maxLength`,
        message: 'The maximum length of this field is 63',
      };
    }

    if (content?.value?.length > 253) {
      error[`metadata.content[${index}].value`] = {
        type: `metadata.content[${index}].value.maxLength`,
        message: 'The maximum length of this field is 253',
      };
    }

    if (!content?.key?.match(metadataRegex)) {
      error[`metadata.content[${index}].key`] = {
        type: `metadata.content[${index}].key.match`,
        message:
          'It needs to beginning and ending with an alphanumeric character (a-z or 0-9) with dashes, underscores, dots or alphanumerics between',
      };
    }

    if (!isEmpty(content?.value) && !content?.value?.match(metadataRegex)) {
      error[`metadata.content[${index}].value`] = {
        type: `metadata.content[${index}].value.match`,
        message:
          'It needs to beginning and ending with an alphanumeric character (a-z or 0-9) with dashes, underscores, dots or alphanumerics between',
      };
    }
  });

  return error;
};

export const searchResolver = ({ metadata, buildId }: SearchModuleForm) => {
  const error: Error = {};
  const errorMetadata = checkMetadata(metadata);

  if (isEmpty(buildId)) {
    error['buildId'] = {
      type: 'buildId.required',
      message: 'This field is required',
    };
  }

  return {
    values: {},
    errors: {
      ...error,
      ...errorMetadata,
    },
  };
};

export const validationResolver = ({ modules, metadata, releaseName }: ModuleForm) => {
  const error = checkIfComponentConflict(modules);
  const errorMetadata = checkMetadata(metadata);

  if (isEmpty(releaseName)) {
    error['releaseName'] = {
      type: `releaseName.required`,
      message: 'This field is required'
    }
  }

  return {
    values: {},
    errors: {
      ...error,
      ...errorMetadata,
    },
  };
};

const getVersion = (str: string) => {
  const [, version] = str.split(':');
  return version;
};

export const formatDataModules = ({ modules }: { modules: ModuleProps[] }) => {
  const groupedModules = groupBy(modules, 'module');
  return map(groupedModules, (modules) => {
    const [module] = modules;
    const components = map(modules, (module) => ({
      id: module.component,
      version: getVersion(module.tag),
      artifact: module.tag,
    }));

    return {
      id: module?.module,
      components,
    };
  });
};

export const validFields = (fields: object) => {
  let status = true;
  forEach(fields, (value: string | ModuleProps[]) => {
    if (isEmpty(value)) {
      status = false;
    }

    if (Array.isArray(value)) {
      status = !value.some((valueItem) => !valueItem.tag);
    }
  });

  return status;
};

interface Props {
  tag?: Tag;
  onError?: (error: boolean) => void;
  setIsError?: (error: boolean) => void;
}

export const checkComponentAndVersionMaxLength = ({
  tag,
  onError,
  setIsError,
}: Props) => {
  const componentAndVersion = tag?.artifact.split('/');
  const componentAndVersionSplited = componentAndVersion[1].split(':');
  const componentNameLen = componentAndVersionSplited[0].length;
  const versionNameLen = componentAndVersionSplited[1].length;

  if (componentNameLen + versionNameLen > MAX_LENGTH) {
    onError(true);
    setIsError(true);
  } else {
    onError(false);
    setIsError(false);
  }
};
