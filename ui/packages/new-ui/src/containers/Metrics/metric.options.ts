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
