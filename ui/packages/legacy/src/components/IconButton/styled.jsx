import styled, { css } from 'styled-components'
import { Button } from 'components/Button'
import { THEME } from './constants'

const IconButton = styled(Button)`
  padding: 0;
  background: transparent;
  color: ${({ theme }) => theme.COLORS.SURFACE};
  border: 1px solid ${({ theme }) => theme.COLORS.COLOR_GREY_COMET};
  
  ${({ buttonTheme, theme }) => buttonTheme === THEME.LIGHT && css`
    border: 1px solid ${theme.COLORS.COLOR_GREY_COMET};
    color: ${theme.COLORS.COLOR_GREY_COMET};
  `};  
`

const Icon = styled.i`
  width: 40px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.COLORS.COLOR_GREY_COMET};
  
  svg > path {
    fill: ${({ theme }) => theme.COLORS.SURFACE};
  }
  
  ${({ buttonTheme, theme }) => buttonTheme === THEME.LIGHT && css`
    background: ${theme.COLORS.COLOR_GREY_COMET};

    svg > path {
      fill: ${theme.COLORS.SURFACE};
    }
  `}
`

const Child = styled.span`
  padding: 0 20px;
`

export const StyledButton = {
  Button: IconButton,
  Icon,
  Child,
}
