import styled from 'styled-components'
import { Card as ComponentCard } from 'core/components'

const Card = styled(ComponentCard)`
  cursor: pointer;
`

const Header = styled.div`
  display: flex;
  flex-direction: column;

  & > * {
    margin-bottom: 7px;
  }
`

const Name = styled.div`
  font-size: 14px;
`

const Legend = styled.div`
  font-size: 12px;
`

export default {
  Card,
  Name,
  Legend,
  Header,
}
