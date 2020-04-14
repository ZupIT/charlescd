import styled from 'styled-components'
import Content from 'components/ContentLayer'
import { Input as FormInput } from 'components/FormV2/Input'
import { Select as SelectComponent } from 'components/Form'
import TitleComponent from 'components/Title'

const Input = styled(FormInput)`
  width: 760px;

  input {
    color: ${({ theme }) => theme.COLORS.SURFACE};
  }
`

const ContentLayer = styled(Content)`
  align-items: flex-start;
  margin-bottom: 30px;

  input {
    font-weight: normal;
    font-size: 14px;
  }
`

const LayerUsername = styled(Content)`
  align-items: center;
  margin-bottom: 50px;
`

const LayerTitle = styled.span`
  font-size: 20px;
  font-weight: 500;
  padding: 0;
  color: ${({ theme }) => theme.COLORS.SURFACE};
`

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 50px;

  & * {
    margin-right: 5px;
  }
`

const Item = styled.div`
  display: flex;
  flex-direction: row;
`

const Select = styled(SelectComponent)`
  width: 200px;
`

const Title = styled(TitleComponent)`
  padding: 0;
`

export default {
  Input,
  ContentLayer,
  LayerTitle,
  LayerUsername,
  Container,
  Item,
  Select,
  Title,
}
