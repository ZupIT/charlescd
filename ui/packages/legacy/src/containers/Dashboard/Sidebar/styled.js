import styled from 'styled-components'
import Sidebar from 'components/Sidebar'

const Wrapper = styled(Sidebar)`
  background-color: ${({ theme }) => theme.COLORS.PRIMARY};
  z-index: ${({ theme }) => theme.Z_INDEX.OVER_4};
`

export default {
  Wrapper,
}
