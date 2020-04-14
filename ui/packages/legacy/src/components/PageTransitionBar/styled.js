import styled, { css } from 'styled-components'
import { Link as LinkRoute } from 'react-router-dom'

const Logo = styled.div`
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.COLORS.PRIMARY};
`

const Content = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  ${({ left }) => left && css`
    margin-top: -60px;
  `}
`

const Link = styled(LinkRoute)`
  background-color: ${({ theme }) => theme.COLORS.COLOR_WHITE};
  height: 100%;
  width: 60px;
  text-decoration: none;

  &:hover {
    box-shadow: 0px 0px 5px 5px ${({ theme }) => theme.COLORS.COLOR_BLACK_SMOKE};
    cursor: pointer;
  }
`

const Text = styled.div`
  color: ${({ theme }) => theme.COLORS.PRIMARY};
  background-color: ${({ theme }) => theme.COLORS.COLOR_WHITE};
  transform: rotate(270deg);
  width: 100px;
`

export const Styled = {
  Content,
  Link,
  Logo,
  Text,
}
