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

import { render, screen } from 'unit-test/testUtils';
import Chart from '..';

const props = {
  series: [{
    name: 'test 1',
    data: [
      {
        x: 1000,
        y: 10
      }
    ]
    }, {
    name: 'test 2',
    data: [
      {
        x: 500,
        y: 5
      }
    ]
  }],
}

test('render Chart', async () => {
  render(
    <Chart {...props} />
  );

  const ApexChart = await screen.findByTestId('apexcharts-mock');
  expect(ApexChart).toBeInTheDocument();
});