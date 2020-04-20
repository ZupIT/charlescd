import styled, { css } from 'styled-components'

const Box = styled.div`
  background: ${({ theme }) => theme.COLORS.COLOR_WHITE};
  border-radius: 6px;
  box-sizing: border-box;
  margin: 20px 30px 10px 0;
  transition: all .2s ease-in-out;
  width: 100%;

  &:only-of-type {
    margin: 0;
  }

  &:hover {
    transform: scale(1.02);
  }

  ${({ shadowed }) => shadowed && css`
    box-shadow: 5px 7px 15px 0px ${({ theme }) => theme.COLORS.COLOR_BLACK_SMOKE};
  `}

  ${({ onClick }) => onClick && css`
    cursor: pointer;
  `}

  ${({ small }) => small && css`
    width: 385px;
  `}

  ${({ large }) => large && css`
    width: 550px;
  `}
`

export const StyledCard = {
  Box,
}
