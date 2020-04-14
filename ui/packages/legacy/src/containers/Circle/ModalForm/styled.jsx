import React from 'react'
import styled, { css } from 'styled-components'
import CircleSVG from 'core/assets/svg/circle.svg'
import PlusLightSVG from 'core/assets/svg/plus-light.svg'
import ArrowLeftBlueSVG from 'core/assets/svg/icon-arrow-left.svg'
import StepByStepImportSVG from 'core/assets/img/step-by-step-import-csv.svg'
import TrashSVG from 'core/assets/svg/trash-gray.svg'
import LoadingSVG from 'core/assets/svg/loading-blue.svg'
import SortSVG from 'core/assets/svg/sort-left.svg'
import { ModalOverlayed, ContentLayer, Button } from 'components'
import ReleaseComponent from 'components/Release'
import Title from 'components/Title'
import Profile from 'containers/Circle/Form/Profile'
import { Input as FormInput } from 'components/FormV2/Input'

const Modal = styled(ModalOverlayed)`
  display: flex;
  background-color: ${({ theme }) => theme.COLORS.PRIMARY_DARK};
  min-height: 800px;
`

const Wrapper = styled.div`
  width: 820px;
  padding: 80px 0 80px 80px;
`

const UnfocusedWrapper = styled.div`
  width: 100%;
  background-color: rgba(58, 58, 60, 0.9);
  position: absolute;
  z-index: 3;
  min-height: 100%;
`

const Content = styled(ContentLayer)`
  margin-bottom: 35px;
`

const Step = styled(({ step, ...rest }) => <div {...rest} />)`
  position: relative;

  ${({ step }) => !step && css`
    :before {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      opacity: 0.6;
      z-index: ${({ theme }) => theme.Z_INDEX.OVER_1};
      background-color: ${({ theme }) => theme.COLORS.PRIMARY_DARK};
    }
  `};
`

const MenuWrapper = styled.ul`
  display: ${({ enable }) => enable ? 'block' : 'none'};
  list-style: none;
  width: 220px;
  margin-top: 95px;
`

const MenuTitle = styled.li`
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 18px;
`

const MenuItem = styled.li`
  display: flex;
  cursor: pointer;
  font-size: 13px;
  align-items: center;
  margin-bottom: 13px;

  svg {
    margin-right: 10px;
  }
`

const Form = styled.form`
  display: flex;
  align-items: center;
  margin-top: -12px;

  div {
    height: 45px;
    margin: 0;
  }
`

const CircleIcon = styled(CircleSVG)`
  margin-top: 0px;
`

const Name = styled.h3`
  font-weight: 400;
  padding: 0;
  margin-left: 15px;
`

const Input = styled(FormInput)`
  width: 760px;
  border: none;

  input {
    color: ${({ theme }) => theme.COLORS.SURFACE};
  }
`

const Flex = styled.div`
  display: flex;
`

const SegmentInfo = styled.div`
  display: flex;
  padding-bottom: 10px;
  align-items: flex-end;

  h3 {
    padding: 0 5px 0 0;
  }
`

const Release = styled(ReleaseComponent)`
  width: 280px;
`

const ButtonBorder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  background: ${({ theme }) => theme.COLORS.COLOR_DARK_CERULEAN};
`

const ReleaseButton = styled(Button)`
  border-radius: 50%;
  width: 40px;
  height: 40px;
  padding: 0;
  display: flex;
  justify-content: center;
  background: ${({ theme }) => theme.COLORS.PRIMARY};
`

const PlusIcon = styled(PlusLightSVG)`
  width: 15px;
`

const ArrowBack = styled(ArrowLeftBlueSVG)`
  cursor: pointer;
  margin-bottom: 35px;
`

const StyledTitle = styled(Title)`
  font-weight: 500;
  padding-bottom: 30px;
`

const AddReleaseWrapper = styled.div`
  margin-left: 5px;
`

const Display = styled(({ display, enable, margin, ...rest }) => <div {...rest} />)`
  display: ${({ display = 'flex', enable }) => enable ? display : 'none'};
  ${({ margin }) => margin && css`
    margin: ${margin};
  `};
`

const FormRelease = styled.form`
  display: block;
  width: 500px;
  margin-top: 20px;

  div {
    height: 41px;
    margin-left: 0;
  }
`

const Prefix = styled.div`
  min-width: 125px;
  height: 41px;
  line-height: 41px;
  text-align: center;
  color: ${({ theme }) => theme.COLORS.SURFACE};
  border: 2px solid ${({ theme }) => theme.COLORS.COLOR_BLACK_MARLIN};
  background-color: ${({ theme }) => theme.COLORS.COLOR_BLACK_MARLIN};
  border-right: none;
`

const StepByStepImportCSV = styled(StepByStepImportSVG)`
  margin-top: 18px;
  margin-bottom: 18px;
`

const FormImportCSV = styled(({ isUploading, ...rest }) => <form {...rest} />)`
  display: block;

  ${({ isUploading }) => isUploading && css`
    opacity: 0.6;
    pointer-events: none;
  `};
`

const OuterProgessBar = styled.div`
  background: ${({ theme }) => theme.COLORS.COLOR_DARK_CERULEAN};
  height: 4px;
  width: 185px;
  border-radius: 50px;
`

const ProgessBarFiller = styled.div`
  background: ${({ theme }) => theme.COLORS.COLOR_BLURPLE};
  border-radius: inherit;
  height: 100%;
  width: ${({ percentage }) => percentage}%;
  transition: width .2s ease-in;
`

const WrapperProgessBar = styled.div`
  margin-bottom: 15px;
`

const Warning = styled.div`
  background: ${({ theme }) => theme.COLORS.COLOR_RED_ORANGE};
  height: 172px;
  width: 534px;
  border-radius: 5px;
  margin-bottom: 15px;
  display: flex;
  position: absolute;
  z-index: 4;
  padding: 19px 0 0 19px;

  svg {
    background: yellow;
    border-radius: inherit;
  }
`
const WarningSpaceHolder = styled.div`
  height: 172px;
  width: 534px;
  border-radius: 5px;
  display :flex;

  svg {
    background: yellow;
    border-radius: inherit;
  }
`

const WarningMessage = styled.div`
  padding-left: 20px;

  h3 {
    color: white;
  }

  p {
    font-size: 14px;
    color: white;
  }
`

const WarningButtonDiv = styled.div`
  display: flex;
`

const WarningButton = styled(Button)`
  margin-right: 25px;
  justify-content: center;
  border: 1px solid ${({ theme }) => theme.COLORS.COLOR_WHITE};
  background: ${({ theme, warning }) => warning ? 'transparent' : theme.COLORS.COLOR_WHITE};
  color: ${({ theme, warning }) => warning ? theme.COLORS.COLOR_WHITE : theme.COLORS.COLOR_BLACK};
`

const ProfileComponent = styled(Profile)`
  margin-top: 5px;
  ${({ disableProfile }) => disableProfile && css`
    opacity: 0.6;
    pointer-events: none;
  `};
`

const Select = styled.div`
  width: ${({ width }) => width || '240px'};
  margin-right: 15px;
`

const Error = styled.small`
  color: ${({ theme }) => theme.COLORS.COLOR_RED_ORANGE};
`

const Trash = styled(TrashSVG)`
  cursor: pointer;
  margin-top: 28px;
`

const Label = styled.small`
  display: block;
  margin-bottom: 10px;
`

const Search = styled.div`
  position: relative;
`

const SearchLoading = styled(({ isLoading, ...rest }) => <LoadingSVG {...rest} />)`
  position: absolute;
  display: ${({ isLoading }) => isLoading ? 'block' : 'none'};
  width: 25px;
  height: 25px;
  top: 35px;
  left: 270px;
`

const TotalEntriesText = styled.small`
  margin-left: 15px;
  position: relative;
  top: -10px;
`

const ImportedAtCSV = styled.small`
  margin-bottom: 2px;
`

const SortLeft = styled(SortSVG)`
  cursor: pointer;
  transform: rotate(90deg);
`

const SortRight = styled(SortSVG)`
  cursor: pointer;
  transform: rotate(-90deg);
`

const MetricsTitle = styled.div`
  display: flex;
  justify-content: space-between;
 
`

const MetricsControl = styled.div`
  display: flex;
  align-content: center;
  font-size: 12px;
`

const MetricsLabel = styled.div`
  margin-right: 10px;
`

const Chart = styled.div`
  background: #000;
  padding: 30px;
`

export default {
  Flex,
  Modal,
  Release,
  Menu: {
    Wrapper: MenuWrapper,
    Item: MenuItem,
    Title: MenuTitle,
  },
  UnfocusedWrapper,
  Wrapper,
  Content,
  Step,
  Form,
  Input,
  CircleIcon,
  Name,
  SegmentInfo,
  ReleaseButton,
  ButtonBorder,
  PlusIcon,
  AddReleaseWrapper,
  ArrowBack,
  Display,
  Title: StyledTitle,
  FormRelease,
  Prefix,
  StepByStepImportCSV,
  FormImportCSV,
  OuterProgessBar,
  ProgessBarFiller,
  WrapperProgessBar,
  Warning,
  WarningSpaceHolder,
  WarningMessage,
  WarningButtonDiv,
  WarningButton,
  ProfileComponent,
  Select,
  Error,
  Trash,
  Label,
  Search,
  SearchLoading,
  TotalEntriesText,
  ImportedAtCSV,
  Chart,
  MetricsLabel,
  MetricsTitle,
  MetricsControl,
  SortLeft,
  SortRight,
}
