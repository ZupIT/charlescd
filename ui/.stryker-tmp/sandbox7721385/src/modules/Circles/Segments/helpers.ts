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

import { ArrayField } from 'react-hook-form';
import size from 'lodash/size';
import options from './conditional.options';
import { RULE_SIZE, RULE_OPERATOR, BUTTON_RULE } from './constants';
const HALF = 2;
const PIXEL = 1;
export const getCondition = stryMutAct_9fa48("3789") ? () => undefined : (stryCov_9fa48("3789"), (() => {
  const getCondition = (condition: string) => options.find(stryMutAct_9fa48("3790") ? () => undefined : (stryCov_9fa48("3790"), ({
    value
  }) => stryMutAct_9fa48("3793") ? condition !== value : stryMutAct_9fa48("3792") ? false : stryMutAct_9fa48("3791") ? true : (stryCov_9fa48("3791", "3792", "3793"), condition === value)));

  return getCondition;
})());
export const getClauseOperatorPosition = stryMutAct_9fa48("3794") ? () => undefined : (stryCov_9fa48("3794"), (() => {
  const getClauseOperatorPosition = (size: number) => stryMutAct_9fa48("3795") ? (stryMutAct_9fa48("3797") ? RULE_SIZE * size * HALF : (stryCov_9fa48("3797"), (stryMutAct_9fa48("3798") ? RULE_SIZE / size : (stryCov_9fa48("3798"), RULE_SIZE * size)) / HALF)) + (stryMutAct_9fa48("3799") ? RULE_SIZE * HALF : (stryCov_9fa48("3799"), RULE_SIZE / HALF)) + RULE_OPERATOR / HALF : (stryCov_9fa48("3795"), (stryMutAct_9fa48("3796") ? (stryMutAct_9fa48("3798") ? RULE_SIZE / size : (stryCov_9fa48("3798"), RULE_SIZE * size)) / HALF - RULE_SIZE / HALF : (stryCov_9fa48("3796"), (stryMutAct_9fa48("3797") ? RULE_SIZE * size * HALF : (stryCov_9fa48("3797"), (stryMutAct_9fa48("3798") ? RULE_SIZE / size : (stryCov_9fa48("3798"), RULE_SIZE * size)) / HALF)) + (stryMutAct_9fa48("3799") ? RULE_SIZE * HALF : (stryCov_9fa48("3799"), RULE_SIZE / HALF)))) - (stryMutAct_9fa48("3800") ? RULE_OPERATOR * HALF : (stryCov_9fa48("3800"), RULE_OPERATOR / HALF)));

  return getClauseOperatorPosition;
})());
export const getClauseVerticalLine = stryMutAct_9fa48("3801") ? () => undefined : (stryCov_9fa48("3801"), (() => {
  const getClauseVerticalLine = (size: number) => stryMutAct_9fa48("3802") ? RULE_SIZE * size + RULE_SIZE : (stryCov_9fa48("3802"), (stryMutAct_9fa48("3803") ? RULE_SIZE / size : (stryCov_9fa48("3803"), RULE_SIZE * size)) - RULE_SIZE);

  return getClauseVerticalLine;
})());
export const getClauseHorizontalLine = stryMutAct_9fa48("3804") ? () => undefined : (stryCov_9fa48("3804"), (() => {
  const getClauseHorizontalLine = (size: number) => stryMutAct_9fa48("3805") ? (stryMutAct_9fa48("3807") ? ((stryMutAct_9fa48("3809") ? size / RULE_SIZE : (stryCov_9fa48("3809"), size * RULE_SIZE)) - RULE_SIZE) * HALF : (stryCov_9fa48("3807"), (stryMutAct_9fa48("3808") ? size * RULE_SIZE + RULE_SIZE : (stryCov_9fa48("3808"), (stryMutAct_9fa48("3809") ? size / RULE_SIZE : (stryCov_9fa48("3809"), size * RULE_SIZE)) - RULE_SIZE)) / HALF)) + RULE_SIZE + PIXEL : (stryCov_9fa48("3805"), (stryMutAct_9fa48("3806") ? (stryMutAct_9fa48("3808") ? size * RULE_SIZE + RULE_SIZE : (stryCov_9fa48("3808"), (stryMutAct_9fa48("3809") ? size / RULE_SIZE : (stryCov_9fa48("3809"), size * RULE_SIZE)) - RULE_SIZE)) / HALF - RULE_SIZE : (stryCov_9fa48("3806"), (stryMutAct_9fa48("3807") ? ((stryMutAct_9fa48("3809") ? size / RULE_SIZE : (stryCov_9fa48("3809"), size * RULE_SIZE)) - RULE_SIZE) * HALF : (stryCov_9fa48("3807"), (stryMutAct_9fa48("3808") ? size * RULE_SIZE + RULE_SIZE : (stryCov_9fa48("3808"), (stryMutAct_9fa48("3809") ? size / RULE_SIZE : (stryCov_9fa48("3809"), size * RULE_SIZE)) - RULE_SIZE)) / HALF)) + RULE_SIZE)) - PIXEL);

  return getClauseHorizontalLine;
})());
const getGroupClauseHeight = stryMutAct_9fa48("3810") ? () => undefined : (stryCov_9fa48("3810"), (() => {
  const getGroupClauseHeight = (size: number) => stryMutAct_9fa48("3811") ? ((stryMutAct_9fa48("3813") ? size / RULE_SIZE : (stryCov_9fa48("3813"), size * RULE_SIZE)) - RULE_SIZE) * HALF : (stryCov_9fa48("3811"), (stryMutAct_9fa48("3812") ? size * RULE_SIZE + RULE_SIZE : (stryCov_9fa48("3812"), (stryMutAct_9fa48("3813") ? size / RULE_SIZE : (stryCov_9fa48("3813"), size * RULE_SIZE)) - RULE_SIZE)) / HALF);

  return getGroupClauseHeight;
})());
export const getGroupVerticalLine = (fields: Partial<ArrayField<Record<string, string>, 'id'>>[]) => {
  if (stryMutAct_9fa48("3814")) {
    {}
  } else {
    stryCov_9fa48("3814");
    let height = 0;
    let top = 0;
    let firstGroupIsRule = stryMutAct_9fa48("3815") ? true : (stryCov_9fa48("3815"), false);
    const first = 0;
    stryMutAct_9fa48("3816") ? fields.forEach((field, index) => {
      const isMiddleGroup = index > first && index < fields.length - 1;

      if (index === first) {
        top = field.type === 'CLAUSE' ? getClauseHorizontalLine(size(field.clauses)) : RULE_SIZE;
        firstGroupIsRule = field.type === 'RULE';
        height += firstGroupIsRule ? 0 : getGroupClauseHeight(size(field.clauses));
      } else if (field.type === 'RULE') {
        height += RULE_SIZE;
      } else if (field.type === 'CLAUSE' && isMiddleGroup) {
        height += size(field.clauses) * RULE_SIZE;
      } else if (field.type === 'CLAUSE') {
        height += getGroupClauseHeight(size(field.clauses)) + RULE_SIZE;
      }
    }) : (stryCov_9fa48("3816"), fields?.forEach((field, index) => {
      if (stryMutAct_9fa48("3817")) {
        {}
      } else {
        stryCov_9fa48("3817");
        const isMiddleGroup = stryMutAct_9fa48("3820") ? index > first || index < fields.length - 1 : stryMutAct_9fa48("3819") ? false : stryMutAct_9fa48("3818") ? true : (stryCov_9fa48("3818", "3819", "3820"), (stryMutAct_9fa48("3824") ? index <= first : stryMutAct_9fa48("3823") ? index >= first : stryMutAct_9fa48("3822") ? false : stryMutAct_9fa48("3821") ? true : (stryCov_9fa48("3821", "3822", "3823", "3824"), index > first)) && (stryMutAct_9fa48("3828") ? index >= fields.length - 1 : stryMutAct_9fa48("3827") ? index <= fields.length - 1 : stryMutAct_9fa48("3826") ? false : stryMutAct_9fa48("3825") ? true : (stryCov_9fa48("3825", "3826", "3827", "3828"), index < (stryMutAct_9fa48("3829") ? fields.length + 1 : (stryCov_9fa48("3829"), fields.length - 1)))));

        if (stryMutAct_9fa48("3832") ? index !== first : stryMutAct_9fa48("3831") ? false : stryMutAct_9fa48("3830") ? true : (stryCov_9fa48("3830", "3831", "3832"), index === first)) {
          if (stryMutAct_9fa48("3833")) {
            {}
          } else {
            stryCov_9fa48("3833");
            top = (stryMutAct_9fa48("3836") ? field.type !== 'CLAUSE' : stryMutAct_9fa48("3835") ? false : stryMutAct_9fa48("3834") ? true : (stryCov_9fa48("3834", "3835", "3836"), field.type === (stryMutAct_9fa48("3837") ? "" : (stryCov_9fa48("3837"), 'CLAUSE')))) ? getClauseHorizontalLine(size(field.clauses)) : RULE_SIZE;
            firstGroupIsRule = stryMutAct_9fa48("3840") ? field.type !== 'RULE' : stryMutAct_9fa48("3839") ? false : stryMutAct_9fa48("3838") ? true : (stryCov_9fa48("3838", "3839", "3840"), field.type === (stryMutAct_9fa48("3841") ? "" : (stryCov_9fa48("3841"), 'RULE')));
            height += firstGroupIsRule ? 0 : getGroupClauseHeight(size(field.clauses));
          }
        } else if (stryMutAct_9fa48("3844") ? field.type !== 'RULE' : stryMutAct_9fa48("3843") ? false : stryMutAct_9fa48("3842") ? true : (stryCov_9fa48("3842", "3843", "3844"), field.type === (stryMutAct_9fa48("3845") ? "" : (stryCov_9fa48("3845"), 'RULE')))) {
          if (stryMutAct_9fa48("3846")) {
            {}
          } else {
            stryCov_9fa48("3846");
            height += RULE_SIZE;
          }
        } else if (stryMutAct_9fa48("3849") ? field.type === 'CLAUSE' || isMiddleGroup : stryMutAct_9fa48("3848") ? false : stryMutAct_9fa48("3847") ? true : (stryCov_9fa48("3847", "3848", "3849"), (stryMutAct_9fa48("3852") ? field.type !== 'CLAUSE' : stryMutAct_9fa48("3851") ? false : stryMutAct_9fa48("3850") ? true : (stryCov_9fa48("3850", "3851", "3852"), field.type === (stryMutAct_9fa48("3853") ? "" : (stryCov_9fa48("3853"), 'CLAUSE')))) && isMiddleGroup)) {
          if (stryMutAct_9fa48("3854")) {
            {}
          } else {
            stryCov_9fa48("3854");
            height += stryMutAct_9fa48("3855") ? size(field.clauses) / RULE_SIZE : (stryCov_9fa48("3855"), size(field.clauses) * RULE_SIZE);
          }
        } else if (stryMutAct_9fa48("3858") ? field.type !== 'CLAUSE' : stryMutAct_9fa48("3857") ? false : stryMutAct_9fa48("3856") ? true : (stryCov_9fa48("3856", "3857", "3858"), field.type === (stryMutAct_9fa48("3859") ? "" : (stryCov_9fa48("3859"), 'CLAUSE')))) {
          if (stryMutAct_9fa48("3860")) {
            {}
          } else {
            stryCov_9fa48("3860");
            height += stryMutAct_9fa48("3861") ? getGroupClauseHeight(size(field.clauses)) - RULE_SIZE : (stryCov_9fa48("3861"), getGroupClauseHeight(size(field.clauses)) + RULE_SIZE);
          }
        }
      }
    }));
    const sumButtons = stryMutAct_9fa48("3862") ? fields.length * BUTTON_RULE + BUTTON_RULE : (stryCov_9fa48("3862"), (stryMutAct_9fa48("3863") ? fields.length / BUTTON_RULE : (stryCov_9fa48("3863"), fields.length * BUTTON_RULE)) - BUTTON_RULE);
    height += sumButtons;
    const operator = stryMutAct_9fa48("3864") ? (stryMutAct_9fa48("3866") ? height * HALF : (stryCov_9fa48("3866"), height / HALF)) + top + RULE_OPERATOR / HALF : (stryCov_9fa48("3864"), (stryMutAct_9fa48("3865") ? height / HALF - top : (stryCov_9fa48("3865"), (stryMutAct_9fa48("3866") ? height * HALF : (stryCov_9fa48("3866"), height / HALF)) + top)) - (stryMutAct_9fa48("3867") ? RULE_OPERATOR * HALF : (stryCov_9fa48("3867"), RULE_OPERATOR / HALF)));
    return stryMutAct_9fa48("3868") ? {} : (stryCov_9fa48("3868"), {
      top,
      height,
      operator
    });
  }
};
export const changeOperatorValue = (name: string, form: {
  getValues: Function;
  watch: Function;
  setValue: Function;
}) => {
  if (stryMutAct_9fa48("3869")) {
    {}
  } else {
    stryCov_9fa48("3869");
    const newValue = (stryMutAct_9fa48("3872") ? form.getValues(name) !== 'AND' : stryMutAct_9fa48("3871") ? false : stryMutAct_9fa48("3870") ? true : (stryCov_9fa48("3870", "3871", "3872"), form.getValues(name) === (stryMutAct_9fa48("3873") ? "" : (stryCov_9fa48("3873"), 'AND')))) ? stryMutAct_9fa48("3874") ? "" : (stryCov_9fa48("3874"), 'OR') : stryMutAct_9fa48("3875") ? "" : (stryCov_9fa48("3875"), 'AND');
    form.setValue(name, newValue);
  }
};