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

import { useCallback, useState } from 'react';
import {
  useFetch,
  useFetchData,
  useFetchStatus,
  FetchStatus
} from 'core/providers/base/hooks';
import { findComponentTags } from 'core/providers/modules';
import {
  composeBuild as postComposeBuild,
  findBuilds
} from 'core/providers/builds';
import { createDeployment as postCreateDeployment } from 'core/providers/deployment';
import { URLParams } from 'core/utils/query';
import { Pagination } from 'core/interfaces/Pagination';
import { Build, FilterBuild } from './interfaces/Build';
import { CreateDeployment } from './interfaces/Deployment';
import { Deployment } from '../interfaces/Circle';
import { Tag } from './interfaces/Tag';

export const useComponentTags = (): {
  getComponentTag: Function;
  tag: Tag;
  status: FetchStatus;
} => {
  const getTags = useFetchData<Tag[]>(findComponentTags);
  const status = useFetchStatus();
  const [tag, setTag] = useState(null);

  const getComponentTag = async (
    moduleId: string,
    componentId: string,
    params: URLParams
  ) => {
    try {
      if (params.name) {
        status.pending();
        const res = await getTags(moduleId, componentId, params);
        const [tag] = res;

        setTag(tag);
        status.resolved();

        return tag;
      }
    } catch (e) {
      status.rejected();
    }
  };

  return {
    getComponentTag,
    tag,
    status
  };
};

export const useComposeBuild = (): {
  composeBuild: Function;
  response: Build;
  loading: boolean;
} => {
  const [data, composeBuild] = useFetch<Build>(postComposeBuild);
  const { response, loading } = data;

  return {
    composeBuild,
    response,
    loading
  };
};

export const useCreateDeployment = (): {
  createDeployment: Function;
  response: Deployment;
  loading: boolean;
} => {
  const [data, createDeploy] = useFetch<Deployment>(postCreateDeployment);
  const { response, loading } = data;

  const createDeployment = useCallback(
    (data: CreateDeployment) => {
      createDeploy(data);
    },
    [createDeploy]
  );

  return {
    createDeployment,
    response,
    loading
  };
};

export const useFindBuilds = (): {
  getBuilds: Function;
  response: Pagination<Build>;
  loading: boolean;
} => {
  const [data, request] = useFetch<Pagination<Build>>(findBuilds);
  const { response, loading } = data;

  const getBuilds = useCallback(
    (data: FilterBuild) => {
      request(data);
    },
    [request]
  );

  return {
    getBuilds,
    response,
    loading
  };
};
