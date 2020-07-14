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

import { chartDateFormatter as formatter } from './helpers';
import { humanizeDateFromSeconds } from 'core/utils/date';
import { getTheme } from 'core/utils/themes';

const theme = getTheme();

export default {
  chart: {
    width: 1180,
    height: 450,
    id: 'chartAverageTime',
    background: 'transparent'
  },
  colors: [theme.metrics.dashboard.chart.averageTime],
  stroke: {
    curve: 'smooth'
  },
  theme: {
    mode: 'dark'
  },
  grid: {
    show: true,
    yaxis: {
      lines: {
        show: true
      }
    },
    padding: {
      left: 30
    }
  },
  tooltip: {
    y: {
      formatter: function(value: number) {
        return humanizeDateFromSeconds(value);
      }
    }
  },
  yaxis: {
    show: true,
    showAlways: true,
    tickAmount: 6,
    labels: {
      style: {
        fontSize: '10px'
      }
    }
  },
  xaxis: {
    type: 'datetime',
    tickAmount: 7,
    labels: {
      hideOverlappingLabels: false,
      style: {
        color: theme.metrics.dashboard.chart.labels,
        fontSize: '10px'
      },
      formatter
    }
  }
};
