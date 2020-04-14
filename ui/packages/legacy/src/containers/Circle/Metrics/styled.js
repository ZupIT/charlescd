import styled, { css } from 'styled-components'
import { AreaChart } from 'components/Charts'

const Wrapper = styled.div`
  display: block;
  width: 100%;
  padding: 10px 0;
`

const Chart = styled(AreaChart)`
  .apexcharts-xaxis-label  {
    fill: #fff;
  }
`

const Controls = styled.div`
  display: flex;
  justify-content: space-around;
`

const ControlItem = styled.div`
  font-size: 10px;
  padding: 6px 12px;
  color: ${({ theme }) => theme.COLORS.COLOR_WHITE};
  border-radius: 14.15px;

  &:hover {
    color: ${({ theme }) => theme.COLORS.PRIMARY};
    background: ${({ theme }) => theme.COLORS.COLOR_WHITE};
  }

  ${({ isSelected }) => isSelected && css`
    background: ${({ theme }) => theme.COLORS.COLOR_WHITE};
    color: ${({ theme }) => theme.COLORS.PRIMARY};
  `}
`

export default {
  Wrapper,
  Chart,
  Controls,
  ControlItem,
}
