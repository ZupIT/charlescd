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

import React from 'react';
import { ArrayField, useFormContext } from 'react-hook-form';
import options from './conditional.options';
import { getCondition } from './helpers';
import Styled from './styled';

export interface Props {
  prefixName: string;
  viewMode: boolean;
  rule: Partial<
    ArrayField<
      Record<string, { condition: string; key: string; value: string }>,
      'id'
    >
  >;
  isGroup?: boolean;
  onRemoveRule?: Function;
  hasGroup?: boolean;
}

const Rule = ({
  prefixName,
  rule,
  viewMode,
  isGroup,
  onRemoveRule,
  hasGroup
}: Props) => {
  const { register, control } = useFormContext();

  return (
    <Styled.Rule data-testid="segments-rules" isGroup={isGroup} hasGroups={hasGroup} viewMode={viewMode}>
      <Styled.RuleTrash>
        {hasGroup && (
          <Styled.Button.Icon
            name="trash"
            size="15px"
            color="light"
            onClick={() => onRemoveRule()}
          />
        )}
      </Styled.RuleTrash>
      <Styled.Input
        type="hidden"
        ref={register}
        name={`${prefixName}.type`}
        defaultValue="RULE"
      />
      <Styled.Input
        label="Key"
        ref={register({ required: true })}
        disabled={viewMode}
        name={`${prefixName}.content.key`}
        defaultValue={rule?.content?.key}
      />
      <Styled.Select
        options={options}
        control={control}
        rules={{ required: true }}
        label="Conditional"
        isDisabled={viewMode}
        defaultValue={getCondition(rule?.content?.condition)}
        name={`${prefixName}.content.condition`}
      />
      <Styled.Input
        label="Value"
        ref={register}
        disabled={viewMode}
        name={`${prefixName}.content.value[0]`}
        defaultValue={rule?.content?.value}
      />
    </Styled.Rule>
  );
};

export default Rule;
