import styled from 'styled-components'

const Wrapper = styled.div`
  height: 71px;
  line-height: 71px;
  font-size: 16px;
  color: ${({ theme }) => theme.COLORS.COLOR_WHITE};
  background-color: ${({ theme }) => theme.COLORS.COLOR_FREE_SPEECH_BLUE};
  border-top-right-radius: 6px;
  border-top-left-radius: 6px;
  padding: 0 0 0 20px;
`

export const StyledHeader = {
  Wrapper,
}
