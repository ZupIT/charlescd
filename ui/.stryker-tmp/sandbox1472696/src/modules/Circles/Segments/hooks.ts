// @ts-nocheck
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

import { useEffect, useState } from 'react';
import { ArrayField } from 'react-hook-form';
import filter from 'lodash/filter';
import { CLAUSE, RULE } from './constants';
const ONE = 1;
type Form = {
  getValues: Function;
  setValue: (name: string, value: Record<string, string>) => void;
};
type FieldArray = {
  append: Function;
  remove: (index?: number | number[] | undefined) => void;
  insert: (index: number, value: Partial<Record<string, string>> | Partial<Record<string, string>>[]) => void;
};
type Group = Partial<ArrayField<Record<string, string>, 'id'>>;

const updateRule = (form: Form, groupIndex: number) => {
  if (stryMutAct_9fa48("3876")) {
    {}
  } else {
    stryCov_9fa48("3876");
    const groups = form.getValues(stryMutAct_9fa48("3877") ? {} : (stryCov_9fa48("3877"), {
      nest: stryMutAct_9fa48("3878") ? false : (stryCov_9fa48("3878"), true)
    }));
    const rule = groups.clauses[groupIndex];
    return stryMutAct_9fa48("3879") ? {} : (stryCov_9fa48("3879"), { ...CLAUSE,
      clauses: stryMutAct_9fa48("3880") ? [] : (stryCov_9fa48("3880"), [rule, RULE])
    });
  }
};

const updateGroup = (form: Form, groupIndex: number) => {
  if (stryMutAct_9fa48("3881")) {
    {}
  } else {
    stryCov_9fa48("3881");
    const groups = form.getValues(stryMutAct_9fa48("3882") ? {} : (stryCov_9fa48("3882"), {
      nest: stryMutAct_9fa48("3883") ? false : (stryCov_9fa48("3883"), true)
    }));
    const group = groups.clauses[groupIndex];
    return stryMutAct_9fa48("3884") ? {} : (stryCov_9fa48("3884"), { ...group,
      clauses: stryMutAct_9fa48("3885") ? [] : (stryCov_9fa48("3885"), [...group.clauses, RULE])
    });
  }
};

const addField = (form: Form, group: Group, groupIndex: number) => {
  if (stryMutAct_9fa48("3886")) {
    {}
  } else {
    stryCov_9fa48("3886");

    if (stryMutAct_9fa48("3889") ? group.type !== 'RULE' : stryMutAct_9fa48("3888") ? false : stryMutAct_9fa48("3887") ? true : (stryCov_9fa48("3887", "3888", "3889"), group.type === (stryMutAct_9fa48("3890") ? "" : (stryCov_9fa48("3890"), 'RULE')))) {
      if (stryMutAct_9fa48("3891")) {
        {}
      } else {
        stryCov_9fa48("3891");
        return updateRule(form, groupIndex);
      }
    }

    if (stryMutAct_9fa48("3894") ? group.type !== 'CLAUSE' : stryMutAct_9fa48("3893") ? false : stryMutAct_9fa48("3892") ? true : (stryCov_9fa48("3892", "3893", "3894"), group.type === (stryMutAct_9fa48("3895") ? "" : (stryCov_9fa48("3895"), 'CLAUSE')))) {
      if (stryMutAct_9fa48("3896")) {
        {}
      } else {
        stryCov_9fa48("3896");
        return updateGroup(form, groupIndex);
      }
    }
  }
};

const removeClause = (form: Form, groupIndex: number, clauseIndex: number) => {
  if (stryMutAct_9fa48("3897")) {
    {}
  } else {
    stryCov_9fa48("3897");
    const groups = form.getValues(stryMutAct_9fa48("3898") ? {} : (stryCov_9fa48("3898"), {
      nest: stryMutAct_9fa48("3899") ? false : (stryCov_9fa48("3899"), true)
    }));
    const clause = groups.clauses[groupIndex];
    const clauses = filter(clause.clauses, stryMutAct_9fa48("3900") ? () => undefined : (stryCov_9fa48("3900"), (c, index: number) => stryMutAct_9fa48("3903") ? index === clauseIndex : stryMutAct_9fa48("3902") ? false : stryMutAct_9fa48("3901") ? true : (stryCov_9fa48("3901", "3902", "3903"), index !== clauseIndex)));

    if (stryMutAct_9fa48("3907") ? clauses.length <= ONE : stryMutAct_9fa48("3906") ? clauses.length >= ONE : stryMutAct_9fa48("3905") ? false : stryMutAct_9fa48("3904") ? true : (stryCov_9fa48("3904", "3905", "3906", "3907"), clauses.length > ONE)) {
      if (stryMutAct_9fa48("3908")) {
        {}
      } else {
        stryCov_9fa48("3908");
        return stryMutAct_9fa48("3909") ? {} : (stryCov_9fa48("3909"), { ...CLAUSE,
          clauses
        });
      }
    }

    const [rule] = clauses;
    return rule;
  }
};

export const useSegment = ({
  append,
  insert,
  remove
}: FieldArray, form: Form) => {
  if (stryMutAct_9fa48("3910")) {
    {}
  } else {
    stryCov_9fa48("3910");
    const init = stryMutAct_9fa48("3911") ? +ONE : (stryCov_9fa48("3911"), -ONE);
    const [removeIndex, setRemoveIndex] = useState(init);
    const addGroup = stryMutAct_9fa48("3912") ? () => undefined : (stryCov_9fa48("3912"), (() => {
      const addGroup = () => append(RULE);

      return addGroup;
    })());

    const addRule = (index: number, group: Group) => {
      if (stryMutAct_9fa48("3913")) {
        {}
      } else {
        stryCov_9fa48("3913");
        const after = stryMutAct_9fa48("3914") ? index - ONE : (stryCov_9fa48("3914"), index + ONE);
        const updatedGroup = addField(form, group, index);
        insert(after, updatedGroup);
        setRemoveIndex(index);
      }
    };

    const removeRule = (group: Group, groupIndex: number, clauseIndex?: number) => {
      if (stryMutAct_9fa48("3915")) {
        {}
      } else {
        stryCov_9fa48("3915");

        if (stryMutAct_9fa48("3918") ? group.type !== 'RULE' : stryMutAct_9fa48("3917") ? false : stryMutAct_9fa48("3916") ? true : (stryCov_9fa48("3916", "3917", "3918"), group.type === (stryMutAct_9fa48("3919") ? "" : (stryCov_9fa48("3919"), 'RULE')))) {
          if (stryMutAct_9fa48("3920")) {
            {}
          } else {
            stryCov_9fa48("3920");
            remove(groupIndex);
          }
        } else if (stryMutAct_9fa48("3923") ? group.type !== 'CLAUSE' : stryMutAct_9fa48("3922") ? false : stryMutAct_9fa48("3921") ? true : (stryCov_9fa48("3921", "3922", "3923"), group.type === (stryMutAct_9fa48("3924") ? "" : (stryCov_9fa48("3924"), 'CLAUSE')))) {
          if (stryMutAct_9fa48("3925")) {
            {}
          } else {
            stryCov_9fa48("3925");
            const remainedGroup = removeClause(form, groupIndex, clauseIndex);
            const after = stryMutAct_9fa48("3926") ? groupIndex - ONE : (stryCov_9fa48("3926"), groupIndex + ONE);
            insert(after, remainedGroup);
            setRemoveIndex(groupIndex);
          }
        }
      }
    };

    useEffect(() => {
      if (stryMutAct_9fa48("3927")) {
        {}
      } else {
        stryCov_9fa48("3927");

        if (stryMutAct_9fa48("3930") ? removeIndex === init : stryMutAct_9fa48("3929") ? false : stryMutAct_9fa48("3928") ? true : (stryCov_9fa48("3928", "3929", "3930"), removeIndex !== init)) {
          if (stryMutAct_9fa48("3931")) {
            {}
          } else {
            stryCov_9fa48("3931");
            remove(removeIndex);
            setRemoveIndex(init);
          }
        }
      }
    }, stryMutAct_9fa48("3932") ? [] : (stryCov_9fa48("3932"), [removeIndex, remove, init]));
    return stryMutAct_9fa48("3933") ? {} : (stryCov_9fa48("3933"), {
      addGroup,
      addRule,
      removeRule
    });
  }
};