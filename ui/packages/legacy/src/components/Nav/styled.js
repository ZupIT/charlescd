import styled, { css } from 'styled-components'
import Link from 'core/routing/Link'

const Wrapper = styled.div`
  display: flex;
`

const RouterLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  margin-right: 25px;

  :first-child {
    button {
      padding-left: 0px;
    }
  }
`

const Button = styled.button`
  background-color: transparent;
  border: none;
  color: ${({ theme }) => theme.COLORS.COLOR_WHITE};
  font-weight: 600;
  font-size: 16px;
  padding: 5px 15px 5px 15px;
  cursor: pointer;
  opacity: 0.4;

  & + button {
    margin-left: 10px;
  }

  ${({ active }) => active && css`
    opacity: 1;
  `}

  &:hover {
    opacity: 1;
  }
`

export const StyledNav = {
  Wrapper,
  Button,
  RouterLink,
}
