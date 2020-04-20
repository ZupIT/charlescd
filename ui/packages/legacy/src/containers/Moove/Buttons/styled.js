import styled, { css } from 'styled-components'
import { Button } from 'components/Button'

const CreateButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`

const CreateText = styled.span``

const CreateInternalButton = styled(Button)`
  padding: 10px;
  width: 36px;
  height: 36px;
  min-height: 36px;
  border-radius: 50%;
  display: initial;

  ${CreateText} {
    visibility: hidden;
  }
  
  svg {
    width: 100%;
    height: 100%;
    fill: ${({ theme }) => theme.COLORS.COLOR_WHITE};
    
    path {
      fill: ${({ theme }) => theme.COLORS.COLOR_WHITE};
    }
  }

  &:hover {
    padding: 10px 15px;
    width: 280px;
    border-radius: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
    
    ${CreateText} {
      visibility: visible;
    }
    
    svg {
      width: 12px;
      height: 12px;
      margin: 0 5px;
    }

  }
`

const ReleaseButtonWrapper = styled(Button)`
  width: 100%;
  background: ${({ theme }) => theme.COLORS.COLOR_GHOST_WHITE};
  border-radius: 6px;
  font-size: 14px;
  padding: 10px 0;
  letter-spacing: 0.1px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  margin: 10px 0;
  color: ${({ theme }) => theme.COLORS.COLOR_BLACK};
  
  svg {
    padding-right: 5px;
  }
  
  ${({ isLoading, theme }) => isLoading && css`
    padding: 5px 0;
    background: ${theme.COLORS.COLOR_BLACK};
    color: ${theme.COLORS.COLOR_WHITE};
  `}
`

export const StyledMooveButtons = {
  Wrapper: {
    Create: CreateButtonWrapper,
    Release: ReleaseButtonWrapper,
  },
  CreateInternalButton,
  CreateText,
}
