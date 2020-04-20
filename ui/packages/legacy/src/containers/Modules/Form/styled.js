import styled from 'styled-components'
import ArrowLeftSVG from 'core/assets/svg/arrow-left-blue.svg'
import { Toggle as ToggleComponent } from 'components'
import { IconButton as IconButtonComponent } from 'components/IconButton'
import { Input as InputFinalForm } from 'containers/FinalForm'
import TrashSVG from 'core/assets/svg/trash-gray.svg'

const Wrapper = styled.div`

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

const FormItemParameter = styled(FormItem)`
  display: flex;
  align-items: center;
`

const Input = styled(InputFinalForm)`
  width: 350px;
  label {
    color: ${({ theme }) => theme.COLORS.SURFACE};
  }
  input {
    border: none;
    color: ${({ theme }) => theme.COLORS.SURFACE};
    background: ${({ theme }) => theme.COLORS.COLOR_GREY_PAYNE};
  }
`

const Back = styled(ArrowLeftSVG)`
  cursor: pointer;
  margin-bottom: 30px;
`

const Trash = styled(TrashSVG)`
  margin-top: 20px;
  margin-left: 10px;
  cursor: pointer;
`

const IconButton = styled(IconButtonComponent)`
  margin-top: 20px;
`

export default {
  Wrapper,
  List,
  Toggle,
  FormItem,
  FormItemParameter,
  Input,
  Back,
  Trash,
  IconButton,
}
