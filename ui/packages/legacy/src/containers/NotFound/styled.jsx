import styled from 'styled-components'
import { Title as TitleComponent } from 'components'

export const Wrapper = styled.div`
  padding: 86px 0 0 32px;
`

export const ImageBox = styled.div`
  display: block;
  text-align: center;
`

export const Title = styled(TitleComponent)`
  color: ${({ theme }) => theme.COLORS.PRIMARY};
  font-size: 30px;
  font-weight: 400;
  margin: 0;
  padding: 0;
`

export default {
  Wrapper,
  Title,
  ImageBox,
}
