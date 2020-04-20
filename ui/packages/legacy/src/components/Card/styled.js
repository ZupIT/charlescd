import styled, { css } from 'styled-components'

export const StyledCard = styled.div`
  position: relative;
  background: ${({ theme }) => theme.COLORS.COLOR_WHITE};
  border-radius: 6px;
  box-sizing: border-box;
  margin: 20px 20px 0 0;
  padding: 20px;
  transition: all .2s ease-in-out;
  width: 100%;


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
    min-width: 385px;
  `}

  ${({ large }) => large && css`
    min-width: 554px;
  `}
`

export const StyledRow = styled.div`

  &:not(:first-child) {
    margin-top: 20px;
  }
`

export const StyledTitle = styled.section`
  font-size: 24px;
`
