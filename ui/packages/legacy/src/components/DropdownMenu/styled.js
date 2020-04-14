import styled, { css } from 'styled-components'

const Wrapper = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-right: -10px;
  margin-top: -5px;
`

const Tooltip = styled.div`
  align-items: center;
  background-color: ${({ theme }) => theme.COLORS.PRIMARY};
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  height: auto;
  position: absolute;
  right: 20px;
  width: 100px;
  top: 1px;

  ${({ dark, theme }) => dark && css`
    color: ${theme.COLORS.COLOR_ECLIPSE};
    box-shadow: unset;
  `}
`

const TooltipAction = styled.div`
  padding: 10px;
  font-size: 12px;
  font-weight: normal;
  color: ${({ theme }) => theme.COLORS.SURFACE};

  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`

const Button = styled.button`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: none;
  border: none;
  padding: 0;

  svg > path {
    fill: ${({ theme }) => theme.COLORS.COLOR_GREY_COMET};
  };
  }

  &:hover {
    cursor: pointer;
    background: ${({ theme }) => theme.COLORS.COLOR_WHITE_SMOKE};
    opacity: 0.3;
  }

  ${({ dark, theme }) => dark && css`
    svg > path {
      fill: ${theme.COLORS.COLOR_WHITE};
    }

    &:hover {
      cursor: pointer;
      background: ${theme.COLORS.COLOR_ECLIPSE};
      opacity: 0.3;
    }
  `}
`

export const Styled = {
  Action: TooltipAction,
  Button,
  Tooltip,
  Wrapper,
}
