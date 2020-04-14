import styled from 'styled-components'
import SidebarStyled from 'components/Sidebar/styled'

const Wrapper = styled.div`
  width: 100%;
`

const Content = styled.div`
  margin-left: ${SidebarStyled.WIDTH};
  width: calc(100vw - ${SidebarStyled.WIDTH});
`

export default {
  Wrapper,
  Content,
}
