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
  width?: number | string;
  height?: number | string;
}

const ColumnChart = ({
  className,
  options,
  series,
  width = '100%',
  height
}: Props) => (
  <Styled.Chart
    className={className}
    options={defaultsDeep(options, defaultConfig.options)}
    width={width}
    height={height}
    series={series}
    type="bar"
  />
);

export default ColumnChart;
