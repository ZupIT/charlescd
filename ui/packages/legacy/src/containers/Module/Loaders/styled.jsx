import styled from 'styled-components'
import { CardBox } from 'components/CardBox'

const Box = styled(CardBox)`
  height: 400px;
  background-color: ${({ theme }) => theme.COLORS.COLOR_GREY};
`

export const StyledCard = {
  Box,
}
