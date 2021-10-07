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


import { Story } from '@storybook/react';
import Chart, { Props } from 'core/components/Chart';
import areaChartOption from 'modules/Circles/Comparation/Item/MetricsGroups/MetricsGroupCard/areaChart.options';

export default {
  title: 'Components/Chart',
  component: Chart,
};

const Template: Story<Props> = (props: Props) => <Chart {...props} />;
export const chart = Template.bind({});
chart.args = {
  series: [{
    name: 'test 1',
    data: [
      {
        x: 1623074400000,
        y: 50
      },
      {
        x: 1623074700000,
        y: 50
      },
      {
        x: 1623075000000,
        y: 30
      },
      {
        x: 1623075300000,
        y: 50
      },
      {
        x: 1623075600000,
        y: 50
      },
      {
        x: 1623075900000,
        y: 40
      },
      {
        x: 1623076200000,
        y: 50
      },
      {
        x: 1623076500000,
        y: 50
      },
      {
        x: 1623076800000,
        y: 50
      },
      {
        x: 1623077100000,
        y: 50
      },
      {
        x: 1623077400000,
        y: 50
      },
      {
        x: 1623077700000,
        y: 50
      }
    ]
  }],
  type: 'area',
  width: 500,
  height: 200,
  options: {...areaChartOption, chart: {background: '#2c2c2e'}}
};