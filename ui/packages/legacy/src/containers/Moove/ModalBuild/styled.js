import styled from 'styled-components'
import Title from 'components/Title'

const ContentInfo = styled.div`
  display: grid;
  margin: -30px 0 20px 5px;
`

const BuildViewTitle = styled(Title)` 
  padding: 0 7px;
`

const BuildViewTitleFeatures = styled(Title)`
  padding: 0 7px;
  font-size: small;
  margin-top: 20px;
`

const Item = styled.div`
  margin: 5px 5px 5px 0;
`

const Info = styled.small`
  margin: 0 0 0 -15px;
`

const BranchName = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const Wrapper = styled.div``

const ContentWrapper = styled.div`
  margin: 0 0 0 40px;
`

export default {
  ContentInfo,
  BuildViewTitle,
  BuildViewTitleFeatures,
  Item,
  Info,
  BranchName,
  Wrapper,
  ContentWrapper,
}
