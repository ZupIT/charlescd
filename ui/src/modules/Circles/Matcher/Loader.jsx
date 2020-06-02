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

import React from 'react';
import ContentLoader from 'react-content-loader';

const CirclesLoader = () => (
  <div>
    <ContentLoader
      speed={1}
      width={500}
      height={475}
      backgroundColor="#3a393c"
      foregroundColor="#2c2b2e"
    >
      <rect x="0" y="14" rx="2" ry="2" width="280" height="20" />
      <rect x="0" y="51" rx="2" ry="2" width="800" height="25" />
      <rect x="0" y="89" rx="2" ry="2" width="800" height="60" />
      <rect x="0" y="159" rx="2" ry="2" width="800" height="60" />
    </ContentLoader>
  </div>
);

export default CirclesLoader;
