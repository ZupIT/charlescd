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

export default {
  options: {
    theme: {
      mode: 'dark'
    },
    tooltip: {
      theme: 'dark'
    },
    chart: {
      sparkline: {
        enabled: false
      },
      toolbar: {
        show: false
      }
    },
    yaxis: {
      tickAmount: 2,
      labels: {
        style: {
          color: '#fff'
        }
      }
    },
    xaxis: {
      type: 'numeric',
      tickAmount: 2,
      axisBorder: {
        show: false
      }
    },
    dataLabels: {
      enabled: false
    },
    markers: {
      size: 0,
      style: 'hollow'
    },
    grid: {
      show: true,
      xaxis: {
        lines: {
          show: false
        }
      },
      yaxis: {
        lines: {
          show: false
        }
      },
      padding: {
        left: 0,
        right: 0
      }
    },
    stroke: {
      show: true,
      curve: 'straight',
      lineCap: 'butt',
      width: 1.4,
      dashArray: 0
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        shadeIntensity: 0.5,
        opacityFrom: 0.6,
        opacityTo: 0,
        stops: [0, 50, 100]
      }
    },
    noData: {
      text: 'No available data',
      align: 'center',
      verticalAlign: 'middle',
      offsetX: 0,
      offsetY: 0,
      style: {
        color: '#FFF',
        fontSize: '14px'
      }
    }
  }
};
