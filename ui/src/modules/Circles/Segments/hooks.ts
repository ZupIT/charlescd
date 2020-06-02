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
  insert: (
    index: number,
    value: Partial<Record<string, string>> | Partial<Record<string, string>>[]
  ) => void;
};

type Group = Partial<ArrayField<Record<string, string>, 'id'>>;

const updateRule = (form: Form, groupIndex: number) => {
  const groups = form.getValues({ nest: true });
  const rule = groups.clauses[groupIndex];

  return {
    ...CLAUSE,
    clauses: [rule, RULE]
  };
};

const updateGroup = (form: Form, groupIndex: number) => {
  const groups = form.getValues({ nest: true });
  const group = groups.clauses[groupIndex];

  return {
    ...group,
    clauses: [...group.clauses, RULE]
  };
};

const addField = (form: Form, group: Group, groupIndex: number) => {
  if (group.type === 'RULE') {
    return updateRule(form, groupIndex);
  }
  if (group.type === 'CLAUSE') {
    return updateGroup(form, groupIndex);
  }
};

const removeClause = (form: Form, groupIndex: number, clauseIndex: number) => {
  const groups = form.getValues({ nest: true });
  const clause = groups.clauses[groupIndex];

  const clauses = filter(
    clause.clauses,
    (c, index: number) => index !== clauseIndex
  );

  if (clauses.length > ONE) {
    return {
      ...CLAUSE,
      clauses
    };
  }

  const [rule] = clauses;
  return rule;
};

export const useSegment = (
  { append, insert, remove }: FieldArray,
  form: Form
) => {
  const init = -ONE;
  const [removeIndex, setRemoveIndex] = useState(init);

  const addGroup = () => append(RULE);

  const addRule = (index: number, group: Group) => {
    const after = index + ONE;
    const updatedGroup = addField(form, group, index);
    insert(after, updatedGroup);
    setRemoveIndex(index);
  };

  const removeRule = (
    group: Group,
    groupIndex: number,
    clauseIndex?: number
  ) => {
    if (group.type === 'RULE') {
      remove(groupIndex);
    } else if (group.type === 'CLAUSE') {
      const remainedGroup = removeClause(form, groupIndex, clauseIndex);
      const after = groupIndex + ONE;

      insert(after, remainedGroup);
      setRemoveIndex(groupIndex);
    }
  };

  useEffect(() => {
    if (removeIndex !== init) {
      remove(removeIndex);
      setRemoveIndex(init);
    }
  }, [removeIndex, remove, init]);

  return { addGroup, addRule, removeRule };
};
