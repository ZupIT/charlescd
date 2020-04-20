import styled, { css } from 'styled-components'
import Loading from 'core/assets/svg/loading.svg'
import { THEME, SIZE } from './constants'

export const StyledLoading = styled(Loading)`
  width: 35px;
  height: 17px;
`

export const StyledContent = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: none;
  padding: 0 20px;
  background-color: ${({ theme }) => theme.COLORS.COLOR_PURPLE_HEART};
  font-size: ${({ theme }) => theme.DEFAULT.FONT_SIZE};
  color: ${({ theme }) => theme.COLORS.COLOR_WHITE};
  border-radius: 2px;
  cursor: pointer;
  margin: ${({ margin }) => margin};
  height: 40px;
  
  ${({ disabled }) => disabled && css`
    opacity: .5;
    cursor: not-allowed;
  `}

  :disabled {
    opacity: .5;
    cursor: not-allowed;
  }
    
  ${({ size }) => (size === SIZE.SMALL) && css`
    height: 20px;
  `};

  ${({ size }) => (size === SIZE.MEDIUM) && css`
    height: 30px;
  `};
  
  ${({ isLoading }) => isLoading && css`
    padding: 0 20px 0 10px;
  `}
  
  ${({ buttonTheme }) => (buttonTheme === THEME.DEFAULT) && css`
    :hover {
      box-shadow: inset 0px 0px 0px 64px ${({ theme }) => theme.COLORS.COLOR_BLACK_ALPHA};
    }
  `};
  
  ${({ buttonTheme }) => (buttonTheme === THEME.OUTLINE) && css`
    background: transparent;
    color: ${({ theme }) => theme.COLORS.COLOR_BLURPLE};
    border: 1px solid ${({ theme }) => theme.COLORS.COLOR_BLURPLE};

    :hover {
      box-shadow: inset 0px 0px 0px 64px ${({ theme }) => theme.COLORS.COLOR_BLACK_ALPHA};
    }
  `};
`

export const StyledButton = {
  Button: StyledContent,
  Loading: StyledLoading,
}
