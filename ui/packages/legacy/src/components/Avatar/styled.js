import styled from 'styled-components'

const Image = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 16.4px;
  margin: ${({ margin }) => margin || '0 2px 0 0'};
`

export default {
  Image,
}
