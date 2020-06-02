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
import defaultsDeep from 'lodash/defaultsDeep';
import defaultConfig from './config';
import Styled from './styled';

export interface Props {
  series: object[];
  options?: object;
  className?: string;
}

const AreaChart = ({ className, options, series }: Props) => (
  <Styled.Chart
    className={className}
    options={defaultsDeep(options, defaultConfig.options)}
    series={series}
    type="area"
    width="100%"
  />
);

export default AreaChart;
