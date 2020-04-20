import styled from 'styled-components'
import { Title } from 'components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  font-family: 'Roboto', sans-serif;
`

export const StyledRow = styled.div`
  & + div {
    margin-top: 30px;
  }
`

export const StyledTitle = styled(Title)`
  color: ${({ theme }) => theme.COLORS.SURFACE};
  font-size: 30px;
  padding: 0;
`

export const StyledHeaderNav = {
  Wrapper,
  Row: StyledRow,
  Title: StyledTitle,
}
