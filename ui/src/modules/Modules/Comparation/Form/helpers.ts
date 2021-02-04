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
    url.concat(`?ref=${helmBranch}`);
  } else {
    url.concat('?ref=main');
  }
  return url;
};

const createGitlabApi = ({
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
    url.concat(`?ref=${helmBranch}`);
  } else {
    url.concat('?ref=main');
  }

  if (helmPath) {
    url.concat(`&path=${helmPath}`);
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
  const path = infoSplit.splice(3).join('/');
  setValue('helmOrganization', organization);
  setValue('helmRepository', repository);
  setValue('helmPath', path);
};

const destructGitlab = (
  url: string,
  setValue: (name: any, value: any) => void
) => {
  const baseUrlLocation = url.indexOf('/api/v4');
  const baseUrl = url.slice(0, baseUrlLocation);
  const leftInfo = url.slice(29); // 29 is "https://api.github.com/repos/".length()
  const infoSplit = leftInfo.split('/');
  const organization = infoSplit[0];
  const repository = infoSplit[1];
  const path = infoSplit.splice(3).join('/');
  setValue('helmOrganization', organization);
  setValue('helmRepository', repository);
  setValue('helmPath', path);
  setValue('helmGitlabUrl', baseUrl);
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
