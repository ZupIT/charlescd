import styled from 'styled-components'
import { Input } from 'containers/FinalForm'
import { Button } from 'components/Button'
import PlusLightBlueIcon from 'core/assets/svg/plus-light-blue.svg'

const Wrapper = styled.div`
  margin: 0 0 20px;
`

const NameWrapper = styled.div`
  display: flex;
  align-items: flex-end;
`

const NameInput = styled(Input)`
  display: inline-block;
  width: 326px;
  margin-right: 20px;
`

const NameButton = styled(Button)`
  padding: 0 25px;
  cursor: pointer;
`

const DescriptionIcon = styled(PlusLightBlueIcon)`
  width: 11px;
  margin-right: 10px;
`

const DescriptionInfo = styled.span`
  color: ${({ theme }) => theme.COLORS.COLOR_CHAMBRAY};
  font-size: 12px;
  display: block;
`

export const StyledForm = {
  Wrapper,
  Name: {
    Wrapper: NameWrapper,
    Input: NameInput,
    Button: NameButton,
  },
  Description: {
    Icon: DescriptionIcon,
    Info: DescriptionInfo,
  },
}
