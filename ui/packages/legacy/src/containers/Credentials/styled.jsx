import React from 'react'
import styled, { css } from 'styled-components'
import { Input as InputFinalForm, Select as SelectFinalForm } from 'containers/FinalForm'
import { CardBox as CardBoxComponent } from 'components/CardBox'
import { Button, ModalFullContent } from 'components'
import TitleComponent from 'components/Title'
import PlusLightSVG from 'core/assets/svg/plus-light.svg'
import SidebarStyled from 'components/Sidebar/styled'

const Block = styled.div`
  ${({ margin }) => margin && css`
    margin-bottom: 20px;
  `}
  ${({ center }) => center && css`
    text-align: center;
  `}

`

const Flex = styled.div`
  display: flex;
`

const Step = styled(({ step, ...rest }) => <div {...rest} />)`
  display: ${({ step }) => step ? 'block' : 'none'};
  margin-bottom: 15px;
`

const Form = styled.div`
  display: ${({ display }) => display || 'flex'};
  align-items: flex-end;
`

const Input = styled(InputFinalForm)`
  width: 350px;
`

const InputWrapper = styled.div`
  margin: 10px 0;
`

const ToggleList = styled.div`
  display: flex;
  margin-bottom: 20px;
`

const Select = styled(SelectFinalForm)``

const Cards = styled.div`
  display: flex;
  width: 860px;
  flex-wrap: wrap;
`

const CardBox = styled(CardBoxComponent)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 1px;
  min-width: 145px;
  min-height: 158px;
  width: 145px;
  height: 158px;
  background-color: ${({ theme }) => theme.COLORS.PRIMARY_DARK};

  ${({ button }) => !button && css`
    background-color: ${({ theme }) => theme.COLORS.PRIMARY_DARK};
  `};
  margin: 0 20px 40px 0;
`

const CardText = styled.div`
  color: ${({ theme }) => theme.COLORS.SURFACE};
  font-size: 14px;
  text-align: center;
  margin-top: 8px;
`

const Title = styled(TitleComponent)`
  font-size: 20px;
  font-weight: 400;
  padding-bottom: 10px;
  margin-left: 0 !important;
`

const ConfigButton = styled(Button)`
  display: flex;
  justify-content: center;
  border-radius: 50%;
  padding: 0;
  width: 36px;
  height: 36px;
  margin: auto;
  background: ${({ theme }) => theme.COLORS.COLOR_GREY_COMET};
`

const Plus = styled(PlusLightSVG)`
  width: 15px;
`

const ModalContent = styled(ModalFullContent)`
  margin-left: 150px;
  width: calc(100vw - ${SidebarStyled.OPEN_WIDTH});
`

export const StyledConfig = {
  Block,
  Flex,
  Step,
  Form,
  Input,
  InputWrapper,
  ToggleList,
  Select,
  Cards,
  Plus,
  ModalContent,
  Config: {
    Title,
    Button: ConfigButton,
  },
  Card: {
    Box: CardBox,
    Text: CardText,
  },
}
