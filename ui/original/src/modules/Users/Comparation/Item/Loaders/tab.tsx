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
import TabPanel from 'core/components/TabPanel';
import ContentLoader from 'react-content-loader';

export const Loader: FunctionComponent = () => (
  <TabPanel title="Loading..." name="user" size="15px">
    <ContentLoader
      speed={4}
      width={660}
      height={700}
      viewBox="0 0 660 700"
      backgroundColor="#3a393c"
      foregroundColor="#2c2b2e"
    >
      <rect x="0" y="60" rx="22" ry="22" width="22" height="22" />
      <rect x="35" y="40" rx="50" ry="50" width="60" height="60" />
      <rect x="0" y="140" rx="22" ry="22" width="22" height="22" />
      <rect x="35" y="140" rx="4" ry="4" width="300" height="22" />
      <rect x="0" y="220" rx="22" ry="22" width="22" height="22" />
      <rect x="35" y="220" rx="4" ry="4" width="300" height="22" />
      <rect x="0" y="280" rx="22" ry="22" width="22" height="22" />
      <rect x="35" y="280" rx="4" ry="4" width="300" height="22" />
      <rect x="35" y="330" rx="4" ry="4" width="269" height="60" />
    </ContentLoader>
  </TabPanel>
);
