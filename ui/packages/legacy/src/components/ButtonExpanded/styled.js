import styled, { css } from 'styled-components'

const Icon = styled.i`
  color: ${({ theme }) => theme.COLORS.COLOR_BLURPLE};
  font-size: 24px;
  font-style: initial;
  font-weight: lighter;
  margin-right: 0;
  display: flex;
  align-items: center;
`

const Span = styled.span`
  color: ${({ theme }) => theme.COLORS.COLOR_BLURPLE};
  cursor: pointer;
  font-size: 14px;

  max-width: 0;
  transition: max-width .1s;
  display: inline-block;
  vertical-align: top;
  white-space: nowrap;
  overflow: hidden;
`

const Button = styled.button`
  align-items: center;
  background: ${({ theme }) => theme.COLORS.COLOR_WHITE};
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  height: 50px;
  justify-content: center;
  line-height: 50px;
  text-align: center;
  width: 50px;
  transition: width .2s, border-radius .5s;

  ${({ reversed, theme }) => reversed && css`
    background: ${theme.COLORS.COLOR_BLURPLE};

    ${Icon} {
      color: ${theme.COLORS.COLOR_WHITE};

      svg > path {
        fill: ${theme.COLORS.COLOR_WHITE};
      }
    }

    ${Span} {
      color: ${theme.COLORS.COLOR_WHITE};
    }
  `}

  ${({ disabled }) => !disabled && css`
    &:hover {
      transition: width .5s, border-radius .1s;
      border-radius: 6px;
      height: 50px;
      width: 280px;

      ${Icon} {
        margin-right: 10px;
      }

      ${Span} {
        max-width: 280px;
      }
    }
  `}

  ${({ disabled }) => disabled && css`
    background: ${({ theme }) => theme.COLORS.COLOR_BLACK};
    cursor: initial;
    opacity: .2;
  `}
`

export const Styled = {
  Button,
  Icon,
  Span,
}
