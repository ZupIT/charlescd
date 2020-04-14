import React from 'react'
import styled, { css } from 'styled-components'
import {
  Input as InputComponent,
  Select as SelectComponent,
  Checkbox as CheckboxComponent,
} from 'containers/FinalForm'
import { Button } from 'components/Button'
import TrashSvg from 'core/assets/svg/trash.svg'
import PlusBlue from 'core/assets/svg/plus-light-surface.svg'
import ArrowOperatorSvg from 'core/assets/svg/arrow-operator.svg'

const Wrapper = styled.div`
  display: inline-block;
  min-width: 574px;
`

const Group = styled.div`
  display: flex;
`

const ConditionalWrapper = styled.div`
  position: relative;
  display: flex;
  width: 100px;
  align-items: center;
  justify-content: center;
  z-index: ${({ theme }) => theme.Z_INDEX.OVER_1};  
`

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;

  > button:last-child {
    margin: ${({ hasOperator }) => hasOperator ? '0 325px 0 20px' : '0 226px 0 20px'};
  }
`

const ButtonAction = styled(Button)`
  min-width: 95px;
  justify-content: center;
`

const Checkbox = styled(CheckboxComponent)`
  position: absolute;
  width: 100%;
  height: 100%;
  right: 0;

  input {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    margin: 0;
    padding: 0;
    opacity: 0;
    cursor: pointer;
    z-index: ${({ theme }) => theme.Z_INDEX.OVER_1};
  }
`

const ConditionalToggle = styled.div`
  position: relative;
  display: flex;
  width: 46px;
  height: 18px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.COLORS.COLOR_GREY_PAYNE};
  font-size: 11px;
  background-color: ${({ theme }) => theme.COLORS.COLOR_BLACK_MARLIN};
  color: ${({ theme }) => theme.COLORS.SURFACE};
  justify-content: center;
  align-items: center;
  margin: ${({ isViewMode }) => isViewMode ? '0 0 8px 30px' : '0 0 55px 30px'};
  
  padding: 0 5px;
  box-sizing: border-box;
`

const ArrowOperator = styled(({ right, ...rest }) => <ArrowOperatorSvg {...rest} />)`
  ${({ right }) => right && css`
    transform: rotate(180deg);
  `}
`

const ClausesWrapper = styled.div``

const Clause = styled.div`
  position: relative;
  background-color: ${({ theme }) => theme.COLORS.COLOR_BLACK_MARLIN};
  padding: 14px 0 11px 14px;
  margin-bottom: 20px;
  border-radius: 9.6px;
  z-indez: 999;

  ${({ hasGroups, theme }) => hasGroups && css`
    :before {
      position: absolute;
      content: '';
      width: 66px;
      height: 60%;
      top: 50%;
      right: -66px;
      border-top: 1.5px solid ${theme.COLORS.COLOR_GREY_PAYNE};
      border-right: 1.5px solid ${theme.COLORS.COLOR_GREY_PAYNE};
    }
    
    :after {
      position: absolute;
      content: '';
      width: 66px;
      height: 60%;
      bottom: 49.5%;
      right: -66px;
      border-right: 1.5px solid ${theme.COLORS.COLOR_GREY_PAYNE};
    }
    
    :first-child:after {
      border-right: 0;
    }
    
    :last-child:before {
      border-right: 0;
    }
  `}
`

const Rules = styled.div`
  display: flex;
  min-width: 512px;
`

const RuleWrapper = styled.div`
  display: inline-block;
  
  form:last-child > div {
    margin-bottom: 0px;
  }
`

const Rule = styled.div`
  position: relative;
  display: flex;
  margin-bottom: 8px;
  
  ${({ justOne, isFirst, theme }) => !justOne && css`
    :before {
      position: absolute;
      content: '';
      width: 66px;
      height: 48px;
      bottom: 19px;
      left: 460px;
      border-bottom: 1.5px solid ${theme.COLORS.COLOR_GREY_PAYNE};
      ${!isFirst && css`
        border-right: 1.5px solid ${theme.COLORS.COLOR_GREY_PAYNE};  
      `};
    }
  `};
`

const Form = styled.div`
  display: flex;
  width: 460px;
  justify-content: space-between;
`

const Input = styled(InputComponent)`
  width: 141px;
  background-color: ${({ theme }) => theme.COLORS.COLOR_GREY_PAYNE};
`

const Select = styled(SelectComponent)`
  width: 141px;
`

const RemoveRule = styled(({ enable, ...rest }) => <TrashSvg {...rest} />)`
  position: absolute;
  padding: 5px;
  top: 7px;
  left: 469px;
  cursor: ${({ enable }) => enable ? 'pointer' : 'not-allowed'};
  border-radius: 50%;
  border: 1.5px solid ${({ theme }) => theme.COLORS.COLOR_GREY_PAYNE};
  background: ${({ theme }) => theme.COLORS.COLOR_BLACK_MARLIN};
  z-index: ${({ theme }) => theme.Z_INDEX.OVER_2};
  
  ${({ enable }) => !enable && css`
    border: none;

    > path {
      opacity: .251;
    }
  `};
`

const AddRuleWrapper = styled.div`
  display: inline-flex;
  justify-content: flex-start;
  width: 460px;
`

const AddRuleButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border-radius: 50%;
  margin: 11px auto 0;
  
  span {
    display: none;
  }
  
  :hover {
    span {
      display: block;
    }

    svg {
      display: none;
    }

    transition: width .2s ease-in-out;
    width: 116px;
    border-radius: 18px;
    box-shadow: none;
  } 
`

const Plus = styled(PlusBlue)`
  width: 12px;
  color: ${({ theme }) => theme.COLORS.SURFACE};
`

const HeaderWrapper = styled.div`
  display: flex;
  ${({ haveAnyClause }) => haveAnyClause && css`
    margin-left: 90px;
  `};

  ${({ hasGroupAndClause }) => hasGroupAndClause && css`
    margin-left: 180px;
  `};
`

const HeaderText = styled.span`
  display: block;
  width: 141px;
  font-size: 12px;
  margin: 0 0 10px 17px;
  color: ${({ theme }) => theme.COLORS.COLOR_STORM_GREY};
`

export const StyledProfile = {
  Wrapper,
  Group,
  Select,
  Input,
  RemoveRule,
  Header: {
    Wrapper: HeaderWrapper,
    Text: HeaderText,
  },
  AddRule: {
    Wrapper: AddRuleWrapper,
    Button: AddRuleButton,
  },
  Plus,
  Operator: {
    Checkbox,
  },
  Conditional: {
    Wrapper: ConditionalWrapper,
    Toggle: ConditionalToggle,
    ArrowOperator,
  },
  Clauses: {
    Wrapper: ClausesWrapper,
    Clause,
    Rules,
    Rule,
    RuleWrapper,
    Form,
  },
  Button: {
    Wrapper: ButtonWrapper,
    Button: ButtonAction,
  },
}
