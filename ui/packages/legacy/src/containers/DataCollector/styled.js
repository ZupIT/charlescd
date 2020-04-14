import styled from 'styled-components'
import Select from 'react-select'
import ReactJson from 'react-json-view'
import Title from '../../components/Title'

const JsonDataContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.COLORS.COLOR_GHOST_WHITE};
`

const JsonBoxContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  margin-left: 150px;
  margin-top: -220px;
`

const JsonContainer = styled.div`
  display: flex;
  flex-direction: row;
`

const SwitchsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 6px;
  width: 500px;
  margin-right: 30px;
  background-color: ${({ theme }) => theme.COLORS.COLOR_WHITE};
  box-shadow: 0 10px 10px 0 ${({ theme }) => theme.COLORS.COLOR_GREY};
  padding: 20px 40px 40px 40px;
`

const SwitchContainer = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;

  & > label {
    display: flex;
    align-items: center;
  }

  & > span {
    margin-left: 4px;
    font-size: 14px;
    text-transform: capitalize;
    color: ${({ theme }) => theme.COLORS.COLOR_PAYNES_GREY};
  }
`

const JsonResume = styled.div`
  padding: 20px 40px 40px 40px;
  background-color: ${({ theme }) => theme.COLORS.COLOR_GREEN_WATERLOO};
  width: 500px;
 `

const JsonResumeTitle = styled(Title)`
  color: ${({ theme }) => theme.COLORS.COLOR_WHITE};
  font-size: 16px;
`

const FieldsTitle = styled(Title)`
  font-size: 16px;
`

const SwitchLoadingContainer = styled.div`
  width: 500px;
  background-color: ${({ theme }) => theme.COLORS.COLOR_WHITE};
  margin-right: 30px;
  padding: 20px 40px 40px 40px;
  box-shadow: 0 10px 10px 0 ${({ theme }) => theme.COLORS.COLOR_GREY};
`

const ResumeLoadingContainer = styled.div`
  width: 500px;
  background-color: ${({ theme }) => theme.COLORS.COLOR_GREEN_WATERLOO};
  box-shadow: 0 10px 10px 0 ${({ theme }) => theme.COLORS.COLOR_GREY};
  padding: 20px 40px 40px 40px;
`

export const StyledSelect = styled(Select)`
  width: 200px;
  margin-bottom: 30px;
`

export const StyledReactJson = styled(ReactJson)`
  height: auto;
  margin-top: 30px;
`

export const StyledDataCollector = {
  ResumeLoadingContainer,
  SwitchLoadingContainer,
  FieldsTitle,
  JsonResumeTitle,
  JsonResume,
  SwitchContainer,
  SwitchsContainer,
  JsonContainer,
  JsonBoxContainer,
  JsonDataContainer,
}
