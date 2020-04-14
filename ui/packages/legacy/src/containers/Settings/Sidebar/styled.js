import styled from 'styled-components'
import Sidebar from 'components/Sidebar'

const Wrapper = styled(Sidebar)`
  z-index: ${({ theme }) => theme.Z_INDEX.OVER_3};
  background: ${({ theme }) => theme.DEFAULT.PRIMARY_DARK}
`

export default {
  Wrapper,
}
