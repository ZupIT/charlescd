import styled from 'styled-components'
import Link from 'core/routing/Link'

const Wrapper = styled.div`
  margin-left: 30px;
  padding-top: 70px;
`

const Nav = styled(Link)`
  text-decoration: none;
  margin-right: 70px;
  color: ${({ theme }) => theme.COLORS.SURFACE};

  a {
    text-decoration: none;
  }

  &.active {
    font-weight: 700;
  }
`

const Content = styled.div`
  padding-top: 50px;
`

export default {
  Wrapper,
  Nav,
  Content,
}
