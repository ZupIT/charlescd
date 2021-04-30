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

import map from 'lodash/map';
import mapKeys from 'lodash/mapKeys';
import { Build } from '../interfaces/Build';
import { Metadata } from '../Metadata/interfaces';

export const getBuildOptions = (builds: Build[]) => {
  return map(builds, build => ({ value: build.id, label: build.tag }));
};

export const getMetadata = (build: Build) => {
  let metadatas: any = [];

  const metaList = map(build.deployments, deployment => {
    return deployment.metadata.content;
  });

  mapKeys(metaList[0], (value: string, key: string) => {
    metadatas.push({ 'key': key, 'value': value });
  });

  return metadatas;
};


export const toKeyValue = ({ content }: Metadata) => {
  let metadatas: any = {};
  
  map(content, (item) => {
    metadatas = { ...metadatas, [item.key]: item.value };
  })

  return metadatas;
};
