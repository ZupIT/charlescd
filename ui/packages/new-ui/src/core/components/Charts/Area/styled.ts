import styled from 'styled-components';
import Charts from 'react-apexcharts';

interface ChartProps {
  className?: string;
}

const Chart = styled(Charts)<ChartProps>`
  cursor: crosshair;
  padding-right: 15px;

  .apexcharts-canvas,
  .apexcharts-canvas.apexcharts-theme-dark {
    background-color: transparent;
  }

  .apexcharts-xaxis-tick {
    display: none;
  }

  .apexcharts-yaxistooltip {
    display: none;
  }
  .apexcharts-xaxistooltip {
    display: none;
  }
`;

export default {
  Chart
};
