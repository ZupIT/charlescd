import styled from 'styled-components'
import TrashSvg from 'core/assets/svg/trash.svg'
import Resume from 'components/Resume'

const ResumeWrapper = styled.div`
  align-items: center;
  display: ${({ file }) => file ? 'flex' : 'none'}
  margin-top: 10px;
  color: ${({ theme }) => theme.COLORS.COLOR_GREY_PAYNE};
`

const ResumeComponent = styled(Resume)`
  > div {
    width: 80px;
    padding: 0 0 0 20px;
  }
`

const TrashIcon = styled(TrashSvg)`
  margin-left: 20px;
  cursor: pointer;
`

const InputWrapper = styled.div`
  display: ${({ file }) => file ? 'none' : 'block'}
`

const Input = styled.input`
  display: none;
`

export default {
  ResumeWrapper,
  TrashIcon,
  Input,
  InputWrapper,
  ResumeComponent,
}
