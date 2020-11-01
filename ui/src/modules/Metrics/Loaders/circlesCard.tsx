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

import React, { FunctionComponent } from 'react';
import ContentLoader from 'react-content-loader';

export const Loader: FunctionComponent = () => (
  <ContentLoader
    speed={4}
    width={175}
    height={94}
    viewBox="0 0 175 94"
    backgroundColor="#3a393c"
    foregroundColor="#2c2b2e"
  >
    <circle cx="37" cy="44" r="25" />
    <rect x="75" y="28" rx="2" ry="2" width="80" height="10" />
    <rect x="75" y="51" rx="2" ry="2" width="80" height="10" />
  </ContentLoader>
);
