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

import { chartDateFormatter as formatter, chartLegendBuilder } from './helpers';
import { humanizeDateFromSeconds } from 'core/utils/date';
import { getTheme } from 'core/utils/themes';

const theme = getTheme();

export default {
  chart: {
    id: 'chartDeploy',
    background: 'transparent',
    type: 'line',
    stacked: false
  },
  title: {
    text: 'Deploy',
    offsetY: -5,
    offsetX: 10,
    style: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: theme.metrics.dashboard.chart.label
    }
  },
  colors: [
    theme.metrics.dashboard.chart.deploy,
    theme.metrics.dashboard.chart.error,
    theme.metrics.dashboard.chart.averageTime
  ],
  stroke: {
    width: [5, 5, 2],
    curve: 'smooth',
    dashArray: [0, 0, 5],
    colors: ['00', '00', theme.metrics.dashboard.chart.averageTime]
  },
  fill: {
    opacity: 1,
    type: ['fill', 'fill', 'gradient'],
    gradient: {
      inverseColors: false,
      shade: 'dark',
      type: 'vertical',
      opacityFrom: 0.4,
      opacityTo: 0.35,
      stops: [0, 80]
    }
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
      left: 8,
      right: 14
    }
  },
  legend: {
    show: true,
    showForNullSeries: true,
    showForSingleSeries: true,
    showForZeroSeries: true,
    offsetY: -10,
    position: 'top',
    horizontalAlign: 'left',
    formatter: function(seriesName: string, opts: any) {
      return chartLegendBuilder(seriesName, opts);
    },
    markers: {
      radius: 50
    },
    itemMargin: {
      horizontal: 10
    },
    onItemClick: {
      toggleDataSeries: true
    }
  },
  tooltip: {
    y: [
      '',
      '',
      {
        formatter: function(value: number) {
          return humanizeDateFromSeconds(value);
        }
      }
    ]
  },
  yaxis: [
    {
      seriesName: 'Deploy',
      showAlways: true,
      tickAmount: 6,
      min: 0,
      axisTicks: {
        show: false
      },
      axisBorder: {
        show: true,
        color: theme.metrics.dashboard.chart.border
      },
      labels: {
        style: {
          colors: theme.metrics.dashboard.chart.label
        }
      }
    },
    {
      seriesName: 'Deploy',
      show: false
    },
    {
      seriesName: 'Avagere Time',
      showAlways: true,
      tickAmount: 6,
      min: 0,
      opposite: true,
      axisTicks: {
        show: false
      },
      axisBorder: {
        show: true,
        color: theme.metrics.dashboard.chart.border
      },
      labels: {
        style: {
          colors: theme.metrics.dashboard.chart.label
        },
        formatter: function(value: number) {
          return humanizeDateFromSeconds(value);
        }
      }
    }
  ],
  xaxis: {
    type: 'category',
    tickAmount: 'dataPoints',
    axisBorder: {
      show: false,
      offsetY: -10
    },
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
