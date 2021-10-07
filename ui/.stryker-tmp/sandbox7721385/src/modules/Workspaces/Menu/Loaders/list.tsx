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
// @ts-nocheck


import React from 'react';
import ContentLoader from 'react-content-loader';

export type Props = {
  className?: string;
};

export const Loader = ({className}: Props) => (
  <ContentLoader
    speed={4}
    width={200}
    height={200}
    viewBox="0 0 200 200"
    backgroundColor="#3a393c"
    foregroundColor="#2c2b2e"
    className={className}
  >
    <rect x="0" y="0" rx="4" ry="4" width="260" height="15" />
    <rect x="0" y="35" rx="4" ry="4" width="260" height="15" />
    <rect x="0" y="70" rx="4" ry="4" width="260" height="15" />
  </ContentLoader>
);
