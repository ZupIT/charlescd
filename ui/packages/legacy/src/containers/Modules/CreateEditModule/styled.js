import styled from 'styled-components'
import ArrowLeftSVG from 'core/assets/svg/arrow-left-blue.svg'
import { Toggle as ToggleComponent, ModalFullContent } from 'components'
import { Input as InputFinalForm } from 'containers/FinalForm'

const Wrapper = styled(ModalFullContent)`

`

const List = styled.div`
  display: flex;
`

const Toggle = styled(ToggleComponent)`
  margin-top: 10px;
`

const FormItem = styled.div`
  margin-top: 30px;
`

const Input = styled(InputFinalForm)`
  width: 350px;
  input {
    background: ${({ theme }) => theme.COLORS.COLOR_WHITE};
  }
`

const Back = styled(ArrowLeftSVG)`
  cursor: pointer;
  margin-bottom: 30px;
`

export default {
  Wrapper,
  List,
  Toggle,
  FormItem,
  Input,
  Back,
}
