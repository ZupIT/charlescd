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

import dayjs from 'dayjs';

export default {
  chart: {
    width: '100%'
  },
  stroke: {
    curve: 'smooth'
  },
  theme: {
    mode: 'dark'
  },
  legend: {
    show: false
  },
  tooltip: {
    x: {
      formatter: (value: number) => {
        const UNIX_TIMESTAMP_CONVERSION = 1000;

        return dayjs(new Date(value * UNIX_TIMESTAMP_CONVERSION)).format(
          'hh:mm:ss'
        );
      }
    }
  },
  yaxis: {
    opposite: false,
    labels: {
      formatter: (value: number) => Number(value).toFixed(2),
      style: {
        fontSize: '10px'
      }
    }
  },
  xaxis: {
    type: 'numeric',
    tickAmount: 3,
    labels: {
      style: {
        color: '#fff',
        fontSize: '10px'
      },
      formatter: (value: number, timestamp: number) => {
        const UNIX_TIMESTAMP_CONVERSION = 1000;

        return dayjs(new Date(timestamp * UNIX_TIMESTAMP_CONVERSION)).format(
          'hh:mm:ss'
        );
      }
    },
    axisBorder: {
      show: false
    }
  }
};
