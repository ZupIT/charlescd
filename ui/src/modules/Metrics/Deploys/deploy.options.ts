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
    height: '200px'
  },
  stroke: {
    curve: 'straight'
  },
  theme: {
    mode: 'dark'
  },
  legend: {
    show: true,
    showForNullSeries: true,
    position: 'top'
  },
  onItemClick: {
    toggleDataSeries: true
  },
  tooltip: {
    x: {
      formatter: (date: string) => {
        return dayjs(date).format('DD/MM');
      }
    }
  },
  yaxis: {
    opposite: false,
    labels: {
      formatter: (value: number) => Number(value),
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
      formatter: (date: string) => {
        return dayjs(date).format('DD/MM');
      }
    },
    axisBorder: {
      show: false
    }
  }
};
