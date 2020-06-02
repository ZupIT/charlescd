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

jest.mock('react-apexcharts', () => {
  return {
    __esModule: true,
    default: (props: any) => {
      const [serie] = props.series;
      const data = serie?.data && serie?.data?.length ? serie?.data : [];

      return (
        <div data-testid="apexcharts-mock" {...props}>
          <div>
            <svg>
              <g className="apexcharts-yaxis">
                <g>
                  {data.map((y: number[], index: number) => (
                    <text
                      key={`y-${index}`}
                      className="apexcharts-yaxis-label"
                    >
                      { y[1] }
                    </text>
                  ))}
                </g>
              </g>
              <g className="apexcharts-xaxis">
                <g>
                  {data.map((x: number[], index: number) => (
                    <text
                      key={`x-${index}`}
                      className="apexcharts-xaxis-label"
                    >
                      { x[0] }
                    </text>
                  ))}
                </g>
              </g>
            </svg>
          </div>
        </div>
      );
    }
  };
});
