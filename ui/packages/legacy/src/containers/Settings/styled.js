import styled from 'styled-components'
import SidebarStyled from 'components/Sidebar/styled'

const Wrapper = styled.div`

`

const Content = styled.div`
  margin-left: ${SidebarStyled.OPEN_WIDTH};
  width: calc(100vw - ${SidebarStyled.OPEN_WIDTH});
`

export default {
  Wrapper,
  Content,
}
