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
    }
  }
};
