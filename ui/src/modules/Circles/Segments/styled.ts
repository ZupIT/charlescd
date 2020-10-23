/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import styled, { css } from 'styled-components';
import {
  Input as InputComponent,
  Select as SelectComponent
} from 'core/components/Form';
import Button from 'core/components/Button';
import Icon from 'core/components/Icon';
import {
  RULE_SIZE,
  BUTTON_RULE_MARGIN,
  RULE_OPERATOR
} from '../Segments/constants';

const Form = styled.form`
  width: 470px;
`;

interface GroupProps {
  verticalLine?: number;
  top?: number;
  hasGroup?: boolean;
  viewMode?: boolean;
}

const Group = styled.div<GroupProps>`
  position: relative;

  ${({ verticalLine, top, theme, hasGroup, viewMode }) =>
    !viewMode &&
    hasGroup &&
    css`
      ::before {
        position: absolute;
        content: '';
        width: 1px;
        right: -80px;
        top: ${top}px;
        height: ${verticalLine}px;
        background-color: ${theme.segments.line};
      }
    `}
`;

interface ClauseProps {
  verticalLine: number;
  horizontalLine: number;
  hasGroup?: boolean;
  viewMode?: boolean;
}
const Clause = styled.div<ClauseProps>`
  position: relative;

  ::before {
    display: ${({ viewMode }) => (viewMode ? 'none' : 'block')};
    position: absolute;
    content: '';
    width: 1px;
    right: -40px;
    top: ${RULE_SIZE}px;
    height: ${({ verticalLine }) => `${verticalLine}px`};
    background-color: ${({ theme }) => theme.segments.line};
  }

  ${({ hasGroup, horizontalLine, theme, viewMode }) =>
    hasGroup &&
    css`
      ::after {
        position: absolute;
        display: ${viewMode ? 'none' : 'block'};
        content: '';
        width: 40px;
        height: 1px;
        right: -80px;
        top: ${`${horizontalLine}px`};
        background-color: ${theme.segments.line};
      }
    `}
`;

const IconButton = styled(Icon)`
  display: flex;
  margin-bottom: 6px;
  cursor: pointer;
`;

const RuleTrash = styled.div`
  display: none;
  position: absolute;
  width: 40px;
  height: 40px;
  left: -40px;
  align-items: flex-end;
  justify-content: center;
`;

interface RuleProps {
  isGroup?: boolean;
  hasGroups?: boolean;
  viewMode?: boolean;
}
const Rule = styled.div<RuleProps>`
  display: flex;
  position: relative;
  height: ${RULE_SIZE}px;
  box-sizing: border-box;
  padding-top: 20px;
  justify-content: space-between;

  :hover ${RuleTrash} {
    display: ${({ viewMode }) => (viewMode ? 'none' : 'flex')};
  }

  ${({ hasGroups, isGroup, theme, viewMode }) =>
    hasGroups &&
    css`
      ::after {
        position: absolute;
        display: ${viewMode ? 'none' : 'block'};
        width: ${isGroup ? '80px' : '40px'};
        border-bottom: 1px solid ${theme.segments.line};
        bottom: 0;
        right: ${isGroup ? '-80px' : '-40px'};
        content: '';
      }
    `}
`;

const Input = styled(InputComponent)`
  width: 130px;
`;

interface CheckBoxProps {
  top?: number;
  isClause?: boolean;
  hasGroup?: boolean;
}
const Operator = styled(Button.Default)<CheckBoxProps>`
  position: absolute;
  width: 53px;
  display: ${({ hasGroup }) => (hasGroup ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  height: ${RULE_OPERATOR}px;
  top: ${({ top }) => `${top}px`};
  right: ${({ isClause }) => (isClause ? '-66px' : '-106px')};
  background-color: ${({ theme }) => theme.segments.operator};
  z-index: ${({ theme }) => theme.zIndex.OVER_1};
  border-radius: 4px;
  padding: 0;
`;

const InputOperator = styled(InputComponent)`
  width: 53px;
  height: 24px;

  > input {
    border: none;
    background-color: transparent;
    text-align: center;
    font-size: 10px;
    padding: 0;
    right: 0;
    height: 24px;
    cursor: pointer;
  }
`;

const Select = styled(SelectComponent.Single)`
  width: 130px;
  margin: 0 40px;
`;

const ClauseButton = styled(Button.Default)`
  display: flex;
  align-items: center;
  border: 1px solid #fff;
  background-color: transparent;
  margin-top: ${BUTTON_RULE_MARGIN}px;
  margin-left: 0px;

  > i {
    margin-right: 5px;
  }
`;

const SubmitButton = styled(Button.Default)`
  margin-top: 40px;
`;

export default {
  Form,
  Group,
  Clause,
  Rule,
  Input,
  RuleTrash,
  InputOperator,
  Operator,
  Select,
  Button: {
    Submit: SubmitButton,
    Clause: ClauseButton,
    Icon: IconButton
  }
};
