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

import { isNotBlank, isRequired, trimValue } from 'core/utils/validations';
import forEach from 'lodash/forEach';
import { Helm } from 'modules/Modules/interfaces/Helm';
import {
  DEFAULT_BRANCH,
  githubProvider,
  gitlabProvider
} from 'modules/Settings/Credentials/Sections/DeploymentConfiguration/constants';
import { GitProviders } from 'modules/Settings/Credentials/Sections/DeploymentConfiguration/interfaces';

type SetValue = (name: keyof Helm, value: unknown, config?: Partial<{
  shouldValidate: boolean;
  shouldDirty: boolean;
}>) => void;

export const validFields = (fields: object) => {
  let status = true;
  forEach(fields, (value: string) => {
    if (value === '') {
      status = false;

      return status;
    }
  });
  return status;
};

const createGithubApi = ({
  helmUrl,
  helmOrganization,
  helmRepository,
  helmPath,
  helmBranch
}: Helm) => {
  let url = `${helmUrl}/repos/${helmOrganization}/${helmRepository}/contents`;

  if (helmPath) {
    url = `${helmUrl}/repos/${helmOrganization}/${helmRepository}/contents/${helmPath}`;
  }

  const params = new URLSearchParams({
    ref: helmBranch || DEFAULT_BRANCH,
  });

  return `${url}?${params}`;
};

const createGitlabApi = ({
  helmUrl,
  helmProjectId,
  helmPath,
  helmBranch
}: Helm) => {
  let url = `${helmUrl}/api/v4/projects/${helmProjectId}/repository`;

  const params = new URLSearchParams({
    ref: helmBranch || DEFAULT_BRANCH,
  });

  if (helmPath) params.append('path', helmPath);

  return `${url}?${params}`;
};

export const createGitApi = (data: Helm, gitProvider: GitProviders) => {
  if (gitProvider === 'GITHUB') {
    return createGithubApi(data);
  } else {
    return createGitlabApi(data);
  }
};

const destructGithub = (
  url: string,
  setValue: SetValue
) => {
  const params = (new URL(url)).searchParams;
  const splitProtocol = url.split('//');
  const splitUrl = splitProtocol[1].split('/');
  const reposPosition = splitUrl.indexOf('repos');
  const baseUrl = splitUrl.slice(0, reposPosition).join("/");

  const helmUrl = `${splitProtocol[0]}//${baseUrl}`
  const organization = splitUrl[reposPosition + 1];
  const repository = splitUrl[reposPosition + 2];
  
  let path = '';
  if (splitUrl[reposPosition + 4]) {
    path = splitUrl[reposPosition + 4].split('?')[0];
  }

  const branch = params.get('ref');

  setValue('helmUrl', helmUrl, { shouldValidate: true });
  setValue('helmOrganization', organization, { shouldValidate: true });
  setValue('helmRepository', repository, { shouldValidate: true });
  setValue('helmBranch', branch, { shouldValidate: true });
  setValue('helmPath', path, { shouldValidate: true });
};

const destructGitlab = (
  url: string,
  setValue: SetValue
) => {
  const params = (new URL(url)).searchParams;
  const baseUrlFind = '/api/v4/projects';
  const baseUrlLocation = url.indexOf(baseUrlFind);
  const baseUrl = url.slice(0, baseUrlLocation);
  const leftInfo = url.slice(baseUrlLocation + baseUrlFind.length + 1);
  const infoSplit = leftInfo.split('/');
  const projectId = infoSplit[0];
  const branch = params.get('ref');
  const path = params.get('path');

  setValue('helmUrl', baseUrl, { shouldValidate: true });
  setValue('helmProjectId', projectId, { shouldValidate: true });
  setValue('helmBranch', branch, { shouldValidate: true });
  setValue('helmPath', path, { shouldValidate: true });
};

export const destructHelmUrl = (
  url: string,
  gitProvider: GitProviders,
  setValue: SetValue
) => {
  if (gitProvider === 'GITHUB') {
    return destructGithub(url, setValue);
  } else {
    return destructGitlab(url, setValue);
  }
};

export const findGitProvider = (url: string) => {
  if (url.includes('github')) {
    return githubProvider;
  } else {
    return gitlabProvider;
  }
};

export const validateSlash = (input: string, name: string) => {
  if (input[0] === "/") {
    return `the ${name} field should not start with "/"`
  } else if (input.slice(-1) === "/") {
    return `the ${name} field should not ends with "/"`
  }
  return true
}


export const getHelmFieldsValidations = (name: string, required = true) => ({
  required: required ? isRequired() : null,
  validate: {
    validSlash: (value: string) => validateSlash(value, name),
    notBlank: isNotBlank
  },
  setValueAs: trimValue
})

