import styled from 'styled-components'
import { Input } from 'containers/FinalForm'
import { Button } from 'components/Button'
import { IconButton } from 'components/IconButton'
import TrashSVG from 'core/assets/svg/trash-gray.svg'

export const containerWidth = 800

const Wrapper = styled.div`
  background: ${({ theme }) => theme.COLORS.COLOR_BLACK};
  min-height: 100vh;
`

const Actions = styled.div`
  display: flex;
`

const Content = styled.div`
  width: 100%;
  padding: 100px 0px 50px 30px;
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 0;
  flex-direction: column;
`

const EditorWrapper = styled.div`
  height: 150px;
  max-width: ${containerWidth}px;
  margin-top: 30px;
`

const ParametersFormWrapper = styled.div`
  max-width: 600px;
`

const ParametersForm = styled.div`
  margin-top: 20px;
  display: flex;

  div:first-of-type {
    margin-right: 15px;
  }
`

const StyledInput = styled(Input)`
  flex: 1;
  
  label {
    font-size: 12px;
  }
  input {
    background: ${({ theme }) => theme.COLORS.PRIMARY_DARK};
    color: ${({ theme }) => theme.COLORS.SURFACE};
  }

`

const Trash = styled(TrashSVG)`
  cursor: pointer;
  margin-top: 10px;
`

const Footer = styled.div`
  margin-top: 20px;
`

const ResultWrapper = styled.div`
  margin-top: 20px;
  width: ${containerWidth}px;
  margin-top: 20px;
`

const ResultTitle = styled.span`
  font-size: 20px;
`

const ResultHead = styled.div`
  display: flex;
  height: 50px;
  padding-left: 30px;
  align-items: center;
`

const ResultItem = styled.div`
  background: ${({ theme }) => theme.COLORS.PRIMARY};
  display: flex;
  padding-left: 30px;
  align-items: center;
  height: 60px;
  border-left: 2px solid ${({ theme }) => theme.COLORS.SURFACE};
`

const ResultViewButton = styled(Button)`
  height: 40px;
  width: 120px;
  justify-content: center;
  border-radius: 20px;
  border-color: #F2F2F7;
  color: #F2F2F7;
`

const CircleName = styled.div`
  width: 30%;
`

const CircleID = styled.div`
  width: 50%;
`

const CircleView = styled.div`
  width: 20%;
`

const CirclesLoaderWrapper = styled.div`
  margin-top: 20px;
  width: ${containerWidth}px;
`

const StyledIconButton = styled(IconButton)`
  margin-top: 10px;
`

export default {
  Wrapper,
  Content,
  Actions,
  EditorWrapper,
  ParametersForm,
  ParametersFormWrapper,
  Input: StyledInput,
  Trash,
  Footer,
  ResultTitle,
  ResultWrapper,
  ResultHead,
  ResultItem,
  ResultViewButton,
  CircleName,
  CircleID,
  CircleView,
  CirclesLoaderWrapper,
  IconButton: StyledIconButton,
}
