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
    width="100%"
    height={160}
    viewBox="0 0 1200 160"
    backgroundColor="#48484a"
    foregroundColor="#3a3a3c"
  >
    <rect x="0" y="0" rx="0" ry="0" width="100%" height="35" />
    <rect x="0" y="40" rx="0" ry="0" width="100%" height="35" />
    <rect x="0" y="80" rx="0" ry="0" width="100%" height="35" />
  </ContentLoader>
);
