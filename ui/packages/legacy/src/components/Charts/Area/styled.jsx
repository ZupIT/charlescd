import styled from 'styled-components'
import Charts from 'react-apexcharts'

const Chart = styled(Charts)`
  cursor: crosshair;
  
  .apexcharts-yaxistooltip {
    display: none;
  }
  .apexcharts-xaxistooltip {
    display: none;
  }
`

export const StyledChart = {
  Chart,
}
