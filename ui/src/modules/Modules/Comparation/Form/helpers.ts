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

import { Option } from 'core/components/Form/Select/interfaces';
import { isNotBlank, isRequired, trimValue } from 'core/utils/validations';
import forEach from 'lodash/forEach';
import { Helm } from 'modules/Modules/interfaces/Helm';
import {
  githubProvider,
  gitlabProvider
} from 'modules/Settings/Credentials/Sections/CDConfiguration/constants';

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
  helmOrganization,
  helmRepository,
  helmPath,
  helmBranch
}: Helm) => {
  let url = '';
  if (helmOrganization && helmRepository) {
    if (helmPath) {
      url = `https://api.github.com/repos/${helmOrganization}/${helmRepository}/contents/${helmPath}`;
    } else {
      url = `https://api.github.com/repos/${helmOrganization}/${helmRepository}/contents`;
    }
  }

  if (helmBranch) {
    url = url.concat(`?ref=${helmBranch}`);
  } else {
    url = url.concat('?ref=main');
  }
  return url;
};

const createGitlabApi = ({
  helmGitlabUrl,
  helmOrganization,
  helmRepository,
  helmPath,
  helmBranch
}: Helm) => {
  let url = `${helmGitlabUrl}/api/v4/projects/${helmOrganization}%2F${helmRepository}/repository/files`;

  if (helmPath) {
    url = url.concat(`/${helmPath.split('/').join('%2F')}`);
  }

  if (helmBranch) {
    url = url.concat(`?ref=${helmBranch}`);
  } else {
    url = url.concat('?ref=main');
  }

  return url;
};

export const createGitApi = (data: Helm, gitProvider: Option) => {
  if (gitProvider.value === 'GITHUB') {
    return createGithubApi(data);
  } else {
    return createGitlabApi(data);
  }
};

const destructGithub = (
  url: string,
  setValue: (name: any, value: any) => void
) => {
  const leftInfo = url.slice(29); // 29 is "https://api.github.com/repos/".length()
  const infoSplit = leftInfo.split('/');
  const organization = infoSplit[0];
  const repository = infoSplit[1];
  setValue('helmOrganization', organization);
  setValue('helmRepository', repository);

  if (infoSplit.length < 4) {
    const branch = infoSplit[2].split('?');
    setValue('helmBranch', branch[1].slice(4));
  } else {
    const pathBranchList = infoSplit[3].split('?');
    const path = pathBranchList[0];
    const branch = pathBranchList[1].slice(4);
    setValue('helmPath', path);
    setValue('helmBranch', branch);
  }
};

const destructGitlab = (
  url: string,
  setValue: (name: any, value: any) => void
) => {
  const baseUrlFind = '/api/v4/projects';
  const baseUrlLocation = url.indexOf(baseUrlFind);
  const baseUrl = url.slice(0, baseUrlLocation);
  const leftInfo = url.slice(baseUrlLocation + baseUrlFind.length + 1); // + 1 remove extra /
  const infoSplit = leftInfo.split('/');
  const orgRepoEncode = infoSplit[0].split('%2F');
  const organization = orgRepoEncode[0];
  const repository = orgRepoEncode[1];
  setValue('helmOrganization', organization);
  setValue('helmRepository', repository);
  setValue('helmGitlabUrl', baseUrl);

  if (infoSplit.length < 4) {
    const pathBranchEncode = infoSplit[2].split('?');
    setValue('helmBranch', pathBranchEncode[1].slice(4));
  } else {
    const pathBranchEncode = infoSplit[3].split('?');
    const path = pathBranchEncode[0].split('%2F').join('/');
    const branch = pathBranchEncode[1].slice(4);
    setValue('helmPath', path);
    setValue('helmBranch', branch);
  }
};

export const destructHelmUrl = (
  url: string,
  gitProvider: Option,
  setValue: (name: any, value: any) => void
) => {
  if (gitProvider.value === 'GITHUB') {
    return destructGithub(url, setValue);
  } else {
    return destructGitlab(url, setValue);
  }
};

export const findGitProvider = (url: string) => {
  if (url.includes('api.github.com')) {
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


export const getHelmFieldsValidations = (name: string) => ({
  required: isRequired(),
  validate: {
    validSlash: (value: string) => validateSlash(value, name),
    notBlank: isNotBlank
  },
  setValueAs: trimValue
})

