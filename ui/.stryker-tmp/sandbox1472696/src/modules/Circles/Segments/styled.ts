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
// @ts-nocheck

function stryNS_9fa48() {
  var g = new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});

  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }

  function retrieveNS() {
    return ns;
  }

  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}

stryNS_9fa48();

function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });

  function cover() {
    var c = cov.static;

    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }

    var a = arguments;

    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }

  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}

function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();

  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }

      return true;
    }

    return false;
  }

  stryMutAct_9fa48 = isActive;
  return isActive(id);
}

import styled, { css } from 'styled-components';
import { Input as InputComponent, Select as SelectComponent } from 'core/components/Form';
import ButtonDefault from 'core/components/Button/ButtonDefault';
import Icon from 'core/components/Icon';
import { RULE_SIZE, BUTTON_RULE_MARGIN, RULE_OPERATOR } from '../Segments/constants';
const Form = stryMutAct_9fa48("3934") ? styled.form`` : (stryCov_9fa48("3934"), styled.form`
  width: 470px;
`);
interface GroupProps {
  verticalLine?: number;
  top?: number;
  hasGroup?: boolean;
  viewMode?: boolean;
}
const Group = stryMutAct_9fa48("3935") ? styled.div<GroupProps>`` : (stryCov_9fa48("3935"), styled.div<GroupProps>`
  position: relative;

  ${stryMutAct_9fa48("3936") ? () => undefined : (stryCov_9fa48("3936"), ({
  verticalLine,
  top,
  theme,
  hasGroup,
  viewMode
}) => stryMutAct_9fa48("3939") ? !viewMode && hasGroup || css`
      ::before {
        position: absolute;
        content: '';
        width: 1px;
        right: -80px;
        top: ${top}px;
        height: ${verticalLine}px;
        background-color: ${theme.segments.line};
      }
    ` : stryMutAct_9fa48("3938") ? false : stryMutAct_9fa48("3937") ? true : (stryCov_9fa48("3937", "3938", "3939"), (stryMutAct_9fa48("3942") ? !viewMode || hasGroup : stryMutAct_9fa48("3941") ? false : stryMutAct_9fa48("3940") ? true : (stryCov_9fa48("3940", "3941", "3942"), (stryMutAct_9fa48("3943") ? viewMode : (stryCov_9fa48("3943"), !viewMode)) && hasGroup)) && (stryMutAct_9fa48("3944") ? css`` : (stryCov_9fa48("3944"), css`
      ::before {
        position: absolute;
        content: '';
        width: 1px;
        right: -80px;
        top: ${top}px;
        height: ${verticalLine}px;
        background-color: ${theme.segments.line};
      }
    `))))}
`);
interface ClauseProps {
  verticalLine: number;
  horizontalLine: number;
  hasGroup?: boolean;
  viewMode?: boolean;
}
const Clause = stryMutAct_9fa48("3945") ? styled.div<ClauseProps>`` : (stryCov_9fa48("3945"), styled.div<ClauseProps>`
  position: relative;

  ::before {
    display: ${stryMutAct_9fa48("3946") ? () => undefined : (stryCov_9fa48("3946"), ({
  viewMode
}) => viewMode ? stryMutAct_9fa48("3947") ? "" : (stryCov_9fa48("3947"), 'none') : stryMutAct_9fa48("3948") ? "" : (stryCov_9fa48("3948"), 'block'))};
    position: absolute;
    content: '';
    width: 1px;
    right: -40px;
    top: ${RULE_SIZE}px;
    height: ${stryMutAct_9fa48("3949") ? () => undefined : (stryCov_9fa48("3949"), ({
  verticalLine
}) => stryMutAct_9fa48("3950") ? `` : (stryCov_9fa48("3950"), `${verticalLine}px`))};
    background-color: ${stryMutAct_9fa48("3951") ? () => undefined : (stryCov_9fa48("3951"), ({
  theme
}) => theme.segments.line)};
  }

  ${stryMutAct_9fa48("3952") ? () => undefined : (stryCov_9fa48("3952"), ({
  hasGroup,
  horizontalLine,
  theme,
  viewMode
}) => stryMutAct_9fa48("3955") ? hasGroup || css`
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
    ` : stryMutAct_9fa48("3954") ? false : stryMutAct_9fa48("3953") ? true : (stryCov_9fa48("3953", "3954", "3955"), hasGroup && (stryMutAct_9fa48("3956") ? css`` : (stryCov_9fa48("3956"), css`
      ::after {
        position: absolute;
        display: ${viewMode ? stryMutAct_9fa48("3957") ? "" : (stryCov_9fa48("3957"), 'none') : stryMutAct_9fa48("3958") ? "" : (stryCov_9fa48("3958"), 'block')};
        content: '';
        width: 40px;
        height: 1px;
        right: -80px;
        top: ${stryMutAct_9fa48("3959") ? `` : (stryCov_9fa48("3959"), `${horizontalLine}px`)};
        background-color: ${theme.segments.line};
      }
    `))))}
`);
const IconButton = stryMutAct_9fa48("3960") ? styled(Icon)`` : (stryCov_9fa48("3960"), styled(Icon)`
  display: flex;
  margin-bottom: 6px;
  cursor: pointer;
`);
const RuleTrash = stryMutAct_9fa48("3961") ? styled.div`` : (stryCov_9fa48("3961"), styled.div`
  display: none;
  position: absolute;
  width: 40px;
  height: 40px;
  left: -40px;
  align-items: flex-end;
  justify-content: center;
`);
interface RuleProps {
  isGroup?: boolean;
  hasGroups?: boolean;
  viewMode?: boolean;
}
const Rule = stryMutAct_9fa48("3962") ? styled.div<RuleProps>`` : (stryCov_9fa48("3962"), styled.div<RuleProps>`
  display: flex;
  position: relative;
  height: ${RULE_SIZE}px;
  box-sizing: border-box;
  padding-top: 20px;
  justify-content: space-between;

  :hover ${RuleTrash} {
    display: ${stryMutAct_9fa48("3963") ? () => undefined : (stryCov_9fa48("3963"), ({
  viewMode
}) => viewMode ? stryMutAct_9fa48("3964") ? "" : (stryCov_9fa48("3964"), 'none') : stryMutAct_9fa48("3965") ? "" : (stryCov_9fa48("3965"), 'flex'))};
  }

  ${stryMutAct_9fa48("3966") ? () => undefined : (stryCov_9fa48("3966"), ({
  hasGroups,
  isGroup,
  theme,
  viewMode
}) => stryMutAct_9fa48("3969") ? hasGroups || css`
      ::after {
        position: absolute;
        display: ${viewMode ? 'none' : 'block'};
        width: ${isGroup ? '80px' : '40px'};
        border-bottom: 1px solid ${theme.segments.line};
        bottom: 0;
        right: ${isGroup ? '-80px' : '-40px'};
        content: '';
      }
    ` : stryMutAct_9fa48("3968") ? false : stryMutAct_9fa48("3967") ? true : (stryCov_9fa48("3967", "3968", "3969"), hasGroups && (stryMutAct_9fa48("3970") ? css`` : (stryCov_9fa48("3970"), css`
      ::after {
        position: absolute;
        display: ${viewMode ? stryMutAct_9fa48("3971") ? "" : (stryCov_9fa48("3971"), 'none') : stryMutAct_9fa48("3972") ? "" : (stryCov_9fa48("3972"), 'block')};
        width: ${isGroup ? stryMutAct_9fa48("3973") ? "" : (stryCov_9fa48("3973"), '80px') : stryMutAct_9fa48("3974") ? "" : (stryCov_9fa48("3974"), '40px')};
        border-bottom: 1px solid ${theme.segments.line};
        bottom: 0;
        right: ${isGroup ? stryMutAct_9fa48("3975") ? "" : (stryCov_9fa48("3975"), '-80px') : stryMutAct_9fa48("3976") ? "" : (stryCov_9fa48("3976"), '-40px')};
        content: '';
      }
    `))))}
`);
const Input = stryMutAct_9fa48("3977") ? styled(InputComponent)`` : (stryCov_9fa48("3977"), styled(InputComponent)`
  width: 130px;
`);
interface CheckBoxProps {
  top?: number;
  isClause?: boolean;
  hasGroup?: boolean;
}
const Operator = stryMutAct_9fa48("3978") ? styled(ButtonDefault)<CheckBoxProps>`` : (stryCov_9fa48("3978"), styled(ButtonDefault)<CheckBoxProps>`
  position: absolute;
  width: 53px;
  display: ${stryMutAct_9fa48("3979") ? () => undefined : (stryCov_9fa48("3979"), ({
  hasGroup
}) => hasGroup ? stryMutAct_9fa48("3980") ? "" : (stryCov_9fa48("3980"), 'flex') : stryMutAct_9fa48("3981") ? "" : (stryCov_9fa48("3981"), 'none'))};
  align-items: center;
  justify-content: center;
  height: ${RULE_OPERATOR}px;
  top: ${stryMutAct_9fa48("3982") ? () => undefined : (stryCov_9fa48("3982"), ({
  top
}) => stryMutAct_9fa48("3983") ? `` : (stryCov_9fa48("3983"), `${top}px`))};
  right: ${stryMutAct_9fa48("3984") ? () => undefined : (stryCov_9fa48("3984"), ({
  isClause
}) => isClause ? stryMutAct_9fa48("3985") ? "" : (stryCov_9fa48("3985"), '-66px') : stryMutAct_9fa48("3986") ? "" : (stryCov_9fa48("3986"), '-106px'))};
  background-color: ${stryMutAct_9fa48("3987") ? () => undefined : (stryCov_9fa48("3987"), ({
  theme
}) => theme.segments.operator)};
  z-index: ${stryMutAct_9fa48("3988") ? () => undefined : (stryCov_9fa48("3988"), ({
  theme
}) => theme.zIndex.OVER_1)};
  border-radius: 4px;
  padding: 0;
`);
const InputOperator = stryMutAct_9fa48("3989") ? styled(InputComponent)`` : (stryCov_9fa48("3989"), styled(InputComponent)`
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
`);
const Select = stryMutAct_9fa48("3990") ? styled(SelectComponent.Single)`` : (stryCov_9fa48("3990"), styled(SelectComponent.Single)`
  width: 130px;
  margin: 0 40px;
`);
const ClauseButton = stryMutAct_9fa48("3991") ? styled(ButtonDefault)`` : (stryCov_9fa48("3991"), styled(ButtonDefault)`
  display: flex;
  align-items: center;
  border: 1px solid #fff;
  background-color: transparent;
  margin-top: ${BUTTON_RULE_MARGIN}px;
  margin-left: 0px;

  > i {
    margin-right: 5px;
  }
`);
const SubmitButton = stryMutAct_9fa48("3992") ? styled(ButtonDefault)`` : (stryCov_9fa48("3992"), styled(ButtonDefault)`
  margin-top: 40px;
`);
export default stryMutAct_9fa48("3993") ? {} : (stryCov_9fa48("3993"), {
  Form,
  Group,
  Clause,
  Rule,
  Input,
  RuleTrash,
  InputOperator,
  Operator,
  Select,
  Button: stryMutAct_9fa48("3994") ? {} : (stryCov_9fa48("3994"), {
    Submit: SubmitButton,
    Clause: ClauseButton,
    Icon: IconButton
  })
});