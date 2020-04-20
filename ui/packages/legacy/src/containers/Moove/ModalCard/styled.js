import styled from 'styled-components'
import Title from 'components/Title'

const Items = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: flex-start;
  width: 100%;
`

const ViewTitle = styled(Title)`
  padding: 0;
`

const Item = styled.div`
  margin: 5px 5px 5px 0;
`

const ModulesWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  min-height: 50px;
`

const SpaceBetween = styled.div`
  margin-right: 10px;
`

const Outside = styled.div`
  margin-top: 5px;
`

export const Styled = {
  ViewTitle,
  Items,
  Item,
  SpaceBetween,
  Module: {
    Wrapper: ModulesWrapper,
    Outside,
  },
}
