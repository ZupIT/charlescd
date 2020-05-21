import moment from 'moment'

export default {
  options: {
    tooltip: {
      theme: 'dark',
      x: {
        formatter: (value) => {
          const UNIX_TIMESTAMP_CONVERSION = 1000

          return moment(new Date(value * UNIX_TIMESTAMP_CONVERSION)).format('hh:mm')
        },
      },
    },
    chart: {
      sparkline: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    yaxis: {

      tickAmount: 2,
      labels: {
        style: {
          color: '#fff',
        },
      },
    },
    xaxis: {
      type: 'numeric',
      tickAmount: 2,
      labels: {
        style: {
          color: '#fff',
        },
        formatter: (value, timestamp) => {
          const UNIX_TIMESTAMP_CONVERSION = 1000

          return moment(new Date(timestamp * UNIX_TIMESTAMP_CONVERSION)).format('hh:mm')
        },
      },
      axisBorder: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
      style: 'hollow',
    },
    grid: {
      show: true,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: false,
        },
      },
      padding: {
        left: 0,
        right: 0,
      },
    },
    stroke: {
      show: true,
      curve: 'straight',
      lineCap: 'butt',
      width: 1.4,
      dashArray: 0,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        shadeIntensity: 0.5,
        opacityFrom: 0.9,
        opacityTo: 0,
        // eslint-disable-next-line no-magic-numbers
        stops: [0, 50, 100],
      },
    },
    colors: ['#64cb81'],
  },
}
