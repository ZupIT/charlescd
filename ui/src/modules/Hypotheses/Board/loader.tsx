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
import map from 'lodash/map';
import ContentLoader from 'react-content-loader';

const Loader: FunctionComponent = () => (
  <ContentLoader
    speed={4}
    width={1530}
    height={700}
    viewBox="0 0 1530 700"
    backgroundColor="#3a393c"
    foregroundColor="#2c2b2e"
  >
    <rect x="30" y="20" rx="6" ry="6" width="100" height="10" />
    <rect x="30" y="50" rx="2" ry="2" width="269" height="5" />
    {map(Array(3).fill(''), (e, i) => (
      <rect
        key={i}
        style={{ opacity: Number(2 / (i + 6)) }}
        x="30"
        y={80 + i * 100}
        rx="4"
        ry="4"
        width="269"
        height="80"
      />
    ))}
  </ContentLoader>
);

export default Loader;
