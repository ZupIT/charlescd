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
    speed={1}
    width={270}
    height={150}
    viewBox="0 0 290 150"
    backgroundColor="#3a393c"
    foregroundColor="#2c2b2e"
  >
    <rect x="0" y="5" rx="5" ry="5" width="200" height="10" />
    <rect x="0" y="30" rx="5" ry="5" width="285" height="50" />
    <rect x="0" y="100" rx="5" ry="5" width="285" height="50" />
  </ContentLoader>
);
