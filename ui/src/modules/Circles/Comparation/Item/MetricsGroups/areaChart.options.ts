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

import { getTheme } from 'core/utils/themes';

const theme = getTheme();

export default {
  chart: {
    id: 'monitoringChart',
    background: 'transparent',
    stacked: false,
    zoom: {
      enabled: false
    }
  },
  colors: theme.metrics.chart.Comparison,
  theme: {
    mode: 'dark'
  },
  grid: {
    borderColor: theme.circleGroupMetrics.chart.gridColor,
    show: true,
    yaxis: {
      lines: {
        show: true
      }
    },
    padding: {
      left: 10
    }
  },
  legend: {
    show: false
  },
  xaxis: {
    type: 'datetime',
    labels: {
      datetimeUTC: false
    }
  },
  markers: {
    size: 0.1,
    strokeColors: 'transparent'
  },
  stroke: {
    curve: 'smooth'
  },
  tooltip: {
    x: {
      format: 'dd MMM • HH:mm'
    }
  }
};
